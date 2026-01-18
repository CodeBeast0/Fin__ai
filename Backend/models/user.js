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

    entertainment: {
      type: Number,
      default: 0,
    },
    variableExpenses: [{
      title: String,
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      }
    }],
    aiPlan: {
      monthlySplit: {
        entertainment: Number,
        savings: Number,
      },
      // Removed duplicate entertainment field from inside aiPlan as it's now at financeProfile level
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
  telegramUserId: {
    type: String,
    unique: true,
    sparse: true,
  },
  telegramLinkToken: {
    type: String,
    unique: true,
    sparse: true,
  },
});

export default mongoose.model("User", userSchema);
