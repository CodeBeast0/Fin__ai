import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000/api";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const app = express();
app.use(express.json()); // parse JSON from Telegram

const HELP_MESSAGE = `👋 Welcome to Fley Finance Bot!

I help you control your allowance 💰

Commands:
/link <token> - link your account
/spend <amount> <title> - add expense
/balance - show your allowance and savings
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
        let msg = `✅ Expense added: $${amount} for ${title}`;
        if (resApi.data.remainingEntertainment <= 0) {
          msg += "\n⚠️ Your entertainment budget is empty!";
        }
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: msg,
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
    } else {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "❓ Unknown command. Type /help to see available commands.",
      });
    }

    res.sendStatus(200); // always respond 200 to Telegram
  } catch (err) {
    console.error("Telegram bot error:", err.response?.data || err.message);
    // IMPORTANT: Return 200 even if there was an error sending the message,
    // otherwise Telegram will keep retrying the webhook forever.
    res.sendStatus(200);
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Telegram bot running on port ${PORT}`));
