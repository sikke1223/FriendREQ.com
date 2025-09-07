// Utility functions for MonkeyMoney application

// Format currency with proper comma separation
function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    return amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate Pakistani phone number
function validatePhone(phone) {
    const phoneRegex = /^03[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Generate unique ID
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate referral code
function generateReferralCode(username) {
    return username.toUpperCase().substr(0, 4) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'fas fa-info-circle';
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
    }
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get current user from localStorage
function getCurrentUser() {
    const currentUserData = localStorage.getItem('monkeymoney_current_user');
    if (!currentUserData) return null;
    
    try {
        const userData = JSON.parse(currentUserData);
        // Get fresh user data from storage
        const users = getUsers();
        const user = users.find(u => u.id === userData.id);
        return user || userData;
    } catch (error) {
        console.error('Error parsing current user data:', error);
        return null;
    }
}

// Set current user in localStorage
function setCurrentUser(user) {
    try {
        localStorage.setItem('monkeymoney_current_user', JSON.stringify(user));
    } catch (error) {
        console.error('Error saving current user:', error);
    }
}

// Validate form input
function validateFormInput(element, validationRules) {
    const value = element.value.trim();
    const errors = [];
    
    if (validationRules.required && !value) {
        errors.push('This field is required');
    }
    
    if (validationRules.email && value && !validateEmail(value)) {
        errors.push('Please enter a valid email address');
    }
    
    if (validationRules.phone && value && !validatePhone(value)) {
        errors.push('Please enter a valid Pakistani phone number (03XXXXXXXXX)');
    }
    
    if (validationRules.minLength && value.length < validationRules.minLength) {
        errors.push(`Minimum length is ${validationRules.minLength} characters`);
    }
    
    if (validationRules.maxLength && value.length > validationRules.maxLength) {
        errors.push(`Maximum length is ${validationRules.maxLength} characters`);
    }
    
    if (validationRules.min && parseFloat(value) < validationRules.min) {
        errors.push(`Minimum value is ${validationRules.min}`);
    }
    
    if (validationRules.max && parseFloat(value) > validationRules.max) {
        errors.push(`Maximum value is ${validationRules.max}`);
    }
    
    // Show/hide validation message
    const errorElement = element.parentNode.querySelector('.validation-message');
    if (errorElement) {
        if (errors.length > 0) {
            errorElement.textContent = errors[0];
            errorElement.style.display = 'block';
            element.classList.add('error');
        } else {
            errorElement.style.display = 'none';
            element.classList.remove('error');
        }
    }
    
    return errors.length === 0;
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Local storage helpers with error handling
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Check if user agent is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Generate password strength indicator
function getPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Lowercase letter');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Uppercase letter');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Number');
    
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Special character');
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return {
        score: strength,
        level: levels[Math.min(strength, 4)],
        feedback: feedback
    };
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Calculate time ago
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return 'Just now';
}
