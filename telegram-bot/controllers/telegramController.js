import axios from "axios";

export const telegramWebhook = async (req, res) => {
  try {
    const update = req.body;
    console.log("Telegram update:", update);

    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

    
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `You said: ${text}`,
      });
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
