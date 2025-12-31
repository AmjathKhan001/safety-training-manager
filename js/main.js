// ============================================
// Safety Training Manager - Main JavaScript
// Version: 1.0
// Author: Amjath Khan
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Safety Training Manager loaded');
    
    // Initialize all components
    initMobileMenu();
    initVisitorCounter();
    initFormValidation();
    initToolTabs();
    initSocialSharing();
    initContactForm();
    initBackToTop();
    initSmoothScrolling();
    initLazyLoading();
    initAnalytics();
    
    // Check for browser compatibility
    checkBrowserCompatibility();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Update icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// Visitor Counter
function initVisitorCounter() {
    const counterElements = document.querySelectorAll('#visitorCount, #footerVisitorCount');
    
    if (counterElements.length === 0) return;
    
    // Get or initialize visitor count
    let visitorCount = localStorage.getItem('stmVisitorCount');
    
    if (!visitorCount) {
        // Start with a realistic number
        visitorCount = Math.floor(Math.random() * 500) + 1524;
        localStorage.setItem('stmVisitorCount', visitorCount);
    } else {
        visitorCount = parseInt(visitorCount);
    }
    
    // Increment count
    visitorCount++;
    localStorage.setItem('stmVisitorCount', visitorCount);
    
    // Format number with commas
    const formattedCount = visitorCount.toLocaleString();
    
    // Update all counter elements
    counterElements.forEach(element => {
        element.textContent = formattedCount;
    });
    
    // Update document count (simulated)
    updateDocumentCount();
}

// Simulated document count
function updateDocumentCount() {
    const docCountElement = document.getElementById('docCount');
    if (!docCountElement) return;
    
    let docCount = localStorage.getItem('stmDocumentCount');
    
    if (!docCount) {
        docCount = Math.floor(Math.random() * 2000) + 8000;
        localStorage.setItem('stmDocumentCount', docCount);
    } else {
        docCount = parseInt(docCount);
    }
    
    // Increment randomly
    const increment = Math.floor(Math.random() * 10) + 1;
    docCount += increment;
    localStorage.setItem('stmDocumentCount', docCount);
    
    docCountElement.textContent = docCount.toLocaleString() + '+';
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            this.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = field.getAttribute('data-error-required') || 'This field is required';
    }
    
    // Check email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-email') || 'Please enter a valid email address';
        }
    }
    
    // Check phone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-phone') || 'Please enter a valid phone number';
        }
    }
    
    // Check number range
    if (field.type === 'number' && value) {
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');
        
        if (min && parseFloat(value) < parseFloat(min)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-min') || `Minimum value is ${min}`;
        }
        
        if (max && parseFloat(value) > parseFloat(max)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error-max') || `Maximum value is ${max}`;
        }
    }
    
    // Update UI
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('is-invalid');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.classList.remove('is-invalid');
    
    const existingError = formGroup.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Tool Tabs
function initToolTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // Track tab change in analytics
            trackEvent('tool_tab', 'click', tabId);
        });
    });
}

// Social Sharing
function initSocialSharing() {
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    
    if (shareBtn && shareModal) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            shareModal.style.display = 'flex';
            
            // Track share event
            trackEvent('social_share', 'open', 'modal');
        });
        
        // Close modal
        const closeModal = shareModal.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                shareModal.style.display = 'none';
            });
        }
        
        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.style.display = 'none';
            }
        });
        
        // Copy link functionality
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        const shareLink = document.getElementById('shareLink');
        
        if (copyLinkBtn && shareLink) {
            copyLinkBtn.addEventListener('click', () => {
                shareLink.select();
                document.execCommand('copy');
                
                // Update button text
                const originalText = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                // Track copy event
                trackEvent('social_share', 'copy', 'link');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalText;
                }, 2000);
            });
        }
        
        // Track social share clicks
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.classList.contains('facebook') ? 'facebook' :
                               this.classList.contains('twitter') ? 'twitter' :
                               this.classList.contains('linkedin') ? 'linkedin' :
                               this.classList.contains('whatsapp') ? 'whatsapp' : 'email';
                
                trackEvent('social_share', 'click', platform);
            });
        });
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('Message sent successfully! We will contact you soon.', 'success');
                
                // Track form submission
                trackEvent('contact_form', 'submit', 'success');
                
                // Reset form
                this.reset();
                this.classList.remove('was-validated');
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
                
                // Track error
                trackEvent('contact_form', 'submit', 'error');
                
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Style the button
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '100',
        transition: 'all 0.3s ease'
    });
    
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.background = 'var(--primary-dark)';
        backToTopBtn.style.transform = 'translateY(-3px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.background = 'var(--primary-color)';
        backToTopBtn.style.transform = 'translateY(0)';
    });
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track event
        trackEvent('navigation', 'click', 'back_to_top');
    });
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track anchor click
                trackEvent('navigation', 'click', `anchor_${href}`);
            }
        });
    });
}

