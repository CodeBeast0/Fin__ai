import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000/api";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const app = express();
app.use(express.json());

const HELP_MESSAGE = `👋 Welcome to Fley Finance Bot!

I help you control your allowance 💰

Commands:
/link <token> - link your account
/spend <amount> <title> - add expense
/balance - show your allowance and savings
/summary - show monthly summary
/last - show recent transactions
/stats - show your spending stats
/help - this message`;

// Telegram webhook route
app.post("/telegram-bot/webhook", async (req, res) => {
  const update = req.body;
  // console.log("Update received:", JSON.stringify(update, null, 2)); // Uncomment for debugging

  if (!update.message || !update.message.text) {
    return res.sendStatus(200); // ignore non-text messages
  }

  const chatId = update.message.chat.id;
  const text = update.message.text.trim();

  try {
    // --- Handle commands ---
    if (text === "/start" || text === "/help") {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: HELP_MESSAGE,
      });
    } else if (text.startsWith("/link")) {
      // Robust token parsing: splits by spaces and takes the second part
      const parts = text.split(/\s+/);
      const token = parts[1];

      if (!token) {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "💡 Usage: /link <token>\nYou can generate a token in the Fley Dashboard.",
        });
        return res.sendStatus(200);
      }

      console.log(`[BOT] Attempting to link with token: '${token}' for chat ID: ${chatId}`);

      try {
        const resApi = await axios.post(`${API_URL}/users/link-telegram`, {
          token,
          telegramUserId: chatId,
        });

        console.log("[BOT] Link API Response:", resApi.data);

        if (resApi.data.success) {
          await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: `✅ Linked successfully! Welcome, ${resApi.data.user.name}`,
          });
        } else {
          await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: `❌ Link failed: ${resApi.data.message || 'Invalid or expired token.'}`,
          });
        }
      } catch (apiError) {
        console.error("[BOT] Link API Error:", apiError.response?.data || apiError.message);
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "❌ Service unavailable. Please try again later.",
        });
      }
    } else if (text.startsWith("/spend ")) {
      const parts = text.split(" ");
      const amount = parseFloat(parts[1]);
      const title = parts.slice(2).join(" ");

      const resApi = await axios.post(`${API_URL}/users/spend`, {
        telegramUserId: chatId,
        amount,
        title,
      });

      if (resApi.data.success) {
        // 1. Success Message
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: `Expense added ${title} ....`,
        });

        // 2. Updated Balance Message
        const remaining = resApi.data.remainingEntertainment;
        const saved = resApi.data.totalSaved || 0;

        const balanceMsg = `💰 Updated Balance:\n\n📺 Entertainment left: $${remaining.toFixed(2)}\n🏦 Saved: $${saved.toFixed(2)}`;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: balanceMsg,
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: `❌ Failed to add expense: ${resApi.data.message}`,
        });
      }
    } else if (text === "/spend") {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "💡 Usage: /spend <amount> <title>\nExample: /spend 10 Coffee",
      });
    } else if (text === "/balance") {
      const resApi = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
      const user = resApi.data;

      if (!user) {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "❌ User not linked!",
        });
      } else {
        const entertainment = user.financeProfile?.entertainment ?? (user.financeProfile?.aiPlan?.monthlySplit?.entertainment || 0);
        const savingsHistory = user.financeProfile?.savingsHistory || [];
        const totalSaved = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1].amount : 0;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: `💰 Your Financial Status:\n\n📺 Entertainment: $${entertainment.toFixed(2)}\n🏦 Total Saved: $${totalSaved.toFixed(2)}\n\nKeep it up! 🚀`,
        });
      }
    } else if (text === "/stats") {
      const resApi = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
      const user = resApi.data;

      if (!user) {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "❌ User not linked!",
        });
      } else {
        const expenses = user.financeProfile?.expenses || [];
        const totalRecur = expenses.reduce((sum, e) => sum + e.amount, 0);

        const variableExpenses = user.financeProfile?.variableExpenses || [];
        const totalVariable = variableExpenses.reduce((sum, e) => sum + e.amount, 0);

        const totalSpent = totalRecur + totalVariable;

        const goals = user.financeProfile?.goals || [];
        const goalsList = goals.map(g => `🎯 ${g.name}: $${g.targetAmount}`).join("\n");

        const msg = `📊 Your Spending Stats:\n\n💸 Total recurring expenses: $${totalRecur.toFixed(2)}\n🛒 Recent One-off spends: $${totalVariable.toFixed(2)}\n📉 Total Spent: $${totalSpent.toFixed(2)}\n📝 Recurring items: ${expenses.length}\n\n${goals.length > 0 ? `Your Goals:\n${goalsList}` : "No goals set yet."}\n\nStay disciplined! 🛡️`;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: msg,
        });
      }
    } else if (text === "/summary") {
      const resApi = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
      const user = resApi.data;

      if (!user) {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "❌ User not linked!",
        });
      } else {
        const fp = user.financeProfile;

        // Calculate totals
        const allowance = fp?.allowance || 0;
        const expenses = fp?.expenses || [];
        const variableExpenses = fp?.variableExpenses || [];

        const totalRecurring = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalVariable = variableExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalSpent = totalRecurring + totalVariable;

        const entertainmentLeft = fp?.entertainment ?? (fp?.aiPlan?.monthlySplit?.entertainment || 0);

        // Savings
        const savingsHistory = fp?.savingsHistory || [];
        const totalSaved = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1].amount : 0;

        // Goals
        const goals = fp?.goals || [];
        let goalMsg = "🎯 Goal: None set";
        let timeMsg = "";

        if (goals.length > 0) {
          const goal = goals[0];
          goalMsg = `🎯 Goal: ${goal.name}`;

          if (goal.estimatedDate) {
            const today = new Date();
            const targetDate = new Date(goal.estimatedDate);
            const diffTime = Math.abs(targetDate - today);
            const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
            timeMsg = `⏳ ${diffMonths} months remaining`;
          }
        }

        const msg = `📊 Monthly Summary

💰 Allowance: $${allowance}
💸 Spent: $${totalSpent}
📺 Entertainment left: $${entertainmentLeft.toFixed(2)}
🏦 Saved: $${totalSaved.toFixed(2)}

${goalMsg}
${timeMsg}`;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: msg,
        });
      }
    } else if (text === "/last") {
      const resApi = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
      const user = resApi.data;

      if (!user) {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: "❌ User not linked!",
        });
      } else {
        const variableExpenses = user.financeProfile?.variableExpenses || [];

        if (variableExpenses.length === 0) {
          await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: "No recent transactions found.",
          });
        } else {
          // Get last 10 transactions, reversed
          const recent = variableExpenses.slice(-10).reverse();
          const list = recent.map(e => `• ${e.title}: $${e.amount}`).join("\n");

          await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: `Recent Transactions:\n\n${list}`,
          });
        }
      }
    } else {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "❓ Unknown command. Type /help to see available commands.",
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Telegram bot error:", err.response?.data || err.message);
    res.sendStatus(200);
  }
});

// --- Keep-Alive Mechanism ---
const SELF_URL = process.env.SELF_URL;
// e.g. https://my-bot.onrender.com
// You MUST set this env var in Render.

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

if (SELF_URL) {
  // Ping itself every 14 minutes (Render sleeps after 15m inactivity)
  setInterval(() => {
    axios.get(`${SELF_URL}/health`)
      .then(() => console.log(`[Keep-Alive] Pinged ${SELF_URL}`))
      .catch(err => console.error(`[Keep-Alive] Ping failed: ${err.message}`));
  }, 14 * 60 * 1000);
} else {
  console.warn("[Keep-Alive] SELF_URL not set. Bot may sleep on free hosting.");
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Telegram bot running on port ${PORT}`));
