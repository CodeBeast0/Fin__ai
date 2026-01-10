import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allowance, setAllowance] = useState("");
  const [expenses, setExpenses] = useState([{ title: "", amount: "" }]);
  const [goals, setGoals] = useState([
    { name: "", targetAmount: "", deadline: "" },
  ]);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/users";

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };
  const addExpense = () =>
    setExpenses([...expenses, { title: "", amount: "" }]);
  const removeExpense = (index) =>
    setExpenses(expenses.filter((_, i) => i !== index));

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };
  const addGoal = () =>
    setGoals([...goals, { name: "", targetAmount: "", deadline: "" }]);
  const removeGoal = (index) => setGoals(goals.filter((_, i) => i !== index));

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!allowance || Number(allowance) <= 0) {
        setError("Monthly allowance must be a positive number");
        return false;
      }
    }
    if (step === 2) {
      const validExpenses = expenses.filter(e => e.title.trim() !== "" && e.amount && Number(e.amount) > 0);
      if (validExpenses.length === 0) {
        setError("Please add at least one valid expense (positive amount)");
        return false;
      }
    }
    if (step === 3) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let g of goals) {
        if (g.name || g.targetAmount || g.deadline) {
          if (Number(g.targetAmount) <= 0) {
            setError("Goal target amount must be positive");
            return false;
          }
          if (!g.deadline) {
            setError("Please select a deadline date");
            return false;
          }
          const d = new Date(g.deadline);
          if (d < today) {
            setError("Deadline must be in the future");
            return false;
          }
        }
      }
      
      
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Clean data before sending
      const cleanExpenses = expenses
        .filter((e) => e.title && e.amount)
        .map((e) => ({ ...e, amount: Number(e.amount) }));
      const cleanGoals = goals
        .filter((g) => g.name && g.targetAmount)
        .map((g) => ({ ...g, targetAmount: Number(g.targetAmount) }));

      const payload = {
        allowance: Number(allowance),
        expenses: cleanExpenses,
        goals: cleanGoals,
      };

      const response = await fetch(`${API_URL}/onboarding`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const finalSubmit = async () => {
    setLoading(true);
    try {
      const cleanExpenses = expenses
        .filter((e) => e.title && e.amount)
        .map((e) => ({ ...e, amount: Number(e.amount) }));
      const cleanGoals = goals
        .filter((g) => g.name && g.targetAmount)
        .map((g) => ({ ...g, targetAmount: Number(g.targetAmount) }));

      await fetch(`${API_URL}/onboarding`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allowance: Number(allowance),
          expenses: cleanExpenses,
          goals: cleanGoals,
        }),
        credentials: "include", 
      });

      navigate("/dashboard"); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-blue-500" : "bg-gray-800"
                  }`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-2">
            {step === 1 && "What's your monthly allowance?"}
            {step === 2 && "Add your recurring expenses"}
            {step === 3 && "Set your saving goals"}
          </h1>
          <p className="text-gray-400">
            {step === 1 && "This helps us calculate your budget."}
            {step === 2 && "Rent, subscriptions, bills, etc."}
            {step === 3 && "What are you saving for?"}
          </p>
        </div>

        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Monthly Allowance ($)
              </label>
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-blue-500"
                placeholder="0.00"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {expenses.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-row gap-2">
                    <input
                      placeholder="Netflix, Rent..."
                      value={exp.title}
                      onChange={(e) =>
                        handleExpenseChange(i, "title", e.target.value)
                      }
                      className="flex-1 bg-[#1a1a1a] placeholder:text-sm sm:placeholder:text-base w-3/4 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={exp.amount}
                      onChange={(e) =>
                        handleExpenseChange(i, "amount", e.target.value)
                      }
                      className=" bg-[#1a1a1a] w-1/2 border placeholder:text-sm sm:placeholder:text-base border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {expenses.length > 1 && (
                    <button
                      onClick={() => removeExpense(i)}
                      className="text-gray-500 hover:text-red-500 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addExpense}
                className="text-blue-400 text-sm font-medium hover:text-blue-300"
              >
                + Add another expense
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {goals.map((goal, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      placeholder="New Laptop..."
                      value={goal.name}
                      onChange={(e) =>
                        handleGoalChange(i, "name", e.target.value)
                      }
                      className="w-full bg-[#1a1a1a] placeholder:text-sm sm:placeholder:text-base border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={goal.targetAmount}
                        onChange={(e) =>
                          handleGoalChange(i, "targetAmount", e.target.value)
                        }
                        className="flex-1 w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="date"
                        value={goal.deadline}
                        onChange={(e) =>
                          handleGoalChange(i, "deadline", e.target.value)
                        }
                        className="flex-1 w-1/2 bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  {goals.length > 1 && (
                    <button
                      onClick={() => removeGoal(i)}
                      className="text-gray-500 hover:text-red-500 pt-3"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addGoal}
                className="text-blue-400 text-sm font-medium hover:text-blue-300"
              >
                + Add another goal
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-between pt-6 border-t border-gray-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  if (validateStep()) finalSubmit();
                }}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Finish Setup"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
