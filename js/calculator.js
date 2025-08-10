/**
 * Core calculation engine for the Corrected Age Calculator
 * Implements medical formulas for corrected age and postmenstrual age calculations
 */

const AgeCalculator = {
    /**
     * Age result structure
     * @typedef {Object} AgeResult
     * @property {number} totalDays - Total age in days
     * @property {number} weeks - Age in weeks (for week+day format)
     * @property {number} days - Remaining days after weeks
     * @property {number} months - Age in months (for month+day format)
     * @property {number} years - Age in years (for year+month format)
     * @property {string} primaryDisplay - Primary formatted display string
     * @property {string} secondaryDisplay - Secondary formatted display string
     */

    /**
     * Calculate chronological age (actual time since birth)
     * @param {Date} birthDate - Date of birth
     * @param {Date} currentDate - Current date for calculation
     * @returns {AgeResult} - Chronological age result
     */
    calculateChronologicalAge(birthDate, currentDate) {
        if (!(birthDate instanceof Date) || !(currentDate instanceof Date)) {
            throw new Error('Birth date and current date must be valid Date objects');
        }

        const totalDays = Utils.daysBetween(birthDate, currentDate);
        const age = this.formatAgeResult(totalDays);
        
        return {
            ...age,
            type: 'chronological',
            description: 'Actual time elapsed since birth'
        };
    },

    /**
     * Calculate corrected age (adjusted for prematurity)
     * Formula: Corrected Age = Chronological Age - (40 weeks - Gestational Age at Birth)
     * @param {Date} birthDate - Date of birth
     * @param {Object} gestationalAge - Gestational age at birth {weeks, days, totalDays}
     * @param {Date} currentDate - Current date for calculation
     * @returns {AgeResult} - Corrected age result
     */
    calculateCorrectedAge(birthDate, gestationalAge, currentDate) {
        if (!(birthDate instanceof Date) || !(currentDate instanceof Date)) {
            throw new Error('Birth date and current date must be valid Date objects');
        }

        if (!gestationalAge || typeof gestationalAge.totalDays !== 'number') {
            throw new Error('Gestational age must be a valid object with totalDays property');
        }

        // Calculate chronological age
        const chronologicalDays = Utils.daysBetween(birthDate, currentDate);
        
        // Calculate prematurity offset
        const fullTermDays = 40 * 7; // 40 weeks = 280 days
        const prematurityOffset = fullTermDays - gestationalAge.totalDays;
        
        // Calculate corrected age
        const correctedDays = chronologicalDays - prematurityOffset;
        const age = this.formatAgeResult(correctedDays);
        
        return {
            ...age,
            type: 'corrected',
            description: 'Age adjusted for prematurity (if born at full term)',
            prematurityOffset,
            isNegative: correctedDays < 0,
            wouldReachTermAt: this.calculateTermEquivalentDate(birthDate, gestationalAge)
        };
    },

    /**
     * Calculate postmenstrual age (gestational age + chronological age)
     * Formula: PMA = Gestational Age at Birth + Chronological Age
     * @param {Date} birthDate - Date of birth
     * @param {Object} gestationalAge - Gestational age at birth {weeks, days, totalDays}
     * @param {Date} currentDate - Current date for calculation
     * @returns {AgeResult} - Postmenstrual age result
     */
    calculatePostmenstrualAge(birthDate, gestationalAge, currentDate) {
        if (!(birthDate instanceof Date) || !(currentDate instanceof Date)) {
            throw new Error('Birth date and current date must be valid Date objects');
        }

        if (!gestationalAge || typeof gestationalAge.totalDays !== 'number') {
            throw new Error('Gestational age must be a valid object with totalDays property');
        }

        // Calculate chronological age
        const chronologicalDays = Utils.daysBetween(birthDate, currentDate);
        
        // Calculate postmenstrual age
        const pmaDays = gestationalAge.totalDays + chronologicalDays;
        const age = this.formatAgeResult(pmaDays);
        
        // Determine if term equivalent has been reached
        const fullTermDays = 40 * 7; // 280 days
        const isTermEquivalent = pmaDays >= fullTermDays;
        const daysToTerm = isTermEquivalent ? 0 : fullTermDays - pmaDays;
        
        return {
            ...age,
            type: 'postmenstrual',
            description: 'Total time since onset of last menstrual period',
            isTermEquivalent,
            daysToTerm,
            termDate: this.calculateTermEquivalentDate(birthDate, gestationalAge)
        };
    },

    /**
     * Calculate all age types at once
     * @param {Date} birthDate - Date of birth
     * @param {Object} gestationalAge - Gestational age at birth
     * @param {Date} currentDate - Current date for calculation
     * @returns {Object} - All calculated ages
     */
    calculateAllAges(birthDate, gestationalAge, currentDate) {
        try {
            const chronological = this.calculateChronologicalAge(birthDate, currentDate);
            const corrected = this.calculateCorrectedAge(birthDate, gestationalAge, currentDate);
            const postmenstrual = this.calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
            
            // Calculate additional insights
            const insights = this.generateInsights(chronological, corrected, postmenstrual, gestationalAge);
            
            return {
                chronological,
                corrected,
                postmenstrual,
                insights,
                calculationDate: new Date(currentDate),
                birthDate: new Date(birthDate),
                gestationalAge: { ...gestationalAge }
            };
        } catch (error) {
            throw new Error(`Calculation failed: ${error.message}`);
        }
    },

    /**
     * Format age result into multiple display formats
     * @param {number} totalDays - Total age in days
     * @returns {AgeResult} - Formatted age result
     */
    formatAgeResult(totalDays) {
        const weeksData = Utils.daysToWeeksAndDays(totalDays);
        const monthsData = Utils.daysToMonthsAndDays(totalDays);
        const yearsData = Utils.daysToYearsMonthsDays(totalDays);
        
        // Determine primary display format based on age
        let primaryDisplay, secondaryDisplay;
        
        if (Math.abs(totalDays) < 7) {
            // Less than a week - show days
            primaryDisplay = `${Math.abs(totalDays)} ${Math.abs(totalDays) === 1 ? 'day' : 'days'}`;
            secondaryDisplay = '';
        } else if (Math.abs(totalDays) < 365) {
            // Less than a year - show weeks and days
            primaryDisplay = `${Math.abs(weeksData.weeks)} ${Math.abs(weeksData.weeks) === 1 ? 'week' : 'weeks'} ${Math.abs(weeksData.days)} ${Math.abs(weeksData.days) === 1 ? 'day' : 'days'}`;
            
            // Show months as secondary if over 8 weeks
            if (Math.abs(totalDays) > 56) {
                secondaryDisplay = `(${Math.abs(monthsData.months)} ${Math.abs(monthsData.months) === 1 ? 'month' : 'months'} ${Math.abs(monthsData.days)} ${Math.abs(monthsData.days) === 1 ? 'day' : 'days'})`;
            } else {
                secondaryDisplay = '';
            }
        } else {
            // Over a year - show years and months
            primaryDisplay = `${Math.abs(yearsData.years)} ${Math.abs(yearsData.years) === 1 ? 'year' : 'years'} ${Math.abs(yearsData.months)} ${Math.abs(yearsData.months) === 1 ? 'month' : 'months'}`;
            secondaryDisplay = `(${Math.abs(weeksData.weeks)} weeks)`;
        }
        
        // Add negative prefix if needed
        if (totalDays < 0) {
            primaryDisplay = '−' + primaryDisplay; // Using minus sign, not hyphen
        }
        
        return {
            totalDays,
            weeks: weeksData.weeks,
            days: weeksData.days,
            months: monthsData.months,
            years: yearsData.years,
            primaryDisplay,
            secondaryDisplay
        };
    },

    /**
     * Calculate when term equivalent will be/was reached
     * @param {Date} birthDate - Date of birth
     * @param {Object} gestationalAge - Gestational age at birth
     * @returns {Date} - Date when term equivalent (40 weeks PMA) is reached
     */
    calculateTermEquivalentDate(birthDate, gestationalAge) {
        const fullTermDays = 40 * 7; // 280 days
        const daysToTerm = fullTermDays - gestationalAge.totalDays;
        
        const termDate = new Date(birthDate);
        termDate.setDate(termDate.getDate() + daysToTerm);
        
        return termDate;
    },

    /**
     * Generate insights and additional information about the calculations
     * @param {AgeResult} chronological - Chronological age result
     * @param {AgeResult} corrected - Corrected age result
     * @param {AgeResult} postmenstrual - Postmenstrual age result
     * @param {Object} gestationalAge - Gestational age at birth
     * @returns {Object} - Insights and additional information
     */
    generateInsights(chronological, corrected, postmenstrual, gestationalAge) {
        const insights = {
            developmentalStage: this.getDevelopmentalStage(corrected.totalDays),
            prematurityLevel: this.getPrematurityLevel(gestationalAge.weeks),
            correctionRelevance: this.getCorrectionRelevance(chronological.totalDays, gestationalAge.weeks),
            milestoneGuidance: this.getMilestoneGuidance(corrected.totalDays, gestationalAge.weeks),
            termStatus: this.getTermStatus(postmenstrual),
            recommendations: []
        };
        
        // Generate recommendations based on the insights
        insights.recommendations = this.generateRecommendations(insights, chronological, corrected, gestationalAge);
        
        return insights;
    },

    /**
     * Determine developmental stage based on corrected age
     * @param {number} correctedDays - Corrected age in days
     * @returns {string} - Developmental stage description
     */
    getDevelopmentalStage(correctedDays) {
        if (correctedDays < 0) {
            return 'Pre-term equivalent (before due date)';
        } else if (correctedDays < 28) {
            return 'Newborn (0-4 weeks corrected)';
        } else if (correctedDays < 84) {
            return 'Young infant (1-3 months corrected)';
        } else if (correctedDays < 180) {
            return 'Older infant (3-6 months corrected)';
        } else if (correctedDays < 365) {
            return 'Mobile infant (6-12 months corrected)';
        } else if (correctedDays < 730) {
            return 'Toddler (1-2 years corrected)';
        } else {
            return 'Preschooler (2+ years corrected)';
        }
    },

    /**
     * Determine level of prematurity
     * @param {number} gestationalWeeks - Gestational age in weeks
     * @returns {string} - Prematurity level description
     */
    getPrematurityLevel(gestationalWeeks) {
        if (gestationalWeeks < 24) {
            return 'Periviable (extremely high risk)';
        } else if (gestationalWeeks < 28) {
            return 'Extremely preterm';
        } else if (gestationalWeeks < 32) {
            return 'Very preterm';
        } else if (gestationalWeeks < 34) {
            return 'Moderate preterm';
        } else if (gestationalWeeks < 37) {
            return 'Late preterm';
        } else if (gestationalWeeks <= 42) {
            return 'Term';
        } else {
            return 'Post-term';
        }
    },

    /**
     * Determine relevance of age correction
     * @param {number} chronologicalDays - Chronological age in days
     * @param {number} gestationalWeeks - Gestational age in weeks
     * @returns {string} - Correction relevance description
     */
    getCorrectionRelevance(chronologicalDays, gestationalWeeks) {
        if (gestationalWeeks >= 37) {
            return 'Limited relevance (born at term)';
        } else if (chronologicalDays > (2 * 365)) {
            return 'Decreasing relevance (consider chronological age)';
        } else if (gestationalWeeks < 32) {
            return 'Highly relevant for development assessment';
        } else {
            return 'Moderately relevant for early development';
        }
    },

    /**
     * Get milestone guidance based on corrected age
     * @param {number} correctedDays - Corrected age in days
     * @param {number} gestationalWeeks - Gestational age in weeks
     * @returns {string} - Milestone guidance
     */
    getMilestoneGuidance(correctedDays, gestationalWeeks) {
        if (correctedDays < 0) {
            return 'Focus on basic physiological stability and growth';
        } else if (correctedDays < 84) {
            return 'Use corrected age for all developmental milestones';
        } else if (correctedDays < 730) {
            if (gestationalWeeks < 32) {
                return 'Use corrected age, but consider individual development patterns';
            } else {
                return 'Use corrected age for major milestones, chronological for social development';
            }
        } else {
            return 'Transition to using chronological age for most assessments';
        }
    },

    /**
     * Get term status information
     * @param {AgeResult} postmenstrual - Postmenstrual age result
     * @returns {Object} - Term status information
     */
    getTermStatus(postmenstrual) {
        const fullTermDays = 40 * 7;
        
        if (postmenstrual.totalDays < fullTermDays) {
            const weeksToTerm = Math.floor((fullTermDays - postmenstrual.totalDays) / 7);
            const daysToTerm = (fullTermDays - postmenstrual.totalDays) % 7;
            return {
                status: 'pre-term',
                description: `${weeksToTerm} weeks ${daysToTerm} days until term equivalent`,
                timeToTerm: fullTermDays - postmenstrual.totalDays
            };
        } else {
            const weeksSinceTerm = Math.floor((postmenstrual.totalDays - fullTermDays) / 7);
            const daysSinceTerm = (postmenstrual.totalDays - fullTermDays) % 7;
            return {
                status: 'term-equivalent',
                description: `${weeksSinceTerm} weeks ${daysSinceTerm} days since term equivalent`,
                timeSinceTerm: postmenstrual.totalDays - fullTermDays
            };
        }
    },

    /**
     * Generate recommendations based on all insights
     * @param {Object} insights - Generated insights
     * @param {AgeResult} chronological - Chronological age
     * @param {AgeResult} corrected - Corrected age
     * @param {Object} gestationalAge - Gestational age
     * @returns {Array} - Array of recommendation strings
     */
    generateRecommendations(insights, chronological, corrected, gestationalAge) {
        const recommendations = [];
        
        // Age-based recommendations
        if (chronological.totalDays > (3 * 365)) {
            recommendations.push('Consider transitioning to chronological age for developmental assessments as corrected age becomes less relevant after 2-3 years.');
        }
        
        // Prematurity-based recommendations
        if (gestationalAge.weeks < 28) {
            recommendations.push('Extremely preterm infants may show different developmental patterns. Consider neurodevelopmental follow-up.');
        }
        
        // Corrected age specific recommendations
        if (corrected.totalDays < 0) {
            recommendations.push('Negative corrected age indicates the infant has not yet reached their original due date. Focus on basic physiological development.');
        }
        
        // Development guidance
        if (corrected.totalDays >= 0 && corrected.totalDays < 365) {
            recommendations.push('Use corrected age for developmental milestone assessments during the first year.');
        }
        
        // Medical follow-up recommendations
        if (gestationalAge.weeks < 32 && chronological.totalDays < 365) {
            recommendations.push('Regular pediatric and developmental follow-up recommended for very preterm infants.');
        }
        
        return recommendations;
    },

    /**
     * Validate calculation inputs before processing
     * @param {Date} birthDate - Birth date
     * @param {Object} gestationalAge - Gestational age
     * @param {Date} currentDate - Current date
     * @returns {boolean} - True if inputs are valid for calculation
     */
    validateCalculationInputs(birthDate, gestationalAge, currentDate) {
        if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
            return false;
        }
        
        if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
            return false;
        }
        
        if (!gestationalAge || 
            typeof gestationalAge.weeks !== 'number' || 
            typeof gestationalAge.days !== 'number' ||
            typeof gestationalAge.totalDays !== 'number') {
            return false;
        }
        
        if (gestationalAge.weeks < 20 || gestationalAge.weeks > 44) {
            return false;
        }
        
        if (gestationalAge.days < 0 || gestationalAge.days > 6) {
            return false;
        }
        
        if (currentDate < birthDate) {
            return false;
        }
        
        return true;
    }
};

// Make AgeCalculator available globally
if (typeof window !== 'undefined') {
    window.AgeCalculator = AgeCalculator;
}

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeCalculator;
}
