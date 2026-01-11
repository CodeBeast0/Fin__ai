import "dotenv/config";
import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

const run = async () => {
    try {
        console.log("Fetching available models...");
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        console.log("Available Models:");
        response.data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${model.name} (${model.version})`);
            }
        });

    } catch (error) {
        console.error("List Models Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
}

run();
