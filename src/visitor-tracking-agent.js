/**
 * VISITOR TRACKING AGENT WITH INTEGRATED LOGIC BRANCHES
 * 
 * This agent manages all visitor tracking functionality with decision-based logic branches:
 * - Storage Management Branch: Handles data initialization and persistence
 * - Session Management Branch: Tracks active session visits
 * - Analytics Branch: Calculates and provides statistics
 * - UI Rendering Branch: Updates the display with current data
 */

class VisitorTrackingAgent {
  constructor() {
    this.storageKey = 'scienceEquationVisitors';
    this.sessionKey = 'scienceEquationSessionVisitors';
    this.lastRefreshKey = 'visitorLastRefresh';
    this.state = {
      initialized: false,
      data: null,
      sessionVisits: 0
    };
    
    // Initialize agent
    this.logicBranches = this.initializeBranches();
    this.executeInitializationBranch();
  }

  /**
   * BRANCH FACTORY: Initialize all logic branches
   */
  initializeBranches() {
    return {
      // BRANCH 1: STORAGE MANAGEMENT
      storageManagement: {
        checkStorageExists: () => {
          return localStorage.getItem(this.storageKey) !== null;
        },
        createNewStorage: () => {
          const initialData = {
            totalVisits: 0,
            visitHistory: [],
            dailyVisits: {},
            firstVisitDate: new Date().toISOString(),
            lastVisitDate: null
          };
          localStorage.setItem(this.storageKey, JSON.stringify(initialData));
          return initialData;
        },
        loadExistingStorage: () => {
          const data = localStorage.getItem(this.storageKey);
          return data ? JSON.parse(data) : null;
        },
        persistStorage: (data) => {
          localStorage.setItem(this.storageKey, JSON.stringify(data));
          return true;
        }
      },

      // BRANCH 2: SESSION MANAGEMENT
      sessionManagement: {
        checkSessionExists: () => {
          return sessionStorage.getItem(this.sessionKey) !== null;
        },
        initializeSession: () => {
          sessionStorage.setItem(this.sessionKey, '0');
          return 0;
        },
        getSessionCount: () => {
          return parseInt(sessionStorage.getItem(this.sessionKey)) || 0;
        },
        incrementSession: () => {
          let count = this.logicBranches.sessionManagement.getSessionCount();
          count++;
          sessionStorage.setItem(this.sessionKey, count.toString());
          return count;
        }
      },

      // BRANCH 3: VISIT TRACKING
      visitTracking: {
        recordNewVisit: (data) => {
          const today = this.getDateString();
          
          // Increment total visits
          data.totalVisits++;
          
          // Track today's visits
          if (!data.dailyVisits[today]) {
            data.dailyVisits[today] = 0;
          }
          data.dailyVisits[today]++;
          
          // Record timestamp
          const now = new Date();
          const visitRecord = {
            timestamp: now.toISOString(),
            date: today,
            time: now.toLocaleTimeString()
          };
          
          data.visitHistory.push(visitRecord);
          data.lastVisitDate = now.toISOString();
          
          // Keep only last 100 visits
          if (data.visitHistory.length > 100) {
            data.visitHistory = data.visitHistory.slice(-100);
          }
          
          return data;
        },
        validateVisitData: (data) => {
          return (
            data &&
            typeof data.totalVisits === 'number' &&
            Array.isArray(data.visitHistory) &&
            typeof data.dailyVisits === 'object'
          );
        }
      },

      // BRANCH 4: ANALYTICS
      analytics: {
        getTotalVisits: (data) => {
          return data.totalVisits;
        },
        getTodayVisits: (data) => {
          const today = this.getDateString();
          return data.dailyVisits[today] || 0;
        },
        getUniqueDays: (data) => {
          return Object.keys(data.dailyVisits).length;
        },
        getAverageVisitsPerDay: (data) => {
          const uniqueDays = Object.keys(data.dailyVisits).length;
          return uniqueDays > 0 ? (data.totalVisits / uniqueDays).toFixed(2) : 0;
        },
        getMostActiveDay: (data) => {
          let maxDay = null;
          let maxVisits = 0;
          
          for (const [day, visits] of Object.entries(data.dailyVisits)) {
            if (visits > maxVisits) {
              maxVisits = visits;
              maxDay = day;
            }
          }
          
          return { date: maxDay, visits: maxVisits };
        },
        getRecentHistory: (data, limit = 10) => {
          return [...data.visitHistory].reverse().slice(0, limit);
        }
      },

      // BRANCH 5: UI RENDERING
      uiRendering: {
        updateTotalVisitors: (total) => {
          const element = document.getElementById('totalVisitors');
          if (element) element.textContent = total.toLocaleString();
        },
        updateTodayVisitors: (today) => {
          const element = document.getElementById('todayVisitors');
          if (element) element.textContent = today.toLocaleString();
        },
        updateSessionVisitors: (session) => {
          const element = document.getElementById('sessionVisitors');
          if (element) element.textContent = session.toLocaleString();
        },
        updateUniqueDays: (days) => {
          const element = document.getElementById('uniqueDays');
          if (element) element.textContent = days.toLocaleString();
        },
        updateTodayDate: () => {
          const element = document.getElementById('todayDate');
          if (element) {
            element.textContent = new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        },
        updateHistoryList: (history) => {
          const historyList = document.getElementById('historyList');
          if (!historyList) return;
          
          historyList.innerHTML = '';
          
          if (history.length === 0) {
            historyList.innerHTML = '<div class="history-item">No visits recorded yet</div>';
            return;
          }
          
          history.forEach((visit) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = `${visit.date} at ${visit.time}`;
            historyList.appendChild(item);
          });
        },
        renderAllStats: (stats) => {
          this.logicBranches.uiRendering.updateTotalVisitors(stats.total);
          this.logicBranches.uiRendering.updateTodayVisitors(stats.today);
          this.logicBranches.uiRendering.updateSessionVisitors(stats.session);
          this.logicBranches.uiRendering.updateUniqueDays(stats.uniqueDays);
          this.logicBranches.uiRendering.updateTodayDate();
          this.logicBranches.uiRendering.updateHistoryList(stats.recentHistory);
        }
      },

      // BRANCH 6: DATA VALIDATION
      dataValidation: {
        validateStorageData: (data) => {
          return this.logicBranches.visitTracking.validateVisitData(data);
        },
        sanitizeData: (data) => {
          if (!data) return null;
          return {
            totalVisits: Math.max(0, data.totalVisits || 0),
            visitHistory: Array.isArray(data.visitHistory) ? data.visitHistory : [],
            dailyVisits: typeof data.dailyVisits === 'object' ? data.dailyVisits : {},
            firstVisitDate: data.firstVisitDate || new Date().toISOString(),
            lastVisitDate: data.lastVisitDate || null
          };
        }
      }
    };
  }

