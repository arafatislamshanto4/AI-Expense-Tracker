const express = require('express');
const router = express.Router();
const { expenses } = require('../mockDB');

// Generate monthly report
router.post('/monthly', (req, res) => {
  const { userId, month, year } = req.body;
  
  const monthlyExpenses = expenses.filter(exp => 
    exp.userId === userId && 
    new Date(exp.date).getMonth() === month - 1 &&
    new Date(exp.date).getFullYear() === year
  );

  const byCategory = monthlyExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  res.json({
    total: monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    byCategory
  });
});

// Generate yearly report
router.post('/yearly', (req, res) => {
  const { userId, year } = req.body;
  
  const yearlyExpenses = expenses.filter(exp => 
    exp.userId === userId && 
    new Date(exp.date).getFullYear() === year
  );

  const monthlyBreakdown = Array(12).fill().map((_, month) => {
    const monthExpenses = yearlyExpenses.filter(
      exp => new Date(exp.date).getMonth() === month
    );
    return {
      month: month + 1,
      total: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  });

  res.json({
    total: yearlyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    monthlyBreakdown
  });
});

module.exports = router;