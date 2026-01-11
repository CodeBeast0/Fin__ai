import axios from "axios";
import "dotenv/config";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateAIPlan = async (data) => {
  const {
    monthlyAllowance,
    totalExpenses,
    remainingAfterExpenses,
    expenses,
    goals,
    hasGoals,
  } = data;

  const baseRules = `
RULES:
- Expenses are already paid.
- Entertainment + savings MUST equal remainingAfterExpenses.
- Savings must NEVER exceed remainingAfterExpenses.
- Be realistic and disciplined.
`;

  const goalRules = hasGoals
    ? `
GOAL RULES:
- Goals are ordered by priority (priority 1 is the most important).
- Save ONLY for the highest priority goal.
- Do NOT split savings across multiple goals.
`
    : `
NO GOAL RULES:
- The user has no financial goals.
- Create a general savings plan (emergency fund).
- Encourage setting future goals.
`;

  const prompt = `
You are a personal finance AI assistant.

${baseRules}
${goalRules}

USER DATA:
Monthly allowance: ${monthlyAllowance}
Total expenses: ${totalExpenses}
Remaining money: ${remainingAfterExpenses}

Expenses:
${expenses.map((e) => `- ${e.name}: ${e.amount}`).join("\n")}

${hasGoals
      ? `
Goals:
${goals
        .map((g) => `- Priority ${g.priority}: ${g.name} (${g.amount})`)
        .join("\n")}
`
      : ""
    }

TASK:
Return ONLY valid JSON in this exact format:

{
  "monthlySplit": {
    "entertainment": number,
    "savings": number
  },
  ${hasGoals
      ? `"goalPlan": {
          "goal": string,
          "monthlySaving": number,
          "monthsNeeded": number
        },`
      : `"savingsPurpose": string,`
    }
  "disciplineRules": string[]
}
`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
    },
  };

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );


    let rawContent = response.data.candidates[0].content.parts[0].text;

    // Clean markdown if present
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Gemini JSON parse error. Raw response:", rawContent);
      throw new Error("AI returned invalid JSON.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Financial AI failed to generate plan.");
  }
};
