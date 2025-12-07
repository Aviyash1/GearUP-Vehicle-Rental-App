import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./Finance.css";

function Finance() {
  const navigate = useNavigate();

  const financeData = [
    { month: "Jan", earnings: 1200, expenses: 400 },
    { month: "Feb", earnings: 1800, expenses: 500 },
    { month: "Mar", earnings: 2200, expenses: 700 },
    { month: "Apr", earnings: 2600, expenses: 600 },
    { month: "May", earnings: 2900, expenses: 800 },
    { month: "Jun", earnings: 3100, expenses: 900 },
  ];

  const totalEarnings = financeData.reduce((sum, d) => sum + d.earnings, 0);
  const totalExpenses = financeData.reduce((sum, d) => sum + d.expenses, 0);
  const netProfit = totalEarnings - totalExpenses;

  return (
    <div className="finance-container fade-in">
      <div className="finance-header">
        <h2 className="finance-title">Finance Overview</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="finance-summary">
        <div className="finance-card">
          <h3>${totalEarnings.toLocaleString()}</h3>
          <p>Total Earnings</p>
        </div>
        <div className="finance-card">
          <h3>${totalExpenses.toLocaleString()}</h3>
          <p>Total Expenses</p>
        </div>
        <div className="finance-card profit">
          <h3>${netProfit.toLocaleString()}</h3>
          <p>Net Profit</p>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="chart-title">Earnings vs Expenses (Monthly)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#2563eb"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3 className="chart-title">Profit Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="earnings" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Finance;
