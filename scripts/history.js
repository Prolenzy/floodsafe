// History functionality
function loadHistory() {
    const historyList = document.getElementById('history-list');
    const timeFilter = document.getElementById('time-filter');
    const riskFilter = document.getElementById('risk-filter');

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Please log in to view history</h3>
                <p>Your analysis history will be saved after logging in</p>
            </div>
        `;
        return;
    }
    
    // Get history from localStorage
    const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    
    // Apply filters
    const timeFilterValue = timeFilter.value;
    const riskFilterValue = riskFilter.value;
    
    const now = new Date();
    let filteredHistory = history;
    
    // Time filter
    if (timeFilterValue !== 'all') {
        filteredHistory = filteredHistory.filter(item => {
            const itemDate = new Date(item.timestamp);
            const diffTime = Math.abs(now - itemDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (timeFilterValue === 'week') return diffDays <= 7;
            if (timeFilterValue === 'month') return diffDays <= 30;
            return true;
        });
    }
    
    // Risk filter
    if (riskFilterValue !== 'all') {
        filteredHistory = filteredHistory.filter(item => 
            item.riskLevel.toLowerCase().replace(' ', '-') === riskFilterValue
        );
    }
    
    // Display history
    if (filteredHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No analysis history found</h3>
                <p>Perform your first analysis to see results here</p>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp (newest first)
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Generate HTML for history items
    historyList.innerHTML = filteredHistory.map(item => {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <h3>${formattedDate} at ${formattedTime}</h3>
                    <p>Region: ${item.region}, Season: ${item.season}</p>
                    <p>Risk: ${item.riskLevel} (${item.riskProbability})</p>
                </div>
                <div class="history-risk risk-${item.riskLevel.toLowerCase().replace(' ', '-')}">
                    ${item.riskLevel}
                </div>
            </div>
        `;
    }).join('');
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const timeFilter = document.getElementById('time-filter');
    const riskFilter = document.getElementById('risk-filter');
    
    if (timeFilter) {
        timeFilter.addEventListener('change', loadHistory);
    }
    
    if (riskFilter) {
        riskFilter.addEventListener('change', loadHistory);
    }
    
    // Load history if we're on the history page
    if (window.location.hash === '#history' || document.getElementById('history').classList.contains('active')) {
        loadHistory();
    }
});