/**
 * Validation module for the Corrected Age Calculator
 * Handles input validation, error messages, and data sanitization
 */

const Validation = {
    /**
     * Validation result structure
     * @typedef {Object} ValidationResult
     * @property {boolean} isValid - Whether the input is valid
     * @property {string} error - Error message (if invalid)
     * @property {string} warning - Warning message (if applicable)
     * @property {*} value - Parsed/sanitized value
     */

    /**
     * Validate birth date input
     * @param {string} dateString - Date string to validate
     * @returns {ValidationResult} - Validation result
     */
    validateBirthDate(dateString) {
        const result = {
            isValid: false,
            error: '',
            warning: '',
            value: null
        };

        // Check if date string is provided
        if (!dateString || typeof dateString !== 'string') {
            result.error = 'Birth date is required';
            return result;
        }

        // Sanitize input
        const sanitized = Utils.sanitizeInput(dateString);
        
        // Parse the date
        const date = Utils.parseDate(sanitized);
        if (!date) {
            result.error = 'Please enter a valid date in YYYY-MM-DD format';
            return result;
        }

        // Check if date is in the future
        const today = Utils.getToday();
        if (date > today) {
            result.error = 'Birth date cannot be in the future';
            return result;
        }

        // Check if date is too far in the past (more than 5 years)
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        if (date < fiveYearsAgo) {
            result.warning = 'Birth date is more than 5 years ago. Corrected age is typically only used for the first 2-3 years of life.';
        }

        // Check if date is very recent (less than 20 weeks ago for viability)
        const twentyWeeksAgo = new Date();
        twentyWeeksAgo.setDate(twentyWeeksAgo.getDate() - (20 * 7));
        if (date > twentyWeeksAgo) {
            const daysSince = Utils.daysBetween(date, today);
            const weeksSince = Math.floor(daysSince / 7);
            result.warning = `Infant is only ${weeksSince} weeks old. Please ensure gestational age is accurate for very young infants.`;
        }

        result.isValid = true;
        result.value = date;
        return result;
    },

    /**
     * Validate gestational age input
     * @param {number|string} weeks - Gestational weeks
     * @param {number|string} days - Gestational days
     * @returns {ValidationResult} - Validation result
     */
    validateGestationalAge(weeks, days) {
        const result = {
            isValid: false,
            error: '',
            warning: '',
            value: null
        };

        // Parse and validate weeks
        const weeksNum = parseInt(weeks);
        const daysNum = parseInt(days);

        if (isNaN(weeksNum) || weeksNum < 0) {
            result.error = 'Gestational weeks must be a valid number';
            return result;
        }

        if (isNaN(daysNum) || daysNum < 0) {
            result.error = 'Gestational days must be a valid number';
            return result;
        }

        // Validate ranges
        if (weeksNum < 20) {
            result.error = 'Gestational age must be at least 20 weeks (limit of viability)';
            return result;
        }

        if (weeksNum > 44) {
            result.error = 'Gestational age cannot exceed 44 weeks';
            return result;
        }

        if (daysNum > 6) {
            result.error = 'Gestational days must be between 0 and 6';
            return result;
        }

        // Check for edge cases and provide warnings
        if (weeksNum < 24) {
            result.warning = 'Very preterm infant (<24 weeks). These calculations should be interpreted with extreme caution.';
        } else if (weeksNum < 28) {
            result.warning = 'Extremely preterm infant (24-28 weeks). Clinical context is important for interpreting these calculations.';
        } else if (weeksNum < 32) {
            result.warning = 'Very preterm infant (28-32 weeks). Corrected age is particularly important for developmental assessments.';
        } else if (weeksNum >= 42) {
            result.warning = 'Post-term infant (≥42 weeks). Corrected age will be older than chronological age.';
        }

        // Additional validation for total gestational age
        const totalDays = (weeksNum * 7) + daysNum;
        if (totalDays > (44 * 7)) {
            result.error = 'Total gestational age cannot exceed 44 weeks and 0 days';
            return result;
        }

        result.isValid = true;
        result.value = {
            weeks: weeksNum,
            days: daysNum,
            totalDays: totalDays
        };
        return result;
    },

    /**
     * Validate current date input
     * @param {string} dateString - Date string to validate
     * @param {Date} birthDate - Birth date for comparison
     * @returns {ValidationResult} - Validation result
     */
    validateCurrentDate(dateString, birthDate) {
        const result = {
            isValid: false,
            error: '',
            warning: '',
            value: null
        };

        // If no date string provided, default to today
        if (!dateString || typeof dateString !== 'string') {
            result.isValid = true;
            result.value = Utils.getToday();
            return result;
        }

        // Sanitize and parse date
        const sanitized = Utils.sanitizeInput(dateString);
        const date = Utils.parseDate(sanitized);
        
        if (!date) {
            result.error = 'Please enter a valid date in YYYY-MM-DD format';
            return result;
        }

        // Check if current date is before birth date
        if (birthDate && date < birthDate) {
            result.error = 'Calculation date cannot be before birth date';
            return result;
        }

        // Check if date is too far in the future
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        if (date > oneYearFromNow) {
            result.error = 'Calculation date cannot be more than one year in the future';
            return result;
        }

        // Warn if date is in the future
        const today = Utils.getToday();
        if (date > today) {
            result.warning = 'Calculation date is in the future. Results will be projected ages.';
        }

        result.isValid = true;
        result.value = date;
        return result;
    },

    /**
     * Validate all inputs together for consistency
     * @param {string} birthDate - Birth date string
     * @param {number} gestationalWeeks - Gestational weeks
     * @param {number} gestationalDays - Gestational days
     * @param {string} currentDate - Current date string
     * @returns {Object} - Combined validation results
     */
    validateAllInputs(birthDate, gestationalWeeks, gestationalDays, currentDate) {
        const results = {
            birthDate: this.validateBirthDate(birthDate),
            gestationalAge: this.validateGestationalAge(gestationalWeeks, gestationalDays),
            currentDate: null,
            isValid: false,
            errors: [],
            warnings: []
        };

        // Validate current date with birth date context
        if (results.birthDate.isValid) {
            results.currentDate = this.validateCurrentDate(currentDate, results.birthDate.value);
        } else {
            results.currentDate = this.validateCurrentDate(currentDate, null);
        }

        // Check overall validity
        results.isValid = results.birthDate.isValid && 
                         results.gestationalAge.isValid && 
                         results.currentDate.isValid;

        // Collect all errors and warnings
        if (results.birthDate.error) results.errors.push(results.birthDate.error);
        if (results.gestationalAge.error) results.errors.push(results.gestationalAge.error);
        if (results.currentDate.error) results.errors.push(results.currentDate.error);

        if (results.birthDate.warning) results.warnings.push(results.birthDate.warning);
        if (results.gestationalAge.warning) results.warnings.push(results.gestationalAge.warning);
        if (results.currentDate.warning) results.warnings.push(results.currentDate.warning);

        // Cross-validation checks
        if (results.isValid) {
            const crossValidation = this.performCrossValidation(
                results.birthDate.value,
                results.gestationalAge.value,
                results.currentDate.value
            );
            
            if (crossValidation.warning) {
                results.warnings.push(crossValidation.warning);
            }
            if (crossValidation.error) {
                results.errors.push(crossValidation.error);
                results.isValid = false;
            }
        }

        return results;
    },

    /**
     * Perform cross-validation checks between all inputs
     * @param {Date} birthDate - Validated birth date
     * @param {Object} gestationalAge - Validated gestational age
     * @param {Date} currentDate - Validated current date
     * @returns {Object} - Cross-validation results
     */
    performCrossValidation(birthDate, gestationalAge, currentDate) {
        const result = {
            error: '',
            warning: ''
        };

        // Calculate chronological age
        const chronologicalDays = Utils.daysBetween(birthDate, currentDate);
        const chronologicalWeeks = Math.floor(chronologicalDays / 7);

        // Check if infant is too old for corrected age calculations
        if (chronologicalDays > (3 * 365)) { // 3 years
            result.warning = 'Corrected age is typically only used for the first 2-3 years of life. Consider using chronological age for older children.';
        }

        // Check for unrealistic combinations
        if (gestationalAge.weeks >= 37 && chronologicalDays < 14) {
            result.warning = 'Infant was born at term or near-term. Corrected age may not be clinically relevant.';
        }

        // Check if corrected age would be extremely negative
        const termDays = 40 * 7; // 40 weeks in days
        const correctedDays = chronologicalDays - (termDays - gestationalAge.totalDays);
        
        if (correctedDays < -140) { // More than 20 weeks negative
            result.warning = 'Corrected age is very negative (more than 20 weeks). Ensure all inputs are correct.';
        }

        // Check for very short time since birth for very preterm infants
        if (gestationalAge.weeks < 28 && chronologicalDays < 7) {
            result.warning = 'Very preterm infant in first week of life. Clinical interpretation requires specialized neonatal expertise.';
        }

        return result;
    },

    /**
     * Format validation error message for display
     * @param {string} field - Field name
     * @param {string} error - Error message
     * @returns {string} - Formatted error message
     */
    formatErrorMessage(field, error) {
        if (!error) return '';
        
        const fieldNames = {
            birthDate: 'Birth Date',
            gestationalAge: 'Gestational Age',
            currentDate: 'Calculation Date',
            gestationalWeeks: 'Gestational Weeks',
            gestationalDays: 'Gestational Days'
        };
        
        const displayName = fieldNames[field] || field;
        return `${displayName}: ${error}`;
    },

    /**
     * Format validation warning message for display
     * @param {string} warning - Warning message
     * @returns {string} - Formatted warning message
     */
    formatWarningMessage(warning) {
        if (!warning) return '';
        return `⚠️ ${warning}`;
    },

    /**
     * Check if a date string matches expected format
     * @param {string} dateString - Date string to check
     * @returns {boolean} - True if format is correct
     */
    isValidDateFormat(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return false;
        }
        
        // Check YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(dateString);
    },

    /**
     * Check if a number is within a specified range
     * @param {number} value - Value to check
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (inclusive)
     * @returns {boolean} - True if value is in range
     */
    isInRange(value, min, max) {
        return typeof value === 'number' && 
               !isNaN(value) && 
               value >= min && 
               value <= max;
    },

    /**
     * Sanitize and validate numeric input
     * @param {string|number} input - Input to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @returns {ValidationResult} - Validation result
     */
    validateNumericInput(input, min, max) {
        const result = {
            isValid: false,
            error: '',
            warning: '',
            value: null
        };

        // Convert to number
        const num = parseInt(input);
        
        if (isNaN(num)) {
            result.error = 'Please enter a valid number';
            return result;
        }

        if (num < min) {
            result.error = `Value must be at least ${min}`;
            return result;
        }

        if (num > max) {
            result.error = `Value cannot exceed ${max}`;
            return result;
        }

        result.isValid = true;
        result.value = num;
        return result;
    },

    /**
     * Get appropriate error message based on error type
     * @param {string} errorType - Type of error
     * @param {Object} context - Additional context for error message
     * @returns {string} - User-friendly error message
     */
    getErrorMessage(errorType, context = {}) {
        const messages = {
            required: 'This field is required',
            invalidDate: 'Please enter a valid date (YYYY-MM-DD)',
            futureDate: 'Date cannot be in the future',
            pastLimit: 'Date is too far in the past',
            invalidNumber: 'Please enter a valid number',
            rangeError: `Value must be between ${context.min || 0} and ${context.max || 100}`,
            formatError: 'Invalid format. Please check your input.',
            consistencyError: 'This value is inconsistent with other inputs'
        };

        return messages[errorType] || 'Invalid input';
    }
};

// Make Validation available globally
if (typeof window !== 'undefined') {
    window.Validation = Validation;
}

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
}