  /**
   * DECISION TREE: INITIALIZATION BRANCH
   * Executes on agent creation to set up storage and session
   */
  executeInitializationBranch() {
    const branches = this.logicBranches;
    
    // Check storage → Branch A or B
    if (branches.storageManagement.checkStorageExists()) {
      // Branch A: Load existing
      this.state.data = branches.storageManagement.loadExistingStorage();
      this.state.data = branches.dataValidation.sanitizeData(this.state.data);
    } else {
      // Branch B: Create new
      this.state.data = branches.storageManagement.createNewStorage();
    }
    
    // Check session → Branch C or D
    if (branches.sessionManagement.checkSessionExists()) {
      // Branch C: Load existing session
      this.state.sessionVisits = branches.sessionManagement.getSessionCount();
    } else {
      // Branch D: Initialize new session
      this.state.sessionVisits = branches.sessionManagement.initializeSession();
    }
    
    // Track this page load as a visit
    this.executeVisitTrackingBranch();
    
    this.state.initialized = true;
  }

  /**
   * DECISION TREE: VISIT TRACKING BRANCH
   * Records a new visit and updates all related data
   */
  executeVisitTrackingBranch() {
    const branches = this.logicBranches;
    
    // Step 1: Record the visit
    this.state.data = branches.visitTracking.recordNewVisit(this.state.data);
    
    // Step 2: Validate data integrity
    if (!branches.dataValidation.validateStorageData(this.state.data)) {
      console.error('Data validation failed');
      return false;
    }
    
    // Step 3: Persist to storage
    branches.storageManagement.persistStorage(this.state.data);
    
    // Step 4: Increment session counter
    this.state.sessionVisits = branches.sessionManagement.incrementSession();
    
    return true;
  }

