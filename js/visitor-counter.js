// ============================================
// Visitor Counter System
// Version: 1.0
// ============================================

class VisitorCounter {
    constructor() {
        this.storageKey = 'stm_visitor_stats';
        this.cookieName = 'stm_visitor_id';
        this.sessionKey = 'stm_session_data';
        this.apiEndpoint = null; // Set to your API endpoint if available
        
        this.stats = {
            totalVisitors: 0,
            uniqueVisitors: 0,
            returningVisitors: 0,
            pageViews: 0,
            sessions: 0,
            documentsGenerated: 0,
            lastVisit: null,
            visitHistory: [],
            dailyStats: {},
            monthlyStats: {}
        };
        
        this.currentSession = {
            id: this.generateSessionId(),
            startTime: new Date().toISOString(),
            pageViews: 0,
            documentsGenerated: 0,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        this.visitorId = this.getVisitorId();
        this.init();
    }
    
    init() {
        this.loadStats();
        this.trackVisit();
        this.setupEventListeners();
        this.startSessionTimer();
        this.updateDisplay();
        
        // Send data to API if endpoint is set
        if (this.apiEndpoint) {
            this.sendToAPI();
        }
        
        console.log('Visitor Counter initialized');
    }
    
    generateVisitorId() {
        // Generate a unique visitor ID
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 9);
        return `visitor_${timestamp}_${randomStr}`;
    }
    
    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 12);
        return `session_${timestamp}_${randomStr}`;
    }
    
    getVisitorId() {
        // Try to get existing visitor ID from cookie
        let visitorId = this.getCookie(this.cookieName);
        
        if (!visitorId) {
            // Generate new visitor ID
            visitorId = this.generateVisitorId();
            this.setCookie(this.cookieName, visitorId, 365); // Store for 1 year
        }
        
        return visitorId;
    }
    
    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }
    
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
    }
    
    loadStats() {
        try {
            const savedStats = localStorage.getItem(this.storageKey);
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }
            
            const savedSession = sessionStorage.getItem(this.sessionKey);
            if (savedSession) {
                this.currentSession = JSON.parse(savedSession);
            }
        } catch (error) {
            console.warn('Failed to load visitor stats:', error);
            this.resetStats();
        }
    }
    
    saveStats() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.currentSession));
        } catch (error) {
            console.warn('Failed to save visitor stats:', error);
        }
    }
    
    resetStats() {
        this.stats = {
            totalVisitors: 0,
            uniqueVisitors: 0,
            returningVisitors: 0,
            pageViews: 0,
            sessions: 0,
            documentsGenerated: 0,
            lastVisit: new Date().toISOString(),
            visitHistory: [],
            dailyStats: {},
            monthlyStats: {}
        };
        this.saveStats();
    }
    
    trackVisit() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const month = now.toISOString().substr(0, 7); // YYYY-MM
        
        // Check if this is a new day
        if (!this.stats.dailyStats[today]) {
            this.stats.dailyStats[today] = {
                visits: 0,
                uniqueVisitors: 0,
                pageViews: 0,
                documentsGenerated: 0
            };
        }
        
        // Check if this is a new month
        if (!this.stats.monthlyStats[month]) {
            this.stats.monthlyStats[month] = {
                visits: 0,
                uniqueVisitors: 0,
                pageViews: 0,
                documentsGenerated: 0
            };
        }
        
        // Update stats
        this.stats.pageViews++;
        this.stats.dailyStats[today].pageViews++;
        this.stats.monthlyStats[month].pageViews++;
        
        // Check if this is a new visitor
        const isNewVisitor = !this.stats.visitHistory.some(visit => visit.visitorId === this.visitorId);
        
        if (isNewVisitor) {
            this.stats.uniqueVisitors++;
            this.stats.dailyStats[today].uniqueVisitors++;
            this.stats.monthlyStats[month].uniqueVisitors++;
            
            // Add to visit history
            this.stats.visitHistory.push({
                visitorId: this.visitorId,
                firstVisit: now.toISOString(),
                lastVisit: now.toISOString(),
                totalVisits: 1
            });
        } else {
            // Update existing visitor
            const visitorIndex = this.stats.visitHistory.findIndex(v => v.visitorId === this.visitorId);
            if (visitorIndex !== -1) {
                this.stats.visitHistory[visitorIndex].lastVisit = now.toISOString();
                this.stats.visitHistory[visitorIndex].totalVisits++;
                
                if (this.stats.visitHistory[visitorIndex].totalVisits > 1) {
                    this.stats.returningVisitors++;
                }
            }
        }
        
        // Update session data
        this.currentSession.pageViews++;
        this.stats.sessions++;
        this.stats.dailyStats[today].visits++;
        this.stats.monthlyStats[month].visits++;
        
        this.stats.lastVisit = now.toISOString();
        this.stats.totalVisitors = this.stats.uniqueVisitors + this.stats.returningVisitors;
        
        // Clean up old history (keep only last 1000 visits)
        if (this.stats.visitHistory.length > 1000) {
            this.stats.visitHistory = this.stats.visitHistory.slice(-1000);
        }
        
        // Clean up old daily stats (keep only last 365 days)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];
        
        Object.keys(this.stats.dailyStats).forEach(date => {
            if (date < oneYearAgoStr) {
                delete this.stats.dailyStats[date];
            }
        });
        
        // Clean up old monthly stats (keep only last 24 months)
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const twoYearsAgoStr = twoYearsAgo.toISOString().substr(0, 7);
        
        Object.keys(this.stats.monthlyStats).forEach(monthKey => {
            if (monthKey < twoYearsAgoStr) {
                delete this.stats.monthlyStats[monthKey];
            }
        });
        
        this.saveStats();
    }
    
    trackDocumentGeneration(type = 'unknown') {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const month = now.toISOString().substr(0, 7);
        
        this.stats.documentsGenerated++;
        this.currentSession.documentsGenerated++;
        
        if (this.stats.dailyStats[today]) {
            this.stats.dailyStats[today].documentsGenerated++;
        }
        
        if (this.stats.monthlyStats[month]) {
            this.stats.monthlyStats[month].documentsGenerated++;
        }
        
        // Add to document history
        if (!this.stats.documentHistory) {
            this.stats.documentHistory = [];
        }
        
        this.stats.documentHistory.push({
            type: type,
            timestamp: now.toISOString(),
            visitorId: this.visitorId,
            sessionId: this.currentSession.id
        });
        
        // Keep only last 500 document records
        if (this.stats.documentHistory.length > 500) {
            this.stats.documentHistory = this.stats.documentHistory.slice(-500);
        }
        
        this.saveStats();
        this.updateDisplay();
        
        // Send event to analytics
        this.sendEvent('document_generated', { type: type });
    }
    
    trackEvent(eventName, eventData = {}) {
        if (!this.stats.events) {
            this.stats.events = [];
        }
        
        const event = {
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            visitorId: this.visitorId,
            sessionId: this.currentSession.id,
            page: window.location.pathname
        };
        
        this.stats.events.push(event);
        
        // Keep only last 1000 events
        if (this.stats.events.length > 1000) {
            this.stats.events = this.stats.events.slice(-1000);
        }
        
        this.saveStats();
        
        // Send to API if available
        if (this.apiEndpoint) {
            this.sendEventToAPI(eventName, eventData);
        }
        
        // Also send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...eventData,
                visitor_id: this.visitorId,
                session_id: this.currentSession.id
            });
        }
    }
    
    setupEventListeners() {
        // Track PDF generation
        document.addEventListener('pdfGenerated', (e) => {
            const type = e.detail?.type || 'pdf';
            this.trackDocumentGeneration(type);
        });
        
        // Track form submissions
        document.addEventListener('formSubmitted', (e) => {
            const formId = e.detail?.formId || 'unknown';
            this.trackEvent('form_submit', { form_id: formId });
        });
        
        // Track tool usage
        document.addEventListener('toolUsed', (e) => {
            const toolName = e.detail?.tool || 'unknown';
            this.trackEvent('tool_usage', { tool: toolName });
        });
        
        // Track external link clicks
        document.addEventListener('externalLinkClick', (e) => {
            const url = e.detail?.url || 'unknown';
            this.trackEvent('external_link_click', { url: url });
        });
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });
        
        // Track beforeunload (page closing)
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
    }
    
    startSessionTimer() {
        // Update session duration every minute
        this.sessionTimer = setInterval(() => {
            if (this.currentSession) {
                this.currentSession.duration = Date.now() - new Date(this.currentSession.startTime).getTime();
                this.saveStats();
            }
        }, 60000); // Update every minute
    }
    
    endSession() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        if (this.currentSession) {
            this.currentSession.endTime = new Date().toISOString();
            this.currentSession.duration = Date.now() - new Date(this.currentSession.startTime).getTime();
            this.saveStats();
            
            // Send session data to API
            if (this.apiEndpoint) {
                this.sendSessionToAPI();
            }
        }
    }
    
    updateDisplay() {
        // Update all counter elements on the page
        this.updateCounterElement('visitorCount', this.stats.totalVisitors);
        this.updateCounterElement('footerVisitorCount', this.stats.totalVisitors);
        this.updateCounterElement('uniqueVisitorsCount', this.stats.uniqueVisitors);
        this.updateCounterElement('pageViewsCount', this.stats.pageViews);
        this.updateCounterElement('documentsCount', this.stats.documentsGenerated);
        
        // Update today's stats if elements exist
        const today = new Date().toISOString().split('T')[0];
        const todayStats = this.stats.dailyStats[today] || { visits: 0, uniqueVisitors: 0, pageViews: 0, documentsGenerated: 0 };
        
        this.updateCounterElement('todayVisits', todayStats.visits);
        this.updateCounterElement('todayUniqueVisitors', todayStats.uniqueVisitors);
        this.updateCounterElement('todayPageViews', todayStats.pageViews);
        this.updateCounterElement('todayDocuments', todayStats.documentsGenerated);
        
        // Update monthly stats
        const month = new Date().toISOString().substr(0, 7);
        const monthStats = this.stats.monthlyStats[month] || { visits: 0, uniqueVisitors: 0, pageViews: 0, documentsGenerated: 0 };
        
        this.updateCounterElement('monthVisits', monthStats.visits);
        this.updateCounterElement('monthUniqueVisitors', monthStats.uniqueVisitors);
        this.updateCounterElement('monthPageViews', monthStats.pageViews);
        this.updateCounterElement('monthDocuments', monthStats.documentsGenerated);
        
        // Update live counter with animation
        this.animateCounters();
    }
    
    updateCounterElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Format number with commas
            const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
            
            // Check if we need to animate
            const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const newValue = typeof value === 'number' ? value : parseInt(value) || 0;
            
            if (currentValue !== newValue && Math.abs(newValue - currentValue) > 0) {
                // Store target value for animation
                element.dataset.targetValue = newValue;
                element.dataset.currentValue = currentValue;
            } else {
                element.textContent = formattedValue;
            }
        }
    }
    
    animateCounters() {
        const counterElements = document.querySelectorAll('[id$="Count"], [id$="Count"] ~ span');
        
        counterElements.forEach(element => {
            const targetValue = element.dataset.targetValue;
            const currentValue = element.dataset.currentValue;
            
            if (targetValue && currentValue && targetValue !== currentValue) {
                this.animateValue(element, parseInt(currentValue), parseInt(targetValue), 1000);
                
                // Clear stored values
                delete element.dataset.targetValue;
                delete element.dataset.currentValue;
            }
        });
    }
    
    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(start + (end - start) * easeOutQuart);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString();
            }
        };
        
        requestAnimationFrame(step);
    }
    
    getStats() {
        return {
            ...this.stats,
            currentVisitor: this.visitorId,
            currentSession: this.currentSession,
            realTime: {
                onlineUsers: this.getEstimatedOnlineUsers(),
                activeSessions: this.getActiveSessions()
            }
        };
    }
    
    getEstimatedOnlineUsers() {
        // Estimate based on recent visits (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentVisits = this.stats.visitHistory.filter(visit => 
            new Date(visit.lastVisit) > fiveMinutesAgo
        );
        
        return recentVisits.length;
    }
    
    getActiveSessions() {
        // Estimate active sessions (started within last 30 minutes)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        // This would need server-side tracking for accurate results
        // For now, estimate based on recent visits
        return this.getEstimatedOnlineUsers();
    }
    
    getDailyStats(days = 7) {
        const result = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            result.push({
                date: dateStr,
                visits: this.stats.dailyStats[dateStr]?.visits || 0,
                uniqueVisitors: this.stats.dailyStats[dateStr]?.uniqueVisitors || 0,
                pageViews: this.stats.dailyStats[dateStr]?.pageViews || 0,
                documentsGenerated: this.stats.dailyStats[dateStr]?.documentsGenerated || 0
            });
        }
        
        return result;
    }
    
    getMonthlyStats(months = 12) {
        const result = [];
        const today = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toISOString().substr(0, 7);
            
            result.push({
                month: monthStr,
                visits: this.stats.monthlyStats[monthStr]?.visits || 0,
                uniqueVisitors: this.stats.monthlyStats[monthStr]?.uniqueVisitors || 0,
                pageViews: this.stats.monthlyStats[monthStr]?.pageViews || 0,
                documentsGenerated: this.stats.monthlyStats[monthStr]?.documentsGenerated || 0
            });
        }
        
        return result;
    }
    
    exportStats(format = 'json') {
        const stats = this.getStats();
        
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(stats, null, 2);
                
            case 'csv':
                return this.convertToCSV(stats);
                
            case 'html':
                return this.convertToHTML(stats);
                
            default:
                return stats;
        }
    }
    
    convertToCSV(stats) {
        // Convert daily stats to CSV
        const dailyData = this.getDailyStats(30);
        let csv = 'Date,Visits,Unique Visitors,Page Views,Documents Generated\n';
        
        dailyData.forEach(day => {
            csv += `${day.date},${day.visits},${day.uniqueVisitors},${day.pageViews},${day.documentsGenerated}\n`;
        });
        
        return csv;
    }
    
    convertToHTML(stats) {
        const dailyData = this.getDailyStats(7);
        
        let html = `
            <div class="stats-report">
                <h3>Visitor Statistics Report</h3>
                <p>Generated: ${new Date().toLocaleString()}</p>
                
                <div class="summary">
                    <h4>Summary</h4>
                    <ul>
                        <li>Total Visitors: ${stats.totalVisitors.toLocaleString()}</li>
                        <li>Unique Visitors: ${stats.uniqueVisitors.toLocaleString()}</li>
                        <li>Page Views: ${stats.pageViews.toLocaleString()}</li>
                        <li>Documents Generated: ${stats.documentsGenerated.toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="daily-stats">
                    <h4>Last 7 Days</h4>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <tr>
                            <th>Date</th>
                            <th>Visits</th>
                            <th>Unique Visitors</th>
                            <th>Page Views</th>
                            <th>Documents</th>
                        </tr>
        `;
        
        dailyData.forEach(day => {
            html += `
                <tr>
                    <td>${day.date}</td>
                    <td>${day.visits}</td>
                    <td>${day.uniqueVisitors}</td>
                    <td>${day.pageViews}</td>
                    <td>${day.documentsGenerated}</td>
                </tr>
            `;
        });
        
        html += `
                    </table>
                </div>
            </div>
        `;
        
        return html;
    }
    
    async sendToAPI() {
        if (!this.apiEndpoint) return;
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    visitorId: this.visitorId,
                    sessionId: this.currentSession.id,
                    stats: this.stats,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            console.log('Stats sent to API successfully');
        } catch (error) {
            console.warn('Failed to send stats to API:', error);
        }
    }
    
    async sendEventToAPI(eventName, eventData) {
        if (!this.apiEndpoint) return;
        
        try {
            await fetch(`${this.apiEndpoint}/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: eventName,
                    data: eventData,
                    visitorId: this.visitorId,
                    sessionId: this.currentSession.id,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.warn('Failed to send event to API:', error);
        }
    }
    
    async sendSessionToAPI() {
        if (!this.apiEndpoint) return;
        
        try {
            await fetch(`${this.apiEndpoint}/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentSession)
            });
        } catch (error) {
            console.warn('Failed to send session to API:', error);
        }
    }
    
    // Public API
    incrementDocuments(count = 1) {
        for (let i = 0; i < count; i++) {
            this.trackDocumentGeneration('manual');
        }
    }
    
    resetCounter() {
        if (confirm('Are you sure you want to reset all visitor statistics? This cannot be undone.')) {
            this.resetStats();
            this.updateDisplay();
            return true;
        }
        return false;
    }
    
    // Dashboard UI
    showDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const stats = this.getStats();
        const dailyStats = this.getDailyStats(7);
        const monthlyStats = this.getMonthlyStats(6);
        
        container.innerHTML = `
            <div class="visitor-dashboard" style="
                background: white;
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <h2 style="color: #2c3e50; margin-bottom: 25px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                    📊 Visitor Statistics Dashboard
                </h2>
                
                <!-- Summary Cards -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                ">
                    <div style="
                        background: linear-gradient(135deg, #3498db, #2980b9);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">
                            ${stats.totalVisitors.toLocaleString()}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Total Visitors</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #2ecc71, #27ae60);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">
                            ${stats.uniqueVisitors.toLocaleString()}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Unique Visitors</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">
                            ${stats.documentsGenerated.toLocaleString()}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Documents Generated</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(135deg, #f39c12, #d35400);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">
                            ${stats.realTime.onlineUsers}
                        </div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Online Now</div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                ">
                    <!-- Daily Chart -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2c3e50; margin-bottom: 15px;">Last 7 Days</h3>
                        <div style="height: 200px; display: flex; align-items: flex-end; gap: 10px;">
                            ${dailyStats.map(day => {
                                const maxVisits = Math.max(...dailyStats.map(d => d.visits));
                                const height = maxVisits > 0 ? (day.visits / maxVisits) * 150 : 0;
                                
                                return `
                                    <div style="
                                        flex: 1;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                    ">
                                        <div style="
                                            width: 100%;
                                            height: ${height}px;
                                            background: linear-gradient(to top, #3498db, #5dade2);
                                            border-radius: 5px 5px 0 0;
                                            margin-bottom: 10px;
                                        "></div>
                                        <div style="font-size: 0.8rem; color: #7f8c8d;">
                                            ${day.date.split('-')[2]}
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: bold; color: #2c3e50;">
                                            ${day.visits}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Monthly Chart -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2c3e50; margin-bottom: 15px;">Last 6 Months</h3>
                        <div style="height: 200px; display: flex; align-items: flex-end; gap: 10px;">
                            ${monthlyStats.map(month => {
                                const maxVisits = Math.max(...monthlyStats.map(m => m.visits));
                                const height = maxVisits > 0 ? (month.visits / maxVisits) * 150 : 0;
                                const monthName = new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'short' });
                                
                                return `
                                    <div style="
                                        flex: 1;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: center;
                                    ">
                                        <div style="
                                            width: 100%;
                                            height: ${height}px;
                                            background: linear-gradient(to top, #2ecc71, #58d68d);
                                            border-radius: 5px 5px 0 0;
                                            margin-bottom: 10px;
                                        "></div>
                                        <div style="font-size: 0.8rem; color: #7f8c8d;">
                                            ${monthName}
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: bold; color: #2c3e50;">
                                            ${month.visits.toLocaleString()}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div style="
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-top: 25px;
                    padding-top: 25px;
                    border-top: 1px solid #eee;
                ">
                    <button onclick="visitorCounter.exportData('json')" style="
                        padding: 10px 20px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        📥 Export JSON
                    </button>
                    
                    <button onclick="visitorCounter.exportData('csv')" style="
                        padding: 10px 20px;
                        background: #2ecc71;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        📊 Export CSV
                    </button>
                    
                    <button onclick="visitorCounter.refreshDashboard()" style="
                        padding: 10px 20px;
                        background: #f39c12;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        🔄 Refresh
                    </button>
                </div>
                
                <div style="
                    margin-top: 20px;
                    font-size: 0.8rem;
                    color: #7f8c8d;
                    text-align: center;
                ">
                    <p>Last updated: ${new Date().toLocaleTimeString()}</p>
                    <p>Visitor ID: ${stats.currentVisitor}</p>
                </div>
            </div>
        `;
    }
    
    exportData(format) {
        const data = this.exportStats(format);
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitor_stats_${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    refreshDashboard() {
        this.updateDisplay();
        this.showDashboard('visitorDashboard');
    }
}

// Initialize Visitor Counter
let visitorCounter;

document.addEventListener('DOMContentLoaded', function() {
    visitorCounter = new VisitorCounter();
    
    // Make available globally
    window.visitorCounter = visitorCounter;
    
    // Add global event dispatchers
    window.dispatchDocumentGenerated = function(type) {
        document.dispatchEvent(new CustomEvent('pdfGenerated', {
            detail: { type: type }
        }));
    };
    
    window.dispatchFormSubmitted = function(formId) {
        document.dispatchEvent(new CustomEvent('formSubmitted', {
            detail: { formId: formId }
        }));
    };
    
    window.dispatchToolUsed = function(toolName) {
        document.dispatchEvent(new CustomEvent('toolUsed', {
            detail: { tool: toolName }
        }));
    };
    
    console.log('Visitor Counter initialized');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisitorCounter };
}
