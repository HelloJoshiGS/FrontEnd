// src/pages/Dashboard/MonthlyChart.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import './MonthlyChart.css';

const MonthlyChart = ({ transactions }) => {
  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const income = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === month)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === month)
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      name: new Date(2024, month, 1).toLocaleString('default', { month: 'short' }),
      Income: income,
      Expenses: expense
    };
  });

  return (
    <div className="monthly-chart">
      <h4>Monthly Overview</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f44336" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
