import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
});

const goalSchema = new mongoose.Schema({
  name: String,
  targetAmount: Number,
  estimatedDate: Date,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  onboardingCompleted: {
    type: Boolean,
    default: false,
  },

  financeProfile: {
    allowance: {
      type: Number,
      default: 0,
    },

    allowanceDate: {
      type: Number,
      default: 1,
    },

    expenses: [expenseSchema],

    goals: [goalSchema],

    savingsHistory: [{
      date: Date,
      amount: Number,
    }],

    aiPlan: {
      monthlySplit: {
        entertainment: Number,
        savings: Number,
      },
      goalPlan: {
        goal: String,
        monthlySaving: Number,
        monthsNeeded: Number,
      },
      savingsPurpose: String,
      disciplineRules: [String],
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
