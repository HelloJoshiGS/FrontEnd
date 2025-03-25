// src/pages/Dashboard/CategoryPieChart.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './CategoryPieChart.css';

const COLORS = ['#8884d8', '#82ca9d', '#ff8042', '#FFBB28', '#00C49F', '#FF6666'];

const CategoryPieChart = ({ transactions }) => {
  const expenseData = transactions.filter(t => t.type === 'expense');
  const grouped = expenseData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([category, amount]) => ({ name: category, value: amount }));

  return (
    <div className="category-pie-chart">
      <h4>Expense Categories</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
