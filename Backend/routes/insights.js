const express = require('express');
const router = express.Router();
const { expenses } = require('../mockDB');

router.get('/:userId', (req, res) => {
  const userExpenses = expenses.filter(e => e.userId === req.params.userId);
  
  // Spending by category
  const categorySpending = userExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  // Top spending category
  const topCategory = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])[0];

  res.json({
    totalSpent: Object.values(categorySpending).reduce((a, b) => a + b, 0),
    topCategory: {
      name: topCategory[0],
      amount: topCategory[1],
      percentage: Math.round((topCategory[1] / Object.values(categorySpending).reduce((a, b) => a + b, 0)) * 100)
    },
    suggestions: [
      `Try reducing ${topCategory[0]} spending next month`,
      "Consider setting budget limits for top categories"
    ]
  });
});

module.exports = router;