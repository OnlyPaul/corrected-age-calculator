/**
 * UI Controller for the Corrected Age Calculator
 * Handles user interactions, form management, and results display
 */

const UIController = {
    // DOM element references
    elements: {
        form: null,
        helpToggle: null,
        helpPanel: null,
        birthDateInput: null,
        gestationalWeeksInput: null,
        gestationalDaysInput: null,
        currentDateInput: null,
        dateOptionRadios: null,
        calculateBtn: null,
        clearBtn: null,
        printBtn: null,
        resultsSection: null,
        loadingOverlay: null,
        errorElements: {},
        resultElements: {}
    },

    // Application state
    state: {
        isCalculating: false,
        lastCalculation: null,
        helpVisible: false,
        validationErrors: {},
        currentInputs: {}
    },

    /**
     * Initialize the UI controller
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupInitialState();
        this.setupAccessibility();
        
        // Set default values
        this.setDefaultValues();
        
        console.log('UI Controller initialized');
    },

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        // Form elements
        this.elements.form = document.getElementById('age-calculator-form');
        this.elements.helpToggle = document.querySelector('.help-toggle');
        this.elements.helpPanel = document.getElementById('help-panel');
        
        // Input elements
        this.elements.birthDateInput = document.getElementById('birth-date');
        this.elements.gestationalWeeksInput = document.getElementById('gestational-weeks');
        this.elements.gestationalDaysInput = document.getElementById('gestational-days');
        this.elements.currentDateInput = document.getElementById('current-date');
        this.elements.dateOptionRadios = document.querySelectorAll('input[name="dateOption"]');
        
        // Button elements
        this.elements.calculateBtn = document.getElementById('calculate-btn');
        this.elements.clearBtn = document.getElementById('clear-btn');
        this.elements.printBtn = document.getElementById('print-btn');
        
        // Display elements
        this.elements.resultsSection = document.getElementById('results-section');
        this.elements.loadingOverlay = document.getElementById('loading-overlay');
        
        // Error elements
        this.elements.errorElements = {
            birthDate: document.getElementById('birth-date-error'),
            gestational: document.getElementById('gestational-error'),
            currentDate: document.getElementById('current-date-error')
        };
        
        // Result elements
        this.elements.resultElements = {
            correctedAge: document.getElementById('corrected-age-value'),
            postmenstrualAge: document.getElementById('postmenstrual-age-value'),
            chronologicalAge: document.getElementById('chronological-age-value'),
            additionalInfo: document.getElementById('additional-details')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Help toggle
        if (this.elements.helpToggle) {
            this.elements.helpToggle.addEventListener('click', this.toggleHelp.bind(this));
        }
        
        // Input validation (real-time)
        if (this.elements.birthDateInput) {
            this.elements.birthDateInput.addEventListener('blur', this.validateBirthDate.bind(this));
            this.elements.birthDateInput.addEventListener('change', this.validateBirthDate.bind(this));
        }
        
        if (this.elements.gestationalWeeksInput) {
            this.elements.gestationalWeeksInput.addEventListener('blur', this.validateGestationalAge.bind(this));
            this.elements.gestationalWeeksInput.addEventListener('input', this.validateGestationalAge.bind(this));
        }
        
        if (this.elements.gestationalDaysInput) {
            this.elements.gestationalDaysInput.addEventListener('blur', this.validateGestationalAge.bind(this));
            this.elements.gestationalDaysInput.addEventListener('input', this.validateGestationalAge.bind(this));
        }
        
        if (this.elements.currentDateInput) {
            this.elements.currentDateInput.addEventListener('blur', this.validateCurrentDate.bind(this));
            this.elements.currentDateInput.addEventListener('change', this.validateCurrentDate.bind(this));
        }
        
        // Date option handling
        this.elements.dateOptionRadios.forEach(radio => {
            radio.addEventListener('change', this.handleDateOptionChange.bind(this));
        });
        
        // Action buttons
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', this.handleClear.bind(this));
        }
        
        if (this.elements.printBtn) {
            this.elements.printBtn.addEventListener('click', this.handlePrint.bind(this));
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Auto-advance from weeks to days input
        if (this.elements.gestationalWeeksInput) {
            this.elements.gestationalWeeksInput.addEventListener('input', (e) => {
                if (e.target.value.length === 2 && this.elements.gestationalDaysInput) {
                    this.elements.gestationalDaysInput.focus();
                }
            });
        }
    },

    /**
     * Set up initial state
     */
    setupInitialState() {
        // Hide results section initially
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        // Hide loading overlay
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
        }
        
        // Set initial date option state
        this.handleDateOptionChange();
    },

    /**
     * Set up accessibility features
     */
    setupAccessibility() {
        // Ensure proper ARIA attributes
        if (this.elements.helpPanel) {
            this.elements.helpPanel.setAttribute('aria-hidden', 'true');
        }
        
        // Set up live regions for dynamic content
        this.setupLiveRegions();
    },

    /**
     * Set up ARIA live regions for screen reader announcements
     */
    setupLiveRegions() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    },

    /**
     * Set default values for inputs
     */
    setDefaultValues() {
        // Set current date input to today
        if (this.elements.currentDateInput) {
            const today = Utils.formatDateToString(Utils.getToday());
            this.elements.currentDateInput.value = today;
        }
        
        // Set default gestational values (placeholder suggestions)
        if (this.elements.gestationalWeeksInput && !this.elements.gestationalWeeksInput.value) {
            this.elements.gestationalWeeksInput.placeholder = '32';
        }
        
        if (this.elements.gestationalDaysInput && !this.elements.gestationalDaysInput.value) {
            this.elements.gestationalDaysInput.placeholder = '4';
        }
    },

    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.state.isCalculating) {
            return;
        }
        
        try {
            this.state.isCalculating = true;
            this.showLoading();
            this.clearAllErrors();
            
            // Collect form data
            const formData = this.getFormData();
            
            // Validate all inputs
            const validation = Validation.validateAllInputs(
                formData.birthDate,
                formData.gestationalWeeks,
                formData.gestationalDays,
                formData.currentDate
            );
            
            if (!validation.isValid) {
                this.displayValidationErrors(validation);
                this.announceToScreenReader('Please correct the errors in the form');
                return;
            }
            
            // Show warnings if any
            if (validation.warnings.length > 0) {
                this.displayWarnings(validation.warnings);
            }
            
            // Perform calculations
            const results = AgeCalculator.calculateAllAges(
                validation.birthDate.value,
                validation.gestationalAge.value,
                validation.currentDate.value
            );
            
            // Store results
            this.state.lastCalculation = results;
            this.state.currentInputs = formData;
            
            // Display results
            this.displayResults(results);
            this.announceToScreenReader('Calculation completed successfully');
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.displayError('An error occurred during calculation. Please check your inputs and try again.');
            this.announceToScreenReader('Calculation failed. Please check your inputs');
        } finally {
            this.state.isCalculating = false;
            this.hideLoading();
        }
    },

    /**
     * Get form data
     * @returns {Object} - Form data object
     */
    getFormData() {
        const dateOption = document.querySelector('input[name="dateOption"]:checked')?.value;
        const currentDate = dateOption === 'today' ? 
            Utils.formatDateToString(Utils.getToday()) : 
            this.elements.currentDateInput.value;
        
        return {
            birthDate: this.elements.birthDateInput.value,
            gestationalWeeks: parseInt(this.elements.gestationalWeeksInput.value),
            gestationalDays: parseInt(this.elements.gestationalDaysInput.value),
            currentDate: currentDate
        };
    },

    /**
     * Display calculation results
     * @param {Object} results - Calculation results
     */
    displayResults(results) {
        // Show results section
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'block';
            Utils.scrollToElement(this.elements.resultsSection, 20);
        }
        
        // Display corrected age
        this.displayAgeResult(
            this.elements.resultElements.correctedAge,
            results.corrected,
            'corrected'
        );
        
        // Display postmenstrual age
        this.displayAgeResult(
            this.elements.resultElements.postmenstrualAge,
            results.postmenstrual,
            'postmenstrual'
        );
        
        // Display chronological age
        this.displayAgeResult(
            this.elements.resultElements.chronologicalAge,
            results.chronological,
            'chronological'
        );
        
        // Display additional information
        this.displayAdditionalInfo(results);
    },

    /**
     * Display individual age result
     * @param {Element} container - Container element
     * @param {Object} ageResult - Age result object
     * @param {string} type - Age type
     */
    displayAgeResult(container, ageResult, type) {
        if (!container) return;
        
        const primaryElement = container.querySelector('.primary-age');
        const secondaryElement = container.querySelector('.secondary-age');
        const termIndicator = container.querySelector('.term-indicator');
        
        if (primaryElement) {
            primaryElement.textContent = ageResult.primaryDisplay;
        }
        
        if (secondaryElement) {
            secondaryElement.textContent = ageResult.secondaryDisplay;
        }
        
        // Special handling for postmenstrual age term indicator
        if (type === 'postmenstrual' && termIndicator) {
            if (ageResult.isTermEquivalent) {
                termIndicator.textContent = 'Term Equivalent Reached';
                termIndicator.style.display = 'inline-block';
            } else {
                termIndicator.style.display = 'none';
            }
        }
        
        // Add negative age styling for corrected age
        if (type === 'corrected' && ageResult.totalDays < 0) {
            container.parentElement.classList.add('negative-age');
        } else {
            container.parentElement.classList.remove('negative-age');
        }
    },

    /**
     * Display additional information and insights
     * @param {Object} results - Calculation results
     */
    displayAdditionalInfo(results) {
        const container = this.elements.resultElements.additionalInfo;
        if (!container) return;
        
        const insights = results.insights;
        
        let html = `
            <div class="info-grid">
                <div class="info-item">
                    <h4>Developmental Stage</h4>
                    <p>${insights.developmentalStage}</p>
                </div>
                
                <div class="info-item">
                    <h4>Prematurity Level</h4>
                    <p>${insights.prematurityLevel}</p>
                </div>
                
                <div class="info-item">
                    <h4>Correction Relevance</h4>
                    <p>${insights.correctionRelevance}</p>
                </div>
                
                <div class="info-item">
                    <h4>Term Equivalent Date</h4>
                    <p>${Utils.formatDateToString(results.corrected.wouldReachTermAt)}</p>
                </div>
            </div>
        `;
        
        // Add milestone guidance
        html += `
            <div class="milestone-guidance">
                <h4>Milestone Guidance</h4>
                <p>${insights.milestoneGuidance}</p>
            </div>
        `;
        
        // Add recommendations
        if (insights.recommendations.length > 0) {
            html += '<div class="recommendations"><h4>Recommendations</h4><ul>';
            insights.recommendations.forEach(rec => {
                html += `<li>${rec}</li>`;
            });
            html += '</ul></div>';
        }
        
        container.innerHTML = html;
    },

    /**
     * Handle validation for birth date
     */
    validateBirthDate() {
        const value = this.elements.birthDateInput.value;
        const result = Validation.validateBirthDate(value);
        
        this.displayFieldValidation('birthDate', result);
    },

    /**
     * Handle validation for gestational age
     */
    validateGestationalAge() {
        const weeks = this.elements.gestationalWeeksInput.value;
        const days = this.elements.gestationalDaysInput.value;
        const result = Validation.validateGestationalAge(weeks, days);
        
        this.displayFieldValidation('gestational', result);
    },

    /**
     * Handle validation for current date
     */
    validateCurrentDate() {
        const value = this.elements.currentDateInput.value;
        const birthDate = Utils.parseDate(this.elements.birthDateInput.value);
        const result = Validation.validateCurrentDate(value, birthDate);
        
        this.displayFieldValidation('currentDate', result);
    },

    /**
     * Display field validation results
     * @param {string} fieldName - Field name
     * @param {Object} result - Validation result
     */
    displayFieldValidation(fieldName, result) {
        const errorElement = this.elements.errorElements[fieldName];
        const inputElement = this.getInputElement(fieldName);
        
        if (!errorElement || !inputElement) return;
        
        if (!result.isValid) {
            // Show error
            errorElement.textContent = result.error;
            errorElement.classList.add('show');
            inputElement.classList.add('error');
            this.state.validationErrors[fieldName] = result.error;
        } else {
            // Clear error
            errorElement.classList.remove('show');
            inputElement.classList.remove('error');
            delete this.state.validationErrors[fieldName];
            
            // Show warning if any
            if (result.warning) {
                this.displayWarning(result.warning);
            }
        }
    },

    /**
     * Get input element by field name
     * @param {string} fieldName - Field name
     * @returns {Element} - Input element
     */
    getInputElement(fieldName) {
        switch (fieldName) {
            case 'birthDate':
                return this.elements.birthDateInput;
            case 'gestational':
                return this.elements.gestationalWeeksInput;
            case 'currentDate':
                return this.elements.currentDateInput;
            default:
                return null;
        }
    },

    /**
     * Display validation errors
     * @param {Object} validation - Validation results
     */
    displayValidationErrors(validation) {
        if (validation.birthDate && !validation.birthDate.isValid) {
            this.displayFieldValidation('birthDate', validation.birthDate);
        }
        
        if (validation.gestationalAge && !validation.gestationalAge.isValid) {
            this.displayFieldValidation('gestational', validation.gestationalAge);
        }
        
        if (validation.currentDate && !validation.currentDate.isValid) {
            this.displayFieldValidation('currentDate', validation.currentDate);
        }
    },

    /**
     * Display warnings
     * @param {Array} warnings - Array of warning messages
     */
    displayWarnings(warnings) {
        warnings.forEach(warning => {
            this.displayWarning(warning);
        });
    },

    /**
     * Display a single warning message
     * @param {string} message - Warning message
     */
    displayWarning(message) {
        // Create temporary warning element
        const warningElement = document.createElement('div');
        warningElement.className = 'warning-message';
        warningElement.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span>${message}</span>
        `;
        
        // Insert after form
        this.elements.form.parentNode.insertBefore(warningElement, this.elements.resultsSection);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (warningElement.parentNode) {
                warningElement.parentNode.removeChild(warningElement);
            }
        }, 5000);
    },

    /**
     * Clear all error messages
     */
    clearAllErrors() {
        Object.values(this.elements.errorElements).forEach(element => {
            if (element) {
                element.classList.remove('show');
            }
        });
        
        // Remove error styling from inputs
        [this.elements.birthDateInput, this.elements.gestationalWeeksInput, 
         this.elements.gestationalDaysInput, this.elements.currentDateInput].forEach(input => {
            if (input) {
                input.classList.remove('error');
            }
        });
        
        // Clear validation errors state
        this.state.validationErrors = {};
        
        // Remove any warning messages
        document.querySelectorAll('.warning-message').forEach(el => el.remove());
    },

    /**
     * Handle date option change
     */
    handleDateOptionChange() {
        const selectedOption = document.querySelector('input[name="dateOption"]:checked')?.value;
        
        if (selectedOption === 'today') {
            this.elements.currentDateInput.disabled = true;
            this.elements.currentDateInput.value = Utils.formatDateToString(Utils.getToday());
        } else {
            this.elements.currentDateInput.disabled = false;
            if (!this.elements.currentDateInput.value) {
                this.elements.currentDateInput.value = Utils.formatDateToString(Utils.getToday());
            }
        }
    },

    /**
     * Handle clear button click
     */
    handleClear() {
        // Reset form
        this.elements.form.reset();
        
        // Clear results
        if (this.elements.resultsSection) {
            this.elements.resultsSection.style.display = 'none';
        }
        
        // Clear errors
        this.clearAllErrors();
        
        // Reset state
        this.state.lastCalculation = null;
        this.state.currentInputs = {};
        
        // Set defaults
        this.setDefaultValues();
        this.handleDateOptionChange();
        
        // Focus on first input
        if (this.elements.birthDateInput) {
            this.elements.birthDateInput.focus();
        }
        
        this.announceToScreenReader('Form cleared');
    },

    /**
     * Handle print button click
     */
    handlePrint() {
        if (!this.state.lastCalculation) {
            this.displayError('No calculation results to print');
            return;
        }
        
        // Add print-specific content to page
        this.preparePrintContent();
        
        // Trigger print
        window.print();
        
        this.announceToScreenReader('Print dialog opened');
    },

    /**
     * Prepare content for printing
     */
    preparePrintContent() {
        // Add calculation date to results
        const printInfo = document.createElement('div');
        printInfo.className = 'print-info';
        printInfo.innerHTML = `
            <p><strong>Calculation Date:</strong> ${Utils.formatDateToString(new Date())}</p>
            <p><strong>Birth Date:</strong> ${Utils.formatDateToString(this.state.lastCalculation.birthDate)}</p>
            <p><strong>Gestational Age:</strong> ${this.state.lastCalculation.gestationalAge.weeks} weeks ${this.state.lastCalculation.gestationalAge.days} days</p>
        `;
        
        if (this.elements.resultsSection) {
            this.elements.resultsSection.insertBefore(printInfo, this.elements.resultsSection.firstChild);
        }
    },

    /**
     * Toggle help panel
     */
    toggleHelp() {
        this.state.helpVisible = !this.state.helpVisible;
        
        if (this.elements.helpPanel) {
            if (this.state.helpVisible) {
                this.elements.helpPanel.classList.add('show');
                this.elements.helpPanel.setAttribute('aria-hidden', 'false');
                this.elements.helpToggle.setAttribute('aria-expanded', 'true');
            } else {
                this.elements.helpPanel.classList.remove('show');
                this.elements.helpPanel.setAttribute('aria-hidden', 'true');
                this.elements.helpToggle.setAttribute('aria-expanded', 'false');
            }
        }
        
        this.announceToScreenReader(this.state.helpVisible ? 'Help panel opened' : 'Help panel closed');
    },

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardShortcuts(event) {
        // Enter key submits form when focused on any input
        if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
            if (!this.state.isCalculating) {
                this.handleFormSubmit(event);
            }
        }
        
        // Escape key closes help panel
        if (event.key === 'Escape' && this.state.helpVisible) {
            this.toggleHelp();
        }
        
        // Ctrl/Cmd + P for print
        if ((event.ctrlKey || event.metaKey) && event.key === 'p' && this.state.lastCalculation) {
            event.preventDefault();
            this.handlePrint();
        }
    },

    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'flex';
            this.elements.loadingOverlay.setAttribute('aria-hidden', 'false');
        }
        
        if (this.elements.calculateBtn) {
            this.elements.calculateBtn.disabled = true;
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
            this.elements.loadingOverlay.setAttribute('aria-hidden', 'true');
        }
        
        if (this.elements.calculateBtn) {
            this.elements.calculateBtn.disabled = false;
        }
    },

    /**
     * Display error message
     * @param {string} message - Error message
     */
    displayError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <span class="error-icon">❌</span>
            <span>${message}</span>
        `;
        
        this.elements.form.parentNode.insertBefore(errorElement, this.elements.resultsSection);
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    },

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
};

// Make UIController available globally
if (typeof window !== 'undefined') {
    window.UIController = UIController;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
}
