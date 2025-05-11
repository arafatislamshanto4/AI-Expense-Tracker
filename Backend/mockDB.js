// In-memory database with all required collections
let users = [
    {
      id: "1",
      email: "test@example.com",
      password: "123456",
      expenses: ["1", "2"],
      budgets: [
        { category: "food", limit: 500, current: 350 },
        { category: "transport", limit: 200, current: 120 }
      ]
    }
  ];
  
  let expenses = [
    {
      id: "1",
      userId: "1",
      amount: 50,
      category: "food",
      date: "2025-05-01T12:00:00Z",
      notes: "Lunch"
    },
    {
      id: "2",
      userId: "1",
      amount: 30,
      category: "transport",
      date: "2025-05-01T08:30:00Z",
      notes: "Bus fare"
    }
  ];
  
  let alerts = [
    {
      userId: "1",
      type: "budget",
      message: "You've reached 80% of your food budget",
      read: false,
      createdAt: new Date()
    }
  ];
  
  module.exports = { users, expenses, alerts };