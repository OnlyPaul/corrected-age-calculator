/**
 * Utility functions for the Corrected Age Calculator
 * Contains date manipulation, formatting, and helper functions
 */

// Utility namespace to avoid global pollution
const Utils = {
    /**
     * Parse a date string to a Date object
     * Handles various input formats and validates the result
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {Date|null} - Valid Date object or null if invalid
     */
    parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return null;
        }
        
        // Handle YYYY-MM-DD format
        const date = new Date(dateString + 'T00:00:00');
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return null;
        }
        
        return date;
    },

    /**
     * Format a date object to YYYY-MM-DD string
     * @param {Date} date - Date object to format
     * @returns {string} - Formatted date string
     */
    formatDateToString(date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return '';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    },

    /**
     * Calculate the number of days between two dates
     * @param {Date} date1 - Start date
     * @param {Date} date2 - End date
     * @returns {number} - Number of days (can be negative if date1 > date2)
     */
    daysBetween(date1, date2) {
        if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
            return 0;
        }
        
        const timeDiff = date2.getTime() - date1.getTime();
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    },

    /**
     * Get today's date at midnight
     * @returns {Date} - Today's date with time set to 00:00:00
     */
    getToday() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    /**
     * Convert total days to weeks and remaining days
     * @param {number} totalDays - Total number of days
     * @returns {Object} - {weeks: number, days: number, totalDays: number}
     */
    daysToWeeksAndDays(totalDays) {
        const weeks = Math.floor(Math.abs(totalDays) / 7);
        const days = Math.abs(totalDays) % 7;
        
        return {
            weeks: totalDays < 0 ? -weeks : weeks,
            days: totalDays < 0 && days > 0 ? -days : days,
            totalDays: totalDays
        };
    },

    /**
     * Convert total days to approximate months and remaining days
     * Uses average month length of 30.44 days
     * @param {number} totalDays - Total number of days
     * @returns {Object} - {months: number, days: number, totalDays: number}
     */
    daysToMonthsAndDays(totalDays) {
        const avgDaysPerMonth = 30.44;
        const months = Math.floor(Math.abs(totalDays) / avgDaysPerMonth);
        const remainingDays = Math.abs(totalDays) % avgDaysPerMonth;
        
        return {
            months: totalDays < 0 ? -months : months,
            days: Math.round(totalDays < 0 && remainingDays > 0 ? -remainingDays : remainingDays),
            totalDays: totalDays
        };
    },

    /**
     * Convert total days to years, months, and days
     * @param {number} totalDays - Total number of days
     * @returns {Object} - {years: number, months: number, days: number, totalDays: number}
     */
    daysToYearsMonthsDays(totalDays) {
        const avgDaysPerYear = 365.25;
        const avgDaysPerMonth = 30.44;
        
        const absTotal = Math.abs(totalDays);
        const years = Math.floor(absTotal / avgDaysPerYear);
        const remainingAfterYears = absTotal % avgDaysPerYear;
        const months = Math.floor(remainingAfterYears / avgDaysPerMonth);
        const days = Math.round(remainingAfterYears % avgDaysPerMonth);
        
        return {
            years: totalDays < 0 ? -years : years,
            months: totalDays < 0 && (months > 0 || days > 0) ? -months : months,
            days: totalDays < 0 && days > 0 ? -days : days,
            totalDays: totalDays
        };
    },

    /**
     * Format age object to human-readable string
     * @param {Object} age - Age object with weeks, days, etc.
     * @param {string} format - Format type: 'weeks', 'months', 'years'
     * @returns {string} - Formatted age string
     */
    formatAge(age, format = 'weeks') {
        if (!age || typeof age.totalDays !== 'number') {
            return '';
        }
        
        const isNegative = age.totalDays < 0;
        const prefix = isNegative ? '-' : '';
        
        switch (format) {
            case 'weeks':
                const weeksData = this.daysToWeeksAndDays(age.totalDays);
                return `${prefix}${Math.abs(weeksData.weeks)} weeks ${Math.abs(weeksData.days)} days`;
                
            case 'months':
                const monthsData = this.daysToMonthsAndDays(age.totalDays);
                return `${prefix}${Math.abs(monthsData.months)} months ${Math.abs(monthsData.days)} days`;
                
            case 'years':
                const yearsData = this.daysToYearsMonthsDays(age.totalDays);
                return `${prefix}${Math.abs(yearsData.years)} years ${Math.abs(yearsData.months)} months`;
                
            case 'detailed':
                if (Math.abs(age.totalDays) < 7) {
                    return `${prefix}${Math.abs(age.totalDays)} days`;
                } else if (Math.abs(age.totalDays) < 365) {
                    const weeks = this.daysToWeeksAndDays(age.totalDays);
                    return `${prefix}${Math.abs(weeks.weeks)} weeks ${Math.abs(weeks.days)} days`;
                } else {
                    const years = this.daysToYearsMonthsDays(age.totalDays);
                    return `${prefix}${Math.abs(years.years)} years ${Math.abs(years.months)} months`;
                }
                
            default:
                return `${prefix}${Math.abs(age.totalDays)} days`;
        }
    },

    /**
     * Sanitize input to prevent XSS and other issues
     * @param {string} input - User input string
     * @returns {string} - Sanitized string
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }
        
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    },

    /**
     * Clamp a number to a specified range
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clampToRange(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Round number to specified decimal places
     * @param {number} value - Value to round
     * @param {number} decimals - Number of decimal places
     * @returns {number} - Rounded value
     */
    roundToDecimals(value, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    },

    /**
     * Check if a year is a leap year
     * @param {number} year - Year to check
     * @returns {boolean} - True if leap year
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },

    /**
     * Get the number of days in a specific month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {number} - Number of days in month
     */
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    },

    /**
     * Format a number for display with locale support
     * @param {number} number - Number to format
     * @param {string} locale - Locale string (default: 'en-US')
     * @returns {string} - Formatted number string
     */
    formatNumber(number, locale = 'en-US') {
        if (typeof number !== 'number' || isNaN(number)) {
            return '0';
        }
        
        return new Intl.NumberFormat(locale).format(number);
    },

    /**
     * Debounce function to limit how often a function can be called
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} - Debounced function
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Check if the current device supports touch
     * @returns {boolean} - True if touch is supported
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get the current viewport width
     * @returns {number} - Viewport width in pixels
     */
    getViewportWidth() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    },

    /**
     * Check if the device is in landscape mode
     * @returns {boolean} - True if in landscape mode
     */
    isLandscape() {
        return window.matchMedia('(orientation: landscape)').matches;
    },

    /**
     * Generate a simple unique ID
     * @returns {string} - Unique ID string
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Scroll to an element smoothly
     * @param {Element} element - Element to scroll to
     * @param {number} offset - Additional offset in pixels
     */
    scrollToElement(element, offset = 0) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Check if an element is in the viewport
     * @param {Element} element - Element to check
     * @returns {boolean} - True if element is visible
     */
    isElementInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Make Utils available globally
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
