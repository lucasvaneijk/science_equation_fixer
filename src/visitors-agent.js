// Visitor Tracking Agent with Logic Tree
class VisitorTrackingAgent {
    constructor() {
        this.storageKey = 'scienceEquationVisitors';
        this.sessionKey = 'scienceEquationSessionVisitors';
        this.decisionTree = this.buildDecisionTree();
        this.initialize();
    }

    // Build the decision tree logic
    buildDecisionTree() {
        return {
            checkStorageExists: () => {
                return localStorage.getItem(this.storageKey) !== null;
            },
            handleStorageCheck: (exists) => {
                if (exists) {
                    return 'loadExistingData';
                } else {
                    return 'initializeNewData';
                }
            },
            initializeNewData: () => {
                localStorage.setItem(this.storageKey, JSON.stringify({
                    totalVisits: 0,
                    visitHistory: [],
                    dailyVisits: {}
                }));
                return 'dataInitialized';
            },
            loadExistingData: () => {
                const data = JSON.parse(localStorage.getItem(this.storageKey));
                return data;
            },
            checkSessionExists: () => {
                return sessionStorage.getItem(this.sessionKey) !== null;
            },
            handleSessionCheck: (exists) => {
                if (exists) {
                    return 'loadSessionData';
                } else {
                    return 'initializeSession';
                }
            },
            initializeSession: () => {
                sessionStorage.setItem(this.sessionKey, '0');
                return 'sessionInitialized';
            },
            trackNewVisit: (data) => {
                data.totalVisits++;
                const today = this.getDateString();
                
                if (!data.dailyVisits[today]) {
                    data.dailyVisits[today] = 0;
                }
                data.dailyVisits[today]++;
                
                const now = new Date();
                data.visitHistory.push({
                    timestamp: now.toISOString(),
                    date: today,
                    time: now.toLocaleTimeString()
                });
                
                // Keep only last 50 visits
                if (data.visitHistory.length > 50) {
                    data.visitHistory = data.visitHistory.slice(-50);
                }
                
                return data;
            },
            updateSessionCount: () => {
                let sessionVisits = parseInt(sessionStorage.getItem(this.sessionKey)) || 0;
                sessionVisits++;
                sessionStorage.setItem(this.sessionKey, sessionVisits.toString());
                return sessionVisits;
            },
            persistData: (data) => {
                localStorage.setItem(this.storageKey, JSON.stringify(data));
                return 'dataPersisted';
            },
            validateData: (data) => {
                return data && data.totalVisits >= 0 && data.visitHistory && data.dailyVisits;
            }
        };
    }

    // Execute the logic tree
    executeLogicTree() {
        const tree = this.decisionTree;
        
        // Check storage
        const storageExists = tree.checkStorageExists();
        const storageAction = tree.handleStorageCheck(storageExists);
        
        let data;
        if (storageAction === 'initializeNewData') {
            tree.initializeNewData();
        }
        
        data = tree.loadExistingData();
        
        // Check session
        const sessionExists = tree.checkSessionExists();
        const sessionAction = tree.handleSessionCheck(sessionExists);
        
        if (sessionAction === 'initializeSession') {
            tree.initializeSession();
        }
        
        // Track visit
        data = tree.trackNewVisit(data);
        
        // Update session
        tree.updateSessionCount();
        
        // Persist data
        tree.persistData(data);
        
        // Validate
        return tree.validateData(data);
    }

    initialize() {
        this.executeLogicTree();
    }

    getDateString() {
        const today = new Date();
        return today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Get stats with logic tree decision making
    getStats() {
        const tree = this.decisionTree;
        const data = tree.loadExistingData();
        const today = this.getDateString();
        const sessionVisits = parseInt(sessionStorage.getItem(this.sessionKey)) || 0;
        
        return {
            totalVisits: data.totalVisits,
            todayVisits: data.dailyVisits[today] || 0,
            sessionVisits: sessionVisits,
            uniqueDays: Object.keys(data.dailyVisits).length,
            recentHistory: data.visitHistory.slice(-10),
            allHistory: data.visitHistory
        };
    }

    // Display stats
    displayStats() {
        const stats = this.getStats();
        
        if (document.getElementById('totalVisitors')) {
            document.getElementById('totalVisitors').textContent = stats.totalVisits.toLocaleString();
        }
        if (document.getElementById('todayVisitors')) {
            document.getElementById('todayVisitors').textContent = stats.todayVisits.toLocaleString();
        }
        if (document.getElementById('sessionVisitors')) {
            document.getElementById('sessionVisitors').textContent = stats.sessionVisits.toLocaleString();
        }
        if (document.getElementById('uniqueDays')) {
            document.getElementById('uniqueDays').textContent = stats.uniqueDays.toLocaleString();
        }
        if (document.getElementById('todayDate')) {
            document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        this.displayHistory(stats.recentHistory);
    }

    displayHistory(history) {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-item">No visits recorded yet</div>';
            return;
        }
        
        const reversedHistory = [...history].reverse();
        
        reversedHistory.forEach((visit) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const visitDate = new Date(visit.timestamp);
            const displayTime = visitDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            historyItem.textContent = `${visit.date} at ${displayTime}`;
            historyList.appendChild(historyItem);
        });
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all visitor data? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            sessionStorage.removeItem(this.sessionKey);
            this.initialize();
            this.displayStats();
            alert('All visitor data has been cleared!');
        }
    }

    // Logic tree for decision making on data age
    shouldRefreshData() {
        const lastCheck = sessionStorage.getItem('lastDataCheck');
        const now = Date.now();
        
        if (!lastCheck) {
            sessionStorage.setItem('lastDataCheck', now.toString());
            return true;
        }
        
        const timeDiff = now - parseInt(lastCheck);
        const shouldRefresh = timeDiff > 5000; // Refresh every 5 seconds
        
        if (shouldRefresh) {
            sessionStorage.setItem('lastDataCheck', now.toString());
        }
        
        return shouldRefresh;
    }
}

// Initialize the agent
let visitorAgent;
window.addEventListener('load', () => {
    visitorAgent = new VisitorTrackingAgent();
    visitorAgent.displayStats();
    
    // Auto-refresh with logic tree decision
    setInterval(() => {
        if (visitorAgent && visitorAgent.shouldRefreshData()) {
            visitorAgent.displayStats();
        }
    }, 1000);
});

// Global function to clear data
function clearAllData() {
    if (visitorAgent) {
        visitorAgent.clearAllData();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorTrackingAgent;
}