// Lazy Loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Analytics Tracking
function initAnalytics() {
    // Page view tracking
    trackEvent('page_view', 'load', window.location.pathname);
    
    // Track external link clicks
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const url = this.href;
            const domain = new URL(url).hostname;
            
            trackEvent('external_link', 'click', domain);
            
            // Delay navigation to allow tracking
            setTimeout(() => {
                window.open(url, '_blank');
            }, 100);
        });
    });
    
    // Track download button clicks
    document.querySelectorAll('.btn[download], .btn[onclick*="download"], .btn[onclick*="save"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('download', 'click', buttonText);
        });
    });
    
    // Track print button clicks
    document.querySelectorAll('.btn[onclick*="print"]').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('print', 'click', 'document');
        });
    });
}

// Track event function
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`Event: ${category}.${action} (${label})`);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        background: type === 'success' ? '#2ecc71' : '#e74c3c',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        minWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        font-size: 1.1rem;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Browser Compatibility Check
function checkBrowserCompatibility() {
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const isOldEdge = !isIE && !!window.StyleMedia;
    const isUnsupported = isIE || isOldEdge;
    
    if (isUnsupported) {
        showNotification(
            'Your browser is outdated. Some features may not work properly. Please update to a modern browser.',
            'warning'
        );
    }
}

// PDF Generation Helper
window.generatePDF = async function(elementId, filename) {
    try {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById(elementId);
        
        if (!element) {
            throw new Error('Element not found');
        }
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Create a temporary clone for better rendering
        const clone = element.cloneNode(true);
        clone.style.width = '210mm';
        clone.style.padding = '20mm';
        clone.style.boxSizing = 'border-box';
        document.body.appendChild(clone);
        
        await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: function(clonedDoc) {
                // Fix any styles in the cloned document
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.width = '210mm';
                    clonedElement.style.padding = '20mm';
                }
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(filename || 'document.pdf');
            
            showNotification('PDF generated successfully!', 'success');
        });
        
        document.body.removeChild(clone);
        return true;
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        showNotification('Failed to generate PDF. Please try again.', 'error');
        return false;
    }
};

