// src/pages/Dashboard/RecentTransactions.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="recent-transactions">
      <div className="rt-header">
        <h4>Recent Transactions</h4>
        <button onClick={() => navigate('/transactions')} className="see-all-btn">See All</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {recent.map(tx => (
            <tr key={tx._id}>
              <td><span className={`badge ${tx.type}`}>{tx.type}</span></td>
              <td>{typeof tx.amount === 'number' ? tx.amount.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' }) : '0'}</td>
              <td>{tx.category}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
