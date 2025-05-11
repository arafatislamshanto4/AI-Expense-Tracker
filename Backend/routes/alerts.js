const express = require('express');
const router = express.Router();
const { users, alerts } = require('../mockDB');

// Check for budget alerts
router.get('/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const newAlerts = user.budgets
    .filter(b => (b.current / b.limit) >= 0.8)
    .map(b => ({
      type: 'budget',
      message: `You've used ${Math.round((b.current / b.limit) * 100)}% of your ${b.category} budget`,
      category: b.category
    }));

  // Add to alerts collection
  newAlerts.forEach(alert => {
    alerts.push({
      userId: user.id,
      ...alert,
      read: false,
      createdAt: new Date()
    });
  });

  res.json(alerts.filter(a => a.userId === user.id));
});

module.exports = router;