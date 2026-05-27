/* ==========================================================================
   API INTEGRATION HUB - CENTRAL APPLICATION CONTROLLER (app.js)
   ========================================================================= */

// Global Application State Namespace
window.APIHub = {
    // Current Active Tab
    activeTab: 'github',
    
    // Toast Notification System
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Custom SVG icons based on toast type
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (type === 'warning') {
            iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }
        
        toast.innerHTML = `
            ${iconSvg}
            <span class="toast-msg">${message}</span>
            <button class="toast-close" aria-label="Close Toast">&times;</button>
        `;
        
        // Add to DOM
        container.appendChild(toast);
        
        // Dismiss after 4 seconds
        const autoDismiss = setTimeout(() => {
            dismissToast(toast);
        }, 4000);
        
        // Click to dismiss
        toast.addEventListener('click', (e) => {
            if (e.target.closest('.toast-close') || e.target === toast || e.target.parentElement === toast) {
                clearTimeout(autoDismiss);
                dismissToast(toast);
            }
        });
    }
};

// Private utility to remove toast with transition
function dismissToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px) scale(0.9)';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    initNetworkMonitor();
    
    // Initialize module controllers
    if (window.QuotesController) window.QuotesController.init();
    if (window.WeatherController) window.WeatherController.init();
    if (window.GitHubController) window.GitHubController.init();
});

/* --- Tab Routing Navigation --- */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            if (targetTab === window.APIHub.activeTab) return;
            
            // 1. Update Tab Button Highlights
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 2. Hide current panel, show matching target panel
            panels.forEach(panel => {
                const isTarget = panel.id === `${targetTab}-panel`;
                panel.classList.toggle('active', isTarget);
                panel.setAttribute('aria-hidden', !isTarget);
            });
            
            // 3. Update global state
            window.APIHub.activeTab = targetTab;
            
            // 4. Custom module page entry behaviors
            if (targetTab === 'quotes' && window.QuotesController) {
                // Fetch first quote if panel is empty
                const quoteResults = document.getElementById('quotes-results');
                if (quoteResults && quoteResults.children.length <= 1 && !quoteResults.querySelector('.quote-card')) {
                    window.QuotesController.fetchQuote();
                }
            }
        });
    });
}

/* --- Theme Management (Light / Dark) --- */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    
    // Retrieve theme preference, fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', initialTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        window.APIHub.showToast(`Theme switched to ${nextTheme} mode!`, 'info');
    });
}

/* --- Online / Offline Status Monitor --- */
function initNetworkMonitor() {
    const statusContainer = document.getElementById('connection-status');
    if (!statusContainer) return;
    
    const dot = statusContainer.querySelector('.status-dot');
    const label = statusContainer.querySelector('.status-text');
    
    function updateStatus(isOnline) {
        if (isOnline) {
            dot.className = 'status-dot online';
            label.textContent = 'Network Online';
            window.APIHub.showToast('Back online! Ready to fetch data.', 'success');
        } else {
            dot.className = 'status-dot offline';
            label.textContent = 'Network Offline';
            window.APIHub.showToast('You are currently offline. Using cached/local data where possible.', 'warning');
        }
    }
    
    window.addEventListener('online', () => updateStatus(true));
    window.addEventListener('offline', () => updateStatus(false));
    
    // Check initially
    if (!navigator.onLine) {
        dot.className = 'status-dot offline';
        label.textContent = 'Network Offline';
    }
}
