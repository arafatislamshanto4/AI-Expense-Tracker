const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/alerts', require('./routes/alerts'));

// Health check
app.get('/', (req, res) => {
  res.send('AI Expense Tracker Backend');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`☑ Backend running at http://localhost:${PORT}`);
});