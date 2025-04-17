document.addEventListener('DOMContentLoaded', function() {
    // Handle feature cards click
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                window.open(page, '_blank');
            }
        });
    });

    // Handle dashboard cards click
    const dashboardCards = document.querySelectorAll('.card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                window.open(page, '_blank');
            }
        });
    });

    // Handle report cards click (excluding download buttons)
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const page = this.getAttribute('data-page');
                if (page) {
                    window.open(page, '_blank');
                }
            }
        });
    });
});