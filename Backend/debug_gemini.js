import "dotenv/config";
import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

console.log("----------------------------------------");
console.log("Debugging Gemini API Connection");
console.log("API Key present:", !!API_KEY);
if (API_KEY) {
    console.log("API Key length:", API_KEY.length);
    console.log("API Key start:", API_KEY.substring(0, 4) + "...");
}
console.log("Target URL:", GEMINI_URL);
console.log("----------------------------------------");

const run = async () => {
    try {
        console.log("Sending test request...");
        const response = await axios.post(
            `${GEMINI_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: "Return this exact JSON: {\"test\": true}" }] }]
            },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Request Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

run();
