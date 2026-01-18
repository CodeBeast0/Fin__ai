import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";
import http from "http";

// Create a dummy server to satisfy Render's port requirement
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Telegram Bot is running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000/api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
console.log("🤖 Telegram bot is running...");

const HELP_MESSAGE = `👋 Welcome to Fley Finance Bot!

I help you control your allowance 💰

Commands:
/link <token> - link your account
/spend <amount> <title> - add expense
/balance - show your allowance and savings
/stats - show your spending stats
/help - this message`;

// Set commands for the menu button
bot.setMyCommands([
  { command: "/start", description: "Start the bot" },
  { command: "/balance", description: "Check balance" },
  { command: "/spend", description: "Add expense" },
  { command: "/stats", description: "View stats" },
  { command: "/link", description: "Link account" },
  { command: "/help", description: "Show help" },
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, HELP_MESSAGE);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, HELP_MESSAGE);
});

bot.onText(/\/link$/, (msg) => {
  bot.sendMessage(msg.chat.id, "💡 Usage: /link <token>\nYou can generate a token in the Fley Dashboard.");
});

bot.onText(/\/link (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1];

  try {
    const res = await axios.post(`${API_URL}/users/link-telegram`, {
      token,
      telegramUserId: chatId,
    });

    if (res.data.success) {
      bot.sendMessage(
        chatId,
        `✅ Linked successfully! Welcome, ${res.data.user.name}`,
      );
    } else {
      bot.sendMessage(chatId, `❌ Invalid or expired token.`);
    }
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(
      chatId,
      `❌ Something went wrong while linking your account.`,
    );
  }
});

bot.onText(/\/spend$/, (msg) => {
  bot.sendMessage(msg.chat.id, "💡 Usage: /spend <amount> <title>\nExample: /spend 10 Coffee");
});

bot.onText(/\/spend (\d+\.?\d*) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = parseFloat(match[1]);
  const title = match[2];

  try {
    const res = await axios.post(`${API_URL}/users/spend`, {
      telegramUserId: chatId,
      amount,
      title,
    });

    if (res.data.success) {
      bot.sendMessage(chatId, `✅ Expense added: $${amount} for ${title}`);

      if (res.data.remainingEntertainment <= 0) {
        bot.sendMessage(chatId, "⚠️ Your entertainment budget is empty!");
      }
    } else {
      bot.sendMessage(chatId, `❌ Failed to add expense: ${res.data.message}`);
    }
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(chatId, `❌ Something went wrong while adding expense.`);
  }
});

bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
    const user = res.data;

    if (!user) return bot.sendMessage(chatId, "❌ User not linked!");

    // Use the tracking entertainment field, or fallback to the plan's initial budget if not yet set
    const entertainment = user.financeProfile?.entertainment !== undefined
      ? user.financeProfile.entertainment
      : (user.financeProfile?.aiPlan?.monthlySplit?.entertainment || 0);
    const savingsHistory = user.financeProfile?.savingsHistory || [];
    const totalSaved = savingsHistory.length > 0 ? savingsHistory[savingsHistory.length - 1].amount : 0;

    bot.sendMessage(
      chatId,
      `💰 Your Financial Status:
      
📺 Entertainment: $${entertainment.toFixed(2)}
🏦 Total Saved: $${totalSaved.toFixed(2)}

Keep it up! 🚀`,
    );
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(chatId, "❌ Failed to fetch balance.");
  }
});

bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await axios.get(`${API_URL}/users/by-telegram/${chatId}`);
    const user = res.data;

    if (!user) return bot.sendMessage(chatId, "❌ User not linked!");

    const expenses = user.financeProfile?.expenses || [];
    const totalRecur = expenses.reduce((sum, e) => sum + e.amount, 0);

    const variableExpenses = user.financeProfile?.variableExpenses || [];
    const totalVariable = variableExpenses.reduce((sum, e) => sum + e.amount, 0);

    const totalSpent = totalRecur + totalVariable;

    const goals = user.financeProfile?.goals || [];
    const goalsList = goals.map(g => `🎯 ${g.name}: $${g.targetAmount}`).join("\n");

    bot.sendMessage(
      chatId,
      `📊 Your Spending Stats:

💸 Total recurring expenses: $${totalRecur.toFixed(2)}
🛒 Recent One-off spends: $${totalVariable.toFixed(2)}
📉 Total Spent: $${totalSpent.toFixed(2)}
📝 Recurring items: ${expenses.length}

${goals.length > 0 ? `Your Goals:\n${goalsList}` : "No goals set yet."}

Stay disciplined! 🛡️`,
    );
  } catch (err) {
    console.error(err.message);
    bot.sendMessage(chatId, "❌ Failed to fetch stats.");
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text || !msg.text.startsWith("/")) return;

  const validCommands = ["/start", "/link", "/spend", "/balance", "/stats", "/help"];
  const isKnownCommand = validCommands.some((cmd) => msg.text.startsWith(cmd));

  if (!isKnownCommand) {
    bot.sendMessage(
      chatId,
      "❓ Unknown command. Type /help to see available commands.",
    );
  }
});
