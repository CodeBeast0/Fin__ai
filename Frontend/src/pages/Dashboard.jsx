import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };

  const handleEditProfile = () => {
    navigate("/onboarding");
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await api.get("/users/me");
      setUser(userRes.data);

      if (!userRes.data.financeProfile?.aiPlan) {
        const planRes = await api.get("/users/AiPlan");
        setAiPlan(planRes.data.data);
      } else {
        setAiPlan(userRes.data.financeProfile.aiPlan);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/");
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading your financial insights...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-center max-w-md">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const chartData = aiPlan
    ? [
      { name: "Entertainment", value: aiPlan.monthlySplit.entertainment },
      { name: "Savings", value: aiPlan.monthlySplit.savings },
    ]
    : [];

  const COLORS = ["#3b82f6", "#10b981"];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              Welcome back, {user?.name.split(" ")[0]}
            </h1>
            <p className="text-gray-400 mt-1">
              Here's your financial breakdown
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#111] border border-gray-800 px-6 py-3 rounded-2xl flex flex-col items-end">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Monthly Allowance
              </span>
              <span className="text-2xl font-bold text-white">
                ${user?.financeProfile?.allowance}
              </span>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: AI Plan & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Saving Plan Card */}
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all duration-700"></div>

              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="flex-1 w-full">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    Smart Savings Plan
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                      <span className="text-gray-400">
                        Entertainment Budget
                      </span>
                      <span className="text-xl font-bold text-blue-400">
                        ${aiPlan?.monthlySplit.entertainment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                      <span className="text-gray-400">Monthly Savings</span>
                      <span className="text-xl font-bold text-green-400">
                        ${aiPlan?.monthlySplit.savings}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 h-64 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          borderColor: "#333",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                Financial Calendar
              </h2>
              <div className="calendar-container">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="custom-calendar"
                />
              </div>
            </div>

            {/* Savings Progress Card - Separate Block */}
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                  Savings Progress
                </h2>

                {/* Current Savings Display */}
                <div className="mb-6 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
                  <p className="text-sm text-gray-400 mb-2">Total Saved So Far</p>
                  <p className="text-4xl font-bold text-green-400">
                    ${user?.financeProfile?.savingsHistory && user.financeProfile.savingsHistory.length > 0
                      ? user.financeProfile.savingsHistory[user.financeProfile.savingsHistory.length - 1].amount
                      : 0}
                  </p>
                  {user?.financeProfile?.allowanceDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      Next update: {user.financeProfile.allowanceDate}{user.financeProfile.allowanceDate === 1 ? 'st' : user.financeProfile.allowanceDate === 2 ? 'nd' : user.financeProfile.allowanceDate === 3 ? 'rd' : 'th'} of next month
                    </p>
                  )}
                </div>

                {/* Line Chart */}
                {user?.financeProfile?.savingsHistory && user.financeProfile.savingsHistory.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={user.financeProfile.savingsHistory.map(entry => ({
                        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        amount: entry.amount
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                          dataKey="date"
                          stroke="#9ca3af"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis
                          stroke="#9ca3af"
                          style={{ fontSize: '12px' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            borderColor: "#333",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          formatter={(value) => [`$${value}`, 'Saved']}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-[#1a1a1a] rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-center">
                      Savings tracking will begin on your next allowance date
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discipline Rules */}
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">
                Discipline Rules
              </h2>
              <ul className="space-y-3">
                {aiPlan?.disciplineRules?.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-400"
                  >
                    <span className="text-blue-500 mt-1.5">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Goals & Expenses */}
          <div className="space-y-6">
            {/* Expenses List */}
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-semibold text-gray-300 mb-4 sticky top-0 bg-[#111] pb-2 border-b border-gray-800">
                Recurring Expenses
              </h3>
              <div className="space-y-3">
                {user?.financeProfile?.expenses?.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0 hover:bg-white/5 px-2 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400">{exp.title}</span>
                    <span className="text-white font-medium">
                      ${exp.amount}
                    </span>
                  </div>
                ))}
                {(!user?.financeProfile?.expenses ||
                  user.financeProfile.expenses.length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No recurring expenses logged.
                    </p>
                  )}
              </div>
            </div>
            {/* Goals with Progress Bars */}

            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 "></div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Savings Goals
              </h3>

              {user?.financeProfile?.goals &&
                user.financeProfile.goals.length > 0 ? (
                <div className="space-y-6">
                  {user.financeProfile.goals.map((goal, idx) => {
                    return (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500">
                              Goal {idx + 1}
                            </p>
                            <p className="text-lg font-bold text-white">
                              {goal.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Target</p>
                            <p className="text-lg text-white font-medium">
                              ${goal.targetAmount}
                            </p>
                          </div>
                        </div>

                        {/* Goal Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {aiPlan?.goalPlan && idx === 0 && (
                            <>
                              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                                <p className="text-gray-500 text-xs mb-1">
                                  Monthly Saving
                                </p>
                                <p className="text-blue-400 font-medium">
                                  ${aiPlan.goalPlan.monthlySaving}
                                </p>
                              </div>
                              <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                                <p className="text-gray-500 text-xs mb-1">
                                  Months Needed
                                </p>
                                <p className="text-purple-400 font-medium">
                                  {aiPlan.goalPlan.monthsNeeded} months
                                </p>
                              </div>
                            </>
                          )}
                          {goal.estimatedDate && (
                            <div className={`bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 ${aiPlan?.goalPlan && idx === 0 ? 'col-span-2' : 'col-span-2'}`}>
                              <p className="text-gray-500 text-xs mb-1">
                                Estimated Date
                              </p>
                              <p className="text-green-400 font-medium">
                                {new Date(goal.estimatedDate).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific goals set.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-calendar {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          color: white;
        }

        .custom-calendar .react-calendar__navigation button {
          color: white;
          font-size: 16px;
          font-weight: 600;
        }

        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #333;
          border-radius: 8px;
        }

        .custom-calendar .react-calendar__tile {
          color: #9ca3af;
          border-radius: 8px;
          padding: 12px;
        }

        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #333;
        }

        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }

        .custom-calendar .react-calendar__tile--now {
          background-color: #1e40af;
          color: white;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
