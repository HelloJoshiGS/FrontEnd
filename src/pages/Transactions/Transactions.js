// src/pages/Transactions.js
import React, { useEffect, useState, useCallback  } from 'react';
import axios from '../../services/api';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Transactions.css';
import debounce from 'lodash.debounce';


const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    amount: '',
    // maxAmount: '',
    sortBy: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / entriesPerPage); 

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };


  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.category) params.category = filters.category;
      if (filters.amount) params.amount = filters.amount;
      console.log("Inside fetchTransactions");
      console.log(params);
      // if (filters.maxAmount) params.maxAmount = filters.maxAmount;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await axios.get('/expenses', { params });
      const raw = Array.isArray(res.data) ? res.data : res.data.expenses || [];
      console.log("Raw transactions:", raw);
      setAllTransactions(raw);
      setTransactions(raw);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    }
  };

  const debouncedFetch = useCallback(debounce(fetchTransactions, 500), [filters]);

  const ResetAll = () => {
    console.log("Resetting filters");
    // fetchTransactions();
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
      amount: '',
      // maxAmount: '',
      sortBy: ''
    });
    
  };

  useEffect(() => {
    debouncedFetch();
  
    // Clean up debounce on unmount
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);
  
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`/expenses/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleEdit = (tx) => {
    setEditId(tx._id);
    setEditForm({ ...tx });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`/expenses/${id}`, editForm);
      toast.success('Transaction updated');
      setEditId(null);
      fetchTransactions();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleCancel = () => {
    setEditId(null);
  };

  return (
    <div className="transactions-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2>Transactions</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <input type="text" placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input type="number" placeholder="Amount" min ='1' value={filters.amount} onChange={(e) => setFilters({ ...filters, amount: e.target.value })} />
        {/* <input type="number" placeholder="Max Amount" value={filters.maxAmount} onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })} /> */}
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="">Sort By</option>
          <option value="amount">Amount</option>
          <option value="date">Date</option>
        </select>
        <button onClick={fetchTransactions}>Apply Filters</button>
        <button onClick={ResetAll}>Reset</button>
        <CSVLink data={transactions} filename="transactions.csv" className="export-btn">
          Export CSV
        </CSVLink>
      </div>

      {/* Table */}
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{editId === tx._id ? <select name="type" value={editForm.type} onChange={handleEditChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select> : <span className={`badge ${tx.type}`}>{tx.type}</span>}</td>
              <td>{editId === tx._id ? <input name="amount" type="number" value={editForm.amount || ''} onChange={handleEditChange} /> : (typeof tx.amount === 'number' ? tx.amount.toLocaleString('en-NP', { style: 'currency', currency: 'NPR' }) : '—')}</td>
              <td>{editId === tx._id ? <input name="category" type="text" value={editForm.category} onChange={handleEditChange} /> : tx.category}</td>
              <td>{editId === tx._id ? <input name="date" type="date" value={editForm.date.split('T')[0]} onChange={handleEditChange} /> : new Date(tx.date).toLocaleDateString()}</td>
              <td>{editId === tx._id ? <input name="description" type="text" value={editForm.description} onChange={handleEditChange} /> : tx.description}</td>
              <td className="actions">
                {editId === tx._id ? (
                  <>
                    <button onClick={() => handleSave(tx._id)}>✅</button>
                    <button onClick={handleCancel}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(tx)}>✏️</button>
                    <button onClick={() => handleDelete(tx._id)}>❌</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          {/* Pagination does not work at the moment */}

      
      <div className="pagination">
        <span>Showing {transactions.length} of {allTransactions.length} entries</span>
        <div className="page-controls">
          <button>{'<'}</button>
          <button>{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
