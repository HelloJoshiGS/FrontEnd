// src/pages/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import Header from '../../components/Header';
import SummaryCards from './SummaryCards';
import MonthlyChart from './MonthlyChart';
import CategoryPieChart from './CategoryPieChart';
import RecentTransactions from './RecentTransactions';
import './Dashboard.css';
import './DashboardCharts.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/expenses');
      const data = Array.isArray(res.data) ? res.data : res.data.expenses || [];
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* <Header /> */}
      <div className="dashboard">
        <h2>Dashboard</h2>
        <SummaryCards transactions={transactions} />

        <div className="dashboard-charts">
          <MonthlyChart transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </div>

        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
