// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all event listeners
    initNavigation();
    initExpenseTracking();
    initCategoryManagement();
    initSavingsGoals();
    initAlerts();
    initReports();
    initDashboard();
    initAIInsights();
    initUserProfile();
});

function initNavigation() {
    // Feature cards navigation
    document.querySelectorAll('.feature').forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) window.location.href = page;
        });
    });

    // Dashboard cards navigation
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) window.location.href = page;
        });
    });
}

function initExpenseTracking() {
    const form = document.querySelector('.expense-form form');
    if (form) {
        // Load categories into select
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            dataManager.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const expense = {
                amount: document.getElementById('amount').value,
                category: document.getElementById('category').value,
                date: document.getElementById('date').value,
                notes: document.getElementById('notes').value,
                recurring: document.getElementById('recurring')?.checked || false
            };

            dataManager.addExpense(expense);
            alert('Expense added successfully!');
            form.reset();
            
            // Refresh recent expenses if on dashboard
            if (typeof loadRecentExpenses === 'function') {
                loadRecentExpenses();
            }
        });
    }

    // Load recent expenses
    if (typeof loadRecentExpenses === 'undefined') {
        window.loadRecentExpenses = function() {
            const container = document.querySelector('.recent-expenses .expense-list');
            if (container) {
                container.innerHTML = '';
                const recent = dataManager.expenses.slice(-5).reverse();
                
                recent.forEach(expense => {
                    const item = document.createElement('div');
                    item.className = 'expense-item';
                    item.innerHTML = `
                        <div class="expense-info">
                            <span class="amount">$${expense.amount.toFixed(2)}</span>
                            <span class="category">${expense.category}</span>
                            <span class="date">${new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        <div class="expense-actions">
                            <button class="btn-icon edit-expense" data-id="${expense.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-expense" data-id="${expense.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(item);
                });

                // Add event listeners for edit/delete
                document.querySelectorAll('.delete-expense').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        dataManager.expenses = dataManager.expenses.filter(e => e.id !== id);
                        dataManager.saveAllData();
                        loadRecentExpenses();
                    });
                });
            }
        };
    }
}

function initCategoryManagement() {
    const form = document.querySelector('.categories-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const category = {
                name: document.getElementById('category-name').value,
                budget: document.getElementById('category-budget').value || 0
            };

            dataManager.addCategory(category);
            alert('Category added successfully!');
            form.reset();
            loadCategories();
        });
    }

    // Load categories
    if (typeof loadCategories === 'undefined') {
        window.loadCategories = function() {
            const container = document.querySelector('.category-grid');
            if (container) {
                container.innerHTML = '';
                dataManager.categories.forEach(cat => {
                    const percentage = Math.round((cat.spent / cat.budget) * 100) || 0;
                    const item = document.createElement('div');
                    item.className = 'category-item';
                    item.innerHTML = `
                        <div class="category-icon">
                            <i class="fas ${cat.icon}"></i>
                        </div>
                        <h4>${cat.name}</h4>
                        <p>$${cat.spent.toFixed(2)}/$${cat.budget.toFixed(2)}</p>
                        <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                    `;
                    container.appendChild(item);
                });
            }
        };
    }
}

function initSavingsGoals() {
    const form = document.querySelector('.savings-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const goal = {
                name: document.getElementById('goal-name').value,
                target: document.getElementById('target-amount').value,
                current: document.getElementById('current-amount').value || 0,
                targetDate: document.getElementById('target-date').value
            };

            dataManager.addSavingsGoal(goal);
            alert('Savings goal added successfully!');
            form.reset();
            loadSavingsGoals();
        });
    }

    // Load savings goals
    if (typeof loadSavingsGoals === 'undefined') {
        window.loadSavingsGoals = function() {
            const container = document.querySelector('.goals-list');
            if (container) {
                container.innerHTML = '';
                dataManager.savingsGoals.forEach(goal => {
                    const percentage = Math.round((goal.current / goal.target) * 100) || 0;
                    const item = document.createElement('div');
                    item.className = 'goal-item';
                    item.innerHTML = `
                        <div class="goal-progress">
                            <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="goal-info">
                            <h4>${goal.name}</h4>
                            <p>$${goal.current.toFixed(2)} saved of $${goal.target.toFixed(2)}</p>
                            <p>Target: ${new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>
                        <div class="goal-actions">
                            <button class="btn-icon edit-goal" data-id="${goal.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete-goal" data-id="${goal.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(item);
                });

                // Add event listeners for edit/delete
                document.querySelectorAll('.delete-goal').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        dataManager.savingsGoals = dataManager.savingsGoals.filter(g => g.id !== id);
                        dataManager.saveAllData();
                        loadSavingsGoals();
                    });
                });
            }
        };
    }
}

