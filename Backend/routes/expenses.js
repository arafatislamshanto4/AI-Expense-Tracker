const express = require('express');
const router = express.Router();
const { users, expenses } = require('../mockDB');

// Add expense
router.post('/', (req, res) => {
  const { userId, amount, category, notes } = req.body;
  
  // Validate
  if (!userId || !amount || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newExpense = {
    id: Date.now().toString(),
    userId,
    amount: parseFloat(amount),
    category,
    date: new Date().toISOString(),
    notes: notes || ""
  };

  // Save expense
  expenses.push(newExpense);
  
  // Update user's expense list
  const user = users.find(u => u.id === userId);
  if (user) user.expenses.push(newExpense.id);
  
  res.status(201).json(newExpense);
});

// Get expenses
router.get('/:userId', (req, res) => {
  res.json(
    expenses.filter(e => e.userId === req.params.userId)
  );
});

module.exports = router;