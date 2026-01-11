import express from "express";
import User from "../models/user.js";
import { generateToken, verifyToken } from "../config/jwt.js";
import bcrypt from "bcryptjs";
import { generateAIPlan } from "../services/ai.js"

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token for immediate login
    const token = generateToken({ id: user._id, role: user.role });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        financeProfile: user.financeProfile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
};

export const updateOnboarding = async (req, res) => {
  const { allowance, expenses, goals } = req.body;

  try {
    const user = req.user;

    user.financeProfile = {
      allowance: allowance || 0,
      expenses: expenses || [],
      goals: goals || [],
      aiPlan: {},
    };
    user.onboardingCompleted = true;

    await user.save();

    res.json({ message: "Onboarding completed", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const generateFinancialPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("financeProfile");

    if (!user || !user.financeProfile) {
      return res.status(400).json({
        message: "Finance profile not found"
      });
    }

    const { allowance, expenses = [], goals = [] } = user.financeProfile;

    if (!allowance) {
      return res.status(400).json({
        message: "Allowance is required"
      });
    }

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    const remaining = allowance - totalExpenses;

    if (remaining <= 0) {
      return res.status(400).json({
        message: "Expenses exceed or equal allowance"
      });
    }

    const hasGoals = goals.length > 0;

    const aiPayload = {
      monthlyAllowance: allowance,
      totalExpenses,
      remainingAfterExpenses: remaining,
      hasGoals,
      expenses: expenses.map(e => ({
        name: e.title,
        amount: e.amount
      })),
      goals: hasGoals
        ? goals.map((g, index) => ({
          priority: index + 1,
          name: g.name,
          amount: g.targetAmount
        }))
        : []
    };

    const aiPlan = await generateAIPlan(aiPayload);

    if (
      aiPlan.monthlySplit?.entertainment +
      aiPlan.monthlySplit?.savings !==
      remaining
    ) {
      return res.status(500).json({
        message: "Invalid AI plan calculation"
      });
    }

    res.json({
      success: true,
      data: aiPlan
    });

  } catch (error) {
    console.error("AI PLAN CONTROLLER ERROR:", error);
    res.status(500).json({
      message: "Failed to generate financial plan"
    });
  }
};
