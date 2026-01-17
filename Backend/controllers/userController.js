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


    const token = generateToken({ id: user._id, role: user.role });



    // Set cookie
    // Set cookie manually to ensure Partitioned attribute is included
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}`
    );

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

    // Set cookie
    // Set cookie manually
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}`
    );

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
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully" });
};

export const updateOnboarding = async (req, res) => {
  const { allowance, allowanceDate, expenses, goals } = req.body;

  try {
    const user = req.user;

    // Preserve existing estimated dates if they exist
    const updatedGoals = goals?.map((newGoal, index) => {
      const existingGoal = user.financeProfile?.goals?.[index];
      return {
        ...newGoal,
        // Keep existing estimated date if present and new goal doesn't have one
        estimatedDate: newGoal.estimatedDate || existingGoal?.estimatedDate || null
      };
    }) || [];

    user.financeProfile = {
      allowance: allowance || 0,
      allowanceDate: allowanceDate || 1,
      expenses: expenses || [],
      goals: updatedGoals,
      savingsHistory: user.financeProfile?.savingsHistory || [],
      aiPlan: null, // Clear cached plan to force regeneration
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

    // Calculate and save estimated date to the first goal if AI provided it
    if (hasGoals && aiPlan.goalPlan?.monthsNeeded) {
      const today = new Date();
      const estimatedDate = new Date(today);
      estimatedDate.setMonth(estimatedDate.getMonth() + aiPlan.goalPlan.monthsNeeded);

      // Update the first goal (highest priority) with the estimated date
      if (user.financeProfile.goals[0]) {
        user.financeProfile.goals[0].estimatedDate = estimatedDate;
      }
    }

    user.financeProfile.aiPlan = aiPlan;
    await user.save();


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

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if we need to update savings based on allowance date
    if (user.financeProfile?.allowanceDate && user.financeProfile?.aiPlan?.monthlySplit?.savings) {
      const today = new Date();
      const allowanceDay = user.financeProfile.allowanceDate;
      const monthlySavings = user.financeProfile.aiPlan.monthlySplit.savings;

      // Get last savings entry
      const savingsHistory = user.financeProfile.savingsHistory || [];
      const lastEntry = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1] : null;
      const lastUpdate = lastEntry ? new Date(lastEntry.date) : null;

      let shouldUpdate = false;

      if (!lastUpdate) {
        // First time - initialize with monthly savings amount
        shouldUpdate = true;
        user.financeProfile.savingsHistory = [{
          date: today,
          amount: monthlySavings
        }];
      } else {
        // Check if we've passed the allowance date since last update
        const daysSinceUpdate = Math.floor((today - lastUpdate) / (1000 * 60 * 60 * 24));
        const currentDay = today.getDate();

        // If it's been at least a month and we've passed the allowance day
        if (daysSinceUpdate >= 28 && currentDay >= allowanceDay) {
          const lastUpdateDay = lastUpdate.getDate();

          // Only update if we haven't already updated this month
          if (lastUpdateDay < allowanceDay || today.getMonth() !== lastUpdate.getMonth()) {
            shouldUpdate = true;
            const currentSavings = lastEntry.amount || 0;
            user.financeProfile.savingsHistory.push({
              date: today,
              amount: currentSavings + monthlySavings
            });
          }
        }
      }

      if (shouldUpdate) {
        await user.save();
      }
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      onboardingCompleted: user.onboardingCompleted,
      financeProfile: user.financeProfile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
