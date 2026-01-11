import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAIPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/AiPlan", // match your backend route
        {
          withCredentials: true, // ← crucial to send cookies
        }
      );

      setAiPlan(response.data.data);
    } catch (err) {
      console.error("Error fetching AI plan:", err);
      setError(err.response?.data?.message || "Failed to load AI plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIPlan();
  }, []);

  if (loading) return <div>Loading AI plan...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {!aiPlan && <p>No financial plan available.</p>}

      {aiPlan && (
        <div>
          <h2>Monthly Split</h2>
          <p>Entertainment: ${aiPlan.monthlySplit.entertainment}</p>
          <p>Savings: ${aiPlan.monthlySplit.savings}</p>

          {aiPlan.goalPlan && (
            <>
              <h2>Goal Plan</h2>
              <p>Goal: {aiPlan.goalPlan.goal}</p>
              <p>Monthly Saving: ${aiPlan.goalPlan.monthlySaving}</p>
              <p>Months Needed: {aiPlan.goalPlan.monthsNeeded}</p>
            </>
          )}

          {aiPlan.savingsPurpose && (
            <>
              <h2>Savings Purpose</h2>
              <p>{aiPlan.savingsPurpose}</p>
            </>
          )}

          <h2>Discipline Rules</h2>
          <ul>
            {aiPlan.disciplineRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
