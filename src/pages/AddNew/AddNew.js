// src/pages/AddTransaction.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddNew.css';

const AddTransaction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'income',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [recentCategories, setRecentCategories] = useState([
    'Salary', 'Housing', 'Food', 'Transport', 'Investment', 'Bonus', 'Freelance', 'Interest',
    'Dividends', 'Gifts', 'Business Income', 'Rental Income', 'Housing', 'Utilities', 'Healthcare', 'Education',
    'Entertainment', 'Travel', 'Clothing', 'Personal Care', 'Insurance', 'Subscriptions', 'Miscellaneous'
  ]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.amount <= 0) return toast.error('Amount must be greater than zero');
    try {
      setLoading(true);
      await axios.post('/expenses', form);
      toast.success('Transaction added successfully!');

      // Add new category if it's not already in the list
      if (form.category && !recentCategories.includes(form.category)) {
        setRecentCategories([form.category, ...recentCategories]);
      }

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2>Add Transaction</h2>
      <div className="add-transaction-grid">
        <form className="transaction-form" onSubmit={handleSubmit}>
          <div className="type-toggle">
            <button
              type="button"
              className={form.type === 'income' ? 'active' : ''}
              onClick={() => setForm({ ...form, type: 'income' })}
            >
              Income
            </button>
            <button
              type="button"
              className={form.type === 'expense' ? 'active' : ''}
              onClick={() => setForm({ ...form, type: 'expense' })}
            >
              Expense
            </button>
          </div>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount || ''}
            onChange={(e) => setForm({ ...form, amount: +e.target.value })}
            min="1"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setForm({ ...form, amount: '', category: '', description: '' })}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>

        <div className="recent-categories">
          <h4>Categories</h4>
          <div className="category-tags">
            {recentCategories.map((cat, i) => (
              <span
                key={i}
                className="tag"
                onClick={() => setForm({ ...form, category: cat })}
                style={{ cursor: 'pointer' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
