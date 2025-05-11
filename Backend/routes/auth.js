const express = require('express');
const router = express.Router();
const { users } = require('../mockDB');

// Register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check if user exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Create user
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    expenses: [],
    budgets: []
  };
  
  users.push(newUser);
  res.status(201).json({ 
    token: `mock-token-${Date.now()}`, 
    userId: newUser.id 
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    token: `mock-token-${Date.now()}`, 
    userId: user.id 
  });
});

module.exports = router;