function initAlerts() {
    const form = document.querySelector('.alerts-form form');
    if (form) {
        // Load categories for budget alerts
        const typeSelect = document.getElementById('alert-type');
        if (typeSelect) {
            typeSelect.addEventListener('change', function() {
                const categoryGroup = document.getElementById('category-group');
                if (this.value === 'budget' && !categoryGroup) {
                    const group = document.createElement('div');
                    group.className = 'form-group';
                    group.id = 'category-group';
                    group.innerHTML = `
                        <label for="alert-category">Category</label>
                        <select id="alert-category" required>
                            ${dataManager.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                        </select>
                    `;
                    form.insertBefore(group, form.querySelector('.form-group:nth-child(3)'));
                } else if (this.value !== 'budget' && categoryGroup) {
                    categoryGroup.remove();
                }
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const alert = {
                type: document.getElementById('alert-type').value,
                message: document.getElementById('alert-message').value,
                date: document.getElementById('alert-date').value || new Date().toISOString(),
                recurring: document.getElementById('recurring').checked
            };

            if (alert.type === 'budget') {
                alert.category = document.getElementById('alert-category').value;
            }

            dataManager.addAlert(alert);
            alert('Alert created successfully!');
            form.reset();
            loadAlerts();
        });
    }

    // Load alerts
    if (typeof loadAlerts === 'undefined') {
        window.loadAlerts = function() {
            const container = document.querySelector('.alerts-list');
            if (container) {
                container.innerHTML = '<h3>Your Active Alerts</h3>';
                
                if (dataManager.alerts.length === 0) {
                    container.innerHTML += '<p>No active alerts</p>';
                    return;
                }

                dataManager.alerts.forEach(alert => {
                    const item = document.createElement('div');
                    item.className = 'alert-item';
                    item.innerHTML = `
                        <div class="alert-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="alert-content">
                            <h4>${alert.type === 'budget' ? 'Budget: ' + alert.category : alert.type}</h4>
                            <p>${alert.message}</p>
                            <p class="alert-time">${new Date(alert.date).toLocaleString()}</p>
                        </div>
                        <div class="alert-actions">
                            <button class="btn-icon delete-alert" data-id="${alert.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(item);
                });

                // Add delete handlers
                document.querySelectorAll('.delete-alert').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.getAttribute('data-id'));
                        dataManager.deleteAlert(id);
                        loadAlerts();
                    });
                });
            }
        };
    }
}

function initReports() {
    // Report download handling
    document.querySelectorAll('.report-actions .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const reportType = this.textContent.includes('Monthly') ? 'Monthly' : 
                            this.textContent.includes('Yearly') ? 'Yearly' : 'Custom';
            
            const today = new Date();
            let startDate, endDate;
            
            if (reportType === 'Monthly') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            } else if (reportType === 'Yearly') {
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
            } else {
                // For custom reports, you would get dates from form inputs
                startDate = new Date(document.getElementById('start-date').value);
                endDate = new Date(document.getElementById('end-date').value);
            }

            const report = dataManager.generateReport(
                reportType + ' Expense Report',
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            // Format for download
            let content = `${report.type}\n`;
            content += `Period: ${report.period}\n\n`;
            content += `Total Expenses: $${report.totalExpenses.toFixed(2)}\n\n`;
            content += "Category Breakdown:\n";
            
            for (const [category, amount] of Object.entries(report.categoryBreakdown)) {
                content += `- ${category}: $${amount.toFixed(2)}\n`;
            }

            content += "\nRecent Expenses:\n";
            report.expenses.slice(0, 5).forEach(expense => {
                content += `- ${expense.date}: $${expense.amount.toFixed(2)} (${expense.category})\n`;
            });

            // Create download
            const blob = new Blob([content], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expense-report-${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });
    });
}

function initDashboard() {
    // Update dashboard summary
    if (typeof updateDashboardSummary === 'undefined') {
        window.updateDashboardSummary = function() {
            const totalExpenses = dataManager.expenses.reduce((sum, e) => sum + e.amount, 0);
            const totalSavings = dataManager.savingsGoals.reduce((sum, g) => sum + g.current, 0);
            const totalBudget = dataManager.categories.reduce((sum, c) => sum + c.budget, 0);
            const remainingBudget = totalBudget - dataManager.categories.reduce((sum, c) => sum + (c.spent || 0), 0);

            document.querySelectorAll('.dashboard-content .card').forEach(card => {
                const title = card.querySelector('h3').textContent;
                if (title.includes('Total Expenses')) {
                    card.querySelector('p').textContent = `$${totalExpenses.toFixed(2)}`;
                } else if (title.includes('Total Savings')) {
                    card.querySelector('p').textContent = `$${totalSavings.toFixed(2)}`;
                } else if (title.includes('Remaining Budget')) {
                    card.querySelector('p').textContent = `$${remainingBudget.toFixed(2)}`;
                }
            });

            // Load recent expenses
            if (typeof loadRecentExpenses === 'function') {
                loadRecentExpenses();
            }
        };
    }
}

function initAIInsights() {
    // Update AI Insights
    if (typeof updateAIInsights === 'undefined') {
        window.updateAIInsights = function() {
            const insights = dataManager.generateInsights();

            // Spending Patterns
            const spendingCard = document.querySelector('.insight-card:nth-child(1) .insight-content p');
            if (spendingCard) {
                const overBudget = insights.spendingPatterns.find(p => p.status === 'over');
                if (overBudget) {
                    spendingCard.textContent = `Your spending on ${overBudget.category} is ${overBudget.percentage}% over budget.`;
                } else {
                    spendingCard.textContent = "Your spending is within budget limits across all categories.";
                }
            }

            // Savings Opportunities
            const savingsList = document.querySelector('.savings-list');
            if (savingsList) {
                savingsList.innerHTML = insights.savingsOpportunities.map(item => 
                    `<li>${item.name}: Save $${item.amount}/month (currently $${item.current}/month)</li>`
                ).join('');
            }

            // Upcoming Expenses
            const upcomingExpenses = document.querySelector('.upcoming-expenses');
            if (upcomingExpenses) {
                if (insights.upcomingExpenses.length > 0) {
                    upcomingExpenses.innerHTML = insights.upcomingExpenses.map(expense => 
                        `<div class="expense-item">
                            <span class="expense-name">${expense.name}</span>
                            <span class="expense-amount">~$${expense.amount.toFixed(2)}</span>
                            <span class="expense-date">Around ${new Date(expense.date).toLocaleDateString()}</span>
                        </div>`
                    ).join('');
                } else {
                    upcomingExpenses.innerHTML = '<p>No upcoming recurring expenses detected</p>';
                }
            }

            // Budget Forecast
            const forecastCard = document.querySelector('.insight-card:nth-child(4) .insight-content p');
            if (forecastCard) {
                forecastCard.textContent = `At current spending, you'll have $${insights.budgetForecast.remaining.toFixed(2)} remaining this month.`;
            }

            // AI Suggestion
            const suggestion = document.querySelector('.ai-suggestions .suggestion p');
            if (suggestion) {
                const overBudget = insights.spendingPatterns.find(p => p.status === 'over');
                if (overBudget) {
                    suggestion.textContent = `"Consider reducing your ${overBudget.category} spending which is ${overBudget.percentage}% over budget."`;
                } else {
                    suggestion.textContent = '"Your spending habits are looking good! Keep it up."';
                }
            }
        };
    }
}

function initUserProfile() {
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        // Load profile data
        if (dataManager.userProfile.name) {
            document.getElementById('profile-name').value = dataManager.userProfile.name;
            document.getElementById('profile-email').value = dataManager.userProfile.email;
            // Load other fields as needed
        }

        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            dataManager.userProfile = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                // Add other profile fields
            };
            dataManager.saveAllData();
            alert('Profile updated successfully!');
        });
    }
}