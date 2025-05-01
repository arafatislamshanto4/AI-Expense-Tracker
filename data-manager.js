// data-manager.js
class DataManager {
    constructor() {
        this.loadAllData();
        this.initializeDefaultData();
    }

    loadAllData() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || [];
        this.savingsGoals = JSON.parse(localStorage.getItem('savingsGoals')) || [];
        this.alerts = JSON.parse(localStorage.getItem('alerts')) || [];
        this.userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    }

    initializeDefaultData() {
        if (this.categories.length === 0) {
            this.categories = [
                { id: 1, name: "Food & Dining", icon: "fa-utensils", budget: 500, spent: 350 },
                { id: 2, name: "Transportation", icon: "fa-car", budget: 200, spent: 120 },
                { id: 3, name: "Housing", icon: "fa-home", budget: 900, spent: 900 },
                { id: 4, name: "Shopping", icon: "fa-shopping-bag", budget: 300, spent: 200 }
            ];
        }

        if (this.savingsGoals.length === 0) {
            this.savingsGoals = [
                { id: 1, name: "Emergency Fund", target: 2000, current: 900, targetDate: "2025-12-31" },
                { id: 2, name: "Vacation Fund", target: 2000, current: 1500, targetDate: "2025-06-30" }
            ];
        }

        if (this.alerts.length === 0) {
            this.alerts = [
                { 
                    id: 1,
                    type: "budget", 
                    message: "You've spent 90% of your monthly budget", 
                    category: "Food & Dining",
                    date: new Date().toISOString(),
                    recurring: false,
                    read: false
                }
            ];
        }
        this.saveAllData();
    }

    saveAllData() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('savingsGoals', JSON.stringify(this.savingsGoals));
        localStorage.setItem('alerts', JSON.stringify(this.alerts));
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    // Expense methods
    addExpense(expense) {
        const newExpense = {
            id: Date.now(),
            amount: parseFloat(expense.amount),
            category: expense.category,
            date: expense.date || new Date().toISOString().split('T')[0],
            notes: expense.notes || '',
            recurring: expense.recurring || false
        };
        this.expenses.push(newExpense);
        this.updateCategorySpending(newExpense.category, newExpense.amount);
        this.checkBudgetAlerts(newExpense.category);
        this.saveAllData();
        return newExpense;
    }

    updateCategorySpending(categoryName, amount) {
        const category = this.categories.find(c => c.name === categoryName);
        if (category) {
            category.spent = (category.spent || 0) + amount;
        }
    }

    checkBudgetAlerts(categoryName) {
        const category = this.categories.find(c => c.name === categoryName);
        if (category && category.spent > category.budget * 0.9) {
            this.addAlert({
                type: "budget",
                message: `You've spent ${Math.round((category.spent / category.budget) * 100)}% of your ${category.name} budget`,
                category: category.name
            });
        }
    }

    // Category methods
    addCategory(category) {
        const newCategory = {
            id: Date.now(),
            name: category.name,
            icon: category.icon || 'fa-tag',
            budget: parseFloat(category.budget) || 0,
            spent: 0
        };
        this.categories.push(newCategory);
        this.saveAllData();
        return newCategory;
    }

    // Savings Goals methods
    addSavingsGoal(goal) {
        const newGoal = {
            id: Date.now(),
            name: goal.name,
            target: parseFloat(goal.target),
            current: parseFloat(goal.current) || 0,
            targetDate: goal.targetDate
        };
        this.savingsGoals.push(newGoal);
        this.saveAllData();
        return newGoal;
    }

    // Alert methods
    addAlert(alert) {
        const newAlert = {
            id: Date.now(),
            type: alert.type,
            message: alert.message,
            date: alert.date || new Date().toISOString(),
            recurring: alert.recurring || false,
            read: false
        };
        if (alert.category) newAlert.category = alert.category;
        this.alerts.push(newAlert);
        this.saveAllData();
        return newAlert;
    }

    deleteAlert(id) {
        this.alerts = this.alerts.filter(alert => alert.id !== id);
        this.saveAllData();
    }

    // Report generation
    generateReport(type, startDate, endDate) {
        const filteredExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return expenseDate >= start && expenseDate <= end;
        });

        const categoryBreakdown = {};
        filteredExpenses.forEach(expense => {
            if (!categoryBreakdown[expense.category]) {
                categoryBreakdown[expense.category] = 0;
            }
            categoryBreakdown[expense.category] += expense.amount;
        });

        return {
            type,
            period: `${startDate} to ${endDate}`,
            totalExpenses: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
            categoryBreakdown,
            expenses: filteredExpenses
        };
    }

    // AI Insights
    generateInsights() {
        const totalSpent = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const avgDailySpend = totalSpent / 30; // Simple average
        
        const spendingPatterns = this.categories.map(cat => {
            const percentage = Math.round((cat.spent / cat.budget) * 100);
            return {
                category: cat.name,
                percentage,
                status: percentage > 100 ? 'over' : percentage > 80 ? 'near' : 'under'
            };
        });

        return {
            spendingPatterns,
            savingsOpportunities: this.findSavingsOpportunities(),
            upcomingExpenses: this.predictUpcomingExpenses(),
            budgetForecast: this.calculateBudgetForecast(),
            avgDailySpend
        };
    }

    findSavingsOpportunities() {
        // This would be more sophisticated in a real app
        return [
            { name: "Dining out", amount: 120, current: 350, category: "Food & Dining" },
            { name: "Subscriptions", amount: 60, current: 100 },
            { name: "Transportation", amount: 40, current: 120, category: "Transportation" }
        ];
    }

    predictUpcomingExpenses() {
        const recurring = this.expenses.filter(e => e.recurring);
        return recurring.map(e => ({
            name: e.notes || e.category,
            amount: e.amount,
            date: this.getNextOccurrence(e.date)
        }));
    }

    getNextOccurrence(dateString) {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }

    calculateBudgetForecast() {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const daysRemaining = daysInMonth - today.getDate();
        
        const totalBudget = this.categories.reduce((sum, cat) => sum + cat.budget, 0);
        const totalSpent = this.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
        const remaining = totalBudget - totalSpent;
        
        const avgDaily = totalSpent / today.getDate();
        const projectedRemaining = remaining - (avgDaily * daysRemaining);
        
        return {
            remaining,
            daysRemaining,
            projectedRemaining,
            status: projectedRemaining < 0 ? 'over' : projectedRemaining < (totalBudget * 0.1) ? 'warning' : 'safe'
        };
    }
}

const dataManager = new DataManager();