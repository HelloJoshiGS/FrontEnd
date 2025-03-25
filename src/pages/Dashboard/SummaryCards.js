// src/pages/Dashboard/SummaryCards.js
import React from 'react';
import './SummaryCards.css';

const SummaryCards = ({ transactions }) => {
  const income = transactions.filter(t => t.type === 'income');
  const expense = transactions.filter(t => t.type === 'expense');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="summary-cards">
      <div className="card income">
        <p>Total Income</p>
        <h2>{totalIncome.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' })}</h2>

        {/* <span className="change positive">+12%</span> */}
      </div>
      <div className="card expense">
        <p>Total Expenses</p>
        <h2>{totalExpense.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' })}</h2>

        {/* <span className="change negative">+8%</span> */}
      </div>
      <div className="card balance">
        <p>Net Balance</p>
        <h2>{netBalance.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' })}</h2>

        {/* <span className="change neutral">+18%</span> */}
      </div>
    </div>
  );
};

export default SummaryCards;