  /**
   * DECISION TREE: ANALYTICS & DISPLAY BRANCH
   * Retrieves stats and updates the UI
   */
  executeAnalyticsAndDisplayBranch() {
    const branches = this.logicBranches;
    
    // Gather analytics
    const stats = {
      total: branches.analytics.getTotalVisits(this.state.data),
      today: branches.analytics.getTodayVisits(this.state.data),
      session: this.state.sessionVisits,
      uniqueDays: branches.analytics.getUniqueDays(this.state.data),
      averagePerDay: branches.analytics.getAverageVisitsPerDay(this.state.data),
      mostActiveDay: branches.analytics.getMostActiveDay(this.state.data),
      recentHistory: branches.analytics.getRecentHistory(this.state.data)
    };
    
    // Render to UI
    branches.uiRendering.renderAllStats(stats);
    
    return stats;
  }

  /**
   * PUBLIC API: Get all statistics
   */
  getStats() {
    if (!this.state.initialized) return null;
    
    const branches = this.logicBranches;
    return {
      total: branches.analytics.getTotalVisits(this.state.data),
      today: branches.analytics.getTodayVisits(this.state.data),
      session: this.state.sessionVisits,
      uniqueDays: branches.analytics.getUniqueDays(this.state.data),
      averagePerDay: branches.analytics.getAverageVisitsPerDay(this.state.data),
      mostActiveDay: branches.analytics.getMostActiveDay(this.state.data),
      recentHistory: branches.analytics.getRecentHistory(this.state.data),
      allHistory: this.state.data.visitHistory
    };
  }

  /**
   * PUBLIC API: Display stats on the page
   */
  displayStats() {
    if (!this.state.initialized) return;
    this.executeAnalyticsAndDisplayBranch();
  }

  /**
   * PUBLIC API: Clear all data with confirmation
   */
  clearAllData() {
    if (confirm('Are you sure you want to clear all visitor data? This cannot be undone.')) {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.sessionKey);
      this.executeInitializationBranch();
      this.displayStats();
      alert('All visitor data has been cleared!');
    }
  }

  /**
   * UTILITY: Format date string
   */
  getDateString() {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * UTILITY: Check if UI refresh is needed
   */
  shouldRefreshUI() {
    const lastRefresh = sessionStorage.getItem(this.lastRefreshKey);
    const now = Date.now();
    
    if (!lastRefresh) {
      sessionStorage.setItem(this.lastRefreshKey, now.toString());
      return true;
    }
    
    const timeDiff = now - parseInt(lastRefresh);
    const shouldRefresh = timeDiff > 2000; // Refresh every 2 seconds
    
    if (shouldRefresh) {
      sessionStorage.setItem(this.lastRefreshKey, now.toString());
    }
    
    return shouldRefresh;
  }
}

// ============================================
// INITIALIZATION & GLOBAL ACCESS
// ============================================

let visitorAgent;

window.addEventListener('load', () => {
  visitorAgent = new VisitorTrackingAgent();
  visitorAgent.displayStats();
  
  // Auto-refresh UI based on smart refresh logic
  setInterval(() => {
    if (visitorAgent && visitorAgent.shouldRefreshUI()) {
      visitorAgent.displayStats();
    }
  }, 1000);
});

// Global function for clearing data
function clearAllData() {
  if (visitorAgent) {
    visitorAgent.clearAllData();
  }
}

// Export for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisitorTrackingAgent;
}
