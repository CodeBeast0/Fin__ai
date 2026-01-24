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

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and include both letters and numbers/symbols." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });


    const token = generateToken({ id: user._id, role: user.role });



    res.status(201).json({
      message: "User registered successfully",
      token,
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

    res.json({
      message: "Login successful",
      token,
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
  res.json({ message: "Logged out successfully" });
};

export const updateOnboarding = async (req, res) => {
  const { allowance, allowanceDate, expenses, goals } = req.body;

  try {
    const user = req.user;

    const updatedGoals = goals?.map((newGoal, index) => {
      const existingGoal = user.financeProfile?.goals?.[index];
      return {
        ...newGoal,
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

    if (hasGoals && aiPlan.goalPlan?.monthsNeeded) {
      const today = new Date();
      const estimatedDate = new Date(today);
      estimatedDate.setMonth(estimatedDate.getMonth() + aiPlan.goalPlan.monthsNeeded);

      if (user.financeProfile.goals[0]) {
        user.financeProfile.goals[0].estimatedDate = estimatedDate;
      }
    }

    user.financeProfile.aiPlan = aiPlan;
    user.financeProfile.entertainment = aiPlan.monthlySplit.entertainment;
    user.financeProfile.variableExpenses = [];

    if (!user.financeProfile.savingsHistory || user.financeProfile.savingsHistory.length === 0) {
      if (aiPlan.monthlySplit?.savings) {
        user.financeProfile.savingsHistory = [{
          date: new Date(),
          amount: aiPlan.monthlySplit.savings
        }];
      }
    }

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

    if (user.financeProfile?.allowanceDate && user.financeProfile?.aiPlan?.monthlySplit?.savings) {
      const today = new Date();
      const allowanceDay = user.financeProfile.allowanceDate;
      const monthlySavings = user.financeProfile.aiPlan.monthlySplit.savings;

      const savingsHistory = user.financeProfile.savingsHistory || [];
      const lastEntry = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1] : null;

      if (!lastEntry) {
        user.financeProfile.savingsHistory = [{
          date: today,
          amount: monthlySavings
        }];
        await user.save();
      } else {
        let checkDate = new Date(lastEntry.date);
        let currentSavings = lastEntry.amount || 0;
        let updated = false;

        checkDate.setMonth(checkDate.getMonth() + 1);
        checkDate.setDate(allowanceDay);

        while (checkDate <= today) {
          currentSavings += monthlySavings;
          user.financeProfile.savingsHistory.push({
            date: new Date(checkDate),
            amount: currentSavings
          });
          updated = true;

          checkDate.setMonth(checkDate.getMonth() + 1);
          checkDate.setDate(allowanceDay);
        }

        if (updated) {
          await user.save();
        }
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

export const telegramLink = async (req, res) => {
  try {
    const { token, telegramUserId } = req.body;
    console.log(`[API] Link Request - Token: '${token}', TelegramID: ${telegramUserId}`);


    const user = await User.findOne({ telegramLinkToken: token });

    if (!user) {
      console.log(`[API] Link Failed - No user found for token: '${token}'`);
      return res.json({ success: false, message: "Invalid or expired token" });
    }


    const existingUser = await User.findOne({ telegramUserId: telegramUserId.toString() });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      console.log(`[API] Link Failed - Telegram ID ${telegramUserId} already linked to ${existingUser.email}`);
      return res.json({ success: false, message: "This Telegram account is already linked to another user." });
    }

    console.log(`[API] Link Success - Found user: ${user.email}. Updating TelegramID...`);

    user.telegramUserId = telegramUserId;
    user.telegramLinkToken = undefined;
    await user.save();

    res.json({ success: true, user: { name: user.name } });
  } catch (err) {
    console.error("[API] Link Error Detailed:", err);
    res.status(500).json({ success: false, message: `Server error: ${err.message}` });
  }
}

export const Spend = async (req, res) => {
  try {
    const { telegramUserId, amount, title } = req.body;

    const user = await User.findOne({ telegramUserId });
    if (!user) return res.json({ success: false, message: "User not linked" });

    user.financeProfile.entertainment -= amount;
    if (!user.financeProfile.variableExpenses) user.financeProfile.variableExpenses = [];
    user.financeProfile.variableExpenses.push({ title, amount });

    if (user.financeProfile.entertainment < 0) {
      const deficit = Math.abs(user.financeProfile.entertainment);
      const savingsHistory = user.financeProfile.savingsHistory || [];

      if (savingsHistory.length > 0) {
        const lastEntry = savingsHistory[savingsHistory.length - 1];
        lastEntry.amount -= deficit;

        user.financeProfile.entertainment = 0;
      }
    }

    await user.save();

    const savingsHistory = user.financeProfile.savingsHistory || [];
    const totalSaved = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1].amount : 0;

    res.json({
      success: true,
      remainingEntertainment: user.financeProfile.entertainment,
      totalSaved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserByTelegramId = async (req, res) => {
  try {
    const telegramUserId = req.params.telegramId;
    const user = await User.findOne({ telegramUserId });
    if (!user) return res.json(null);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const addSaving = async (req, res) => {
  try {
    const { telegramUserId, amount } = req.body;

    const user = await User.findOne({ telegramUserId });
    if (!user) return res.json({ success: false, message: "User not linked" });

    if (!user.financeProfile.savingsHistory) {
      user.financeProfile.savingsHistory = [];
    }

    const savingsHistory = user.financeProfile.savingsHistory;

    if (savingsHistory.length > 0) {
      const lastEntry = savingsHistory[savingsHistory.length - 1];
      lastEntry.amount += amount;
    } else {
      user.financeProfile.savingsHistory.push({
        date: new Date(),
        amount: amount,
      });
    }

    await user.save();

    const newTotal = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1].amount : amount;

    res.json({
      success: true,
      totalSaved: newTotal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const generateTelegramToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[API] Generated Token for ${user.email}: ${token}`);

    user.telegramLinkToken = token;
    await user.save();

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