// Form Data Export/Import
window.exportFormData = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return null;
    
    const formData = {};
    const elements = form.querySelectorAll('input, textarea, select');
    
    elements.forEach(element => {
        if (element.name) {
            if (element.type === 'checkbox') {
                formData[element.name] = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else {
                formData[element.name] = element.value;
            }
        }
    });
    
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `form_data_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return formData;
};

window.importFormData = function(formId, jsonData) {
    const form = document.getElementById(formId);
    if (!form || !jsonData) return false;
    
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        Object.keys(data).forEach(key => {
            const element = form.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else if (element.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = data[key];
                }
            }
        });
        
        showNotification('Form data imported successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Import Error:', error);
        showNotification('Failed to import form data.', 'error');
        return false;
    }
};

// Session Management for Form Recovery
window.saveSession = function(key, data) {
    try {
        const sessionData = JSON.stringify(data);
        sessionStorage.setItem(`stm_${key}`, sessionData);
        return true;
    } catch (error) {
        console.error('Session Save Error:', error);
        return false;
    }
};

window.loadSession = function(key) {
    try {
        const sessionData = sessionStorage.getItem(`stm_${key}`);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error('Session Load Error:', error);
        return null;
    }
};

window.clearSession = function(key) {
    try {
        sessionStorage.removeItem(`stm_${key}`);
        return true;
    } catch (error) {
        console.error('Session Clear Error:', error);
        return false;
    }
};

// Auto-save functionality for forms
function initAutoSave(formId, interval = 30000) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    let saveTimer;
    
    const saveForm = () => {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        saveSession(`autosave_${formId}`, data);
    };
    
    // Save on input
    form.addEventListener('input', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveForm, 1000);
    });
    
    // Save on change
    form.addEventListener('change', saveForm);
    
    // Load saved data on page load
    window.addEventListener('load', () => {
        const savedData = loadSession(`autosave_${formId}`);
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const element = form.querySelector(`[name="${key}"]`);
                if (element) {
                    element.value = savedData[key];
                }
            });
            
            // Show recovery notification
            const recoverBtn = document.createElement('button');
            recoverBtn.textContent = 'Restore Saved Data';
            recoverBtn.className = 'btn btn-small btn-warning';
            recoverBtn.style.marginTop = '10px';
            
            recoverBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Object.keys(savedData).forEach(key => {
                    const element = form.querySelector(`[name="${key}"]`);
                    if (element) {
                        element.value = savedData[key];
                    }
                });
                showNotification('Form data restored from previous session.', 'success');
                recoverBtn.remove();
            });
            
            const firstField = form.querySelector('input, textarea, select');
            if (firstField && firstField.parentNode) {
                firstField.parentNode.appendChild(recoverBtn);
            }
        }
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        clearSession(`autosave_${formId}`);
    });
}

// Initialize auto-save for main forms
if (document.getElementById('attendanceForm')) {
    initAutoSave('attendanceForm');
}

if (document.getElementById('certificateForm')) {
    initAutoSave('certificateForm');
}

// Performance Monitoring
window.addEventListener('load', function() {
    // Measure page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                    window.performance.timing.navigationStart;
    
    console.log(`Page loaded in ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('Page load time is above 3 seconds. Consider optimizing.');
    }
});

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    // Don't show error notification for minor errors
    if (event.error && event.error.message && 
        !event.error.message.includes('ResizeObserver') &&
        !event.error.message.includes('webpack') &&
        window.location.hostname !== 'localhost') {
        
        trackEvent('error', 'javascript', event.error.message.substring(0, 100));
    }
    
    return false;
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    trackEvent('error', 'promise_rejection', event.reason.toString().substring(0, 100));
});

// Export utility functions
window.SafetyTrainingManager = {
    init: function() {
        initMobileMenu();
        initVisitorCounter();
        initFormValidation();
        initToolTabs();
        initSocialSharing();
        initContactForm();
        initBackToTop();
        initSmoothScrolling();
        initLazyLoading();
        initAnalytics();
    },
    
    generatePDF: window.generatePDF,
    exportFormData: window.exportFormData,
    importFormData: window.importFormData,
    saveSession: window.saveSession,
    loadSession: window.loadSession,
    clearSession: window.clearSession,
    showNotification: showNotification,
    trackEvent: trackEvent
};
// Update the active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a, .nav-links a');
    
    navLinks.forEach(link => {
        // Remove active class from all
        link.classList.remove('active');
        
        // Add active class to current page
        if (link.getAttribute('href') === currentPage || 
            link.getAttribute('href') === './' + currentPage.split('/').pop() ||
            link.getAttribute('href') === currentPage.split('/').pop()) {
            link.classList.add('active');
        }
        
        // Special handling for training-programs
        if (currentPage.includes('training-programs') && 
            link.getAttribute('href') === 'training-programs.html') {
            link.classList.add('active');
        }
    });
});
// Mobile menu toggle for fancy navigation
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
});
// Mobile menu toggle for all pages
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        }
    });
    
    // Close menu when clicking a link (for single page navigation)
    const navLinksAll = document.querySelectorAll('.nav-link');
    navLinksAll.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Highlight active page
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    navLinksAll.forEach(link => {
        const linkPath = link.getAttribute('href');
        const linkPage = linkPath.split('/').pop();
        
        // Remove active class from all
        link.classList.remove('active');
        
        // Add active class to current page
        if (pageName === linkPage || 
            (pageName === '' && linkPage === 'index.html') ||
            (currentPath.includes(linkPage.replace('.html', '')) && linkPage !== 'index.html')) {
            link.classList.add('active');
        }
    });
});
