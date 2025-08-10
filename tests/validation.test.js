/**
 * Unit tests for the Validation module
 * Tests input validation logic and error handling
 */

// Simple test runner for validation tests
class ValidationTestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    run() {
        console.log('🔍 Running Validation Tests...\n');
        
        this.tests.forEach(test => {
            try {
                test.fn();
                this.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}\n`);
            }
        });
        
        console.log(`\n📊 Validation Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
    
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
        }
    }
    
    assertTrue(actual, message = '') {
        if (!actual) {
            throw new Error(`${message}\nExpected: true\nActual: ${actual}`);
        }
    }
    
    assertFalse(actual, message = '') {
        if (actual) {
            throw new Error(`${message}\nExpected: false\nActual: ${actual}`);
        }
    }
}

const validationRunner = new ValidationTestRunner();

// Test birth date validation
validationRunner.test('validateBirthDate - valid date', () => {
    const result = Validation.validateBirthDate('2024-01-15');
    validationRunner.assertTrue(result.isValid, 'Valid date should pass validation');
    validationRunner.assertEqual(result.error, '', 'Valid date should have no error');
});

validationRunner.test('validateBirthDate - empty date', () => {
    const result = Validation.validateBirthDate('');
    validationRunner.assertFalse(result.isValid, 'Empty date should fail validation');
    validationRunner.assertTrue(result.error.includes('required'), 'Should indicate field is required');
});

validationRunner.test('validateBirthDate - invalid format', () => {
    const result = Validation.validateBirthDate('invalid-date');
    validationRunner.assertFalse(result.isValid, 'Invalid format should fail validation');
    validationRunner.assertTrue(result.error.includes('valid date'), 'Should indicate invalid format');
});

validationRunner.test('validateBirthDate - future date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const result = Validation.validateBirthDate(tomorrowString);
    validationRunner.assertFalse(result.isValid, 'Future date should fail validation');
    validationRunner.assertTrue(result.error.includes('future'), 'Should indicate future date error');
});

validationRunner.test('validateBirthDate - very old date warning', () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 6);
    const oldDateString = oldDate.toISOString().split('T')[0];
    
    const result = Validation.validateBirthDate(oldDateString);
    validationRunner.assertTrue(result.isValid, 'Old date should be valid');
    validationRunner.assertTrue(result.warning.includes('5 years'), 'Should warn about old date');
});

// Test gestational age validation
validationRunner.test('validateGestationalAge - valid preterm', () => {
    const result = Validation.validateGestationalAge(32, 4);
    validationRunner.assertTrue(result.isValid, 'Valid preterm age should pass');
    validationRunner.assertEqual(result.error, '', 'Valid age should have no error');
    validationRunner.assertEqual(result.value.weeks, 32, 'Should return correct weeks');
    validationRunner.assertEqual(result.value.days, 4, 'Should return correct days');
});

validationRunner.test('validateGestationalAge - valid term', () => {
    const result = Validation.validateGestationalAge(40, 0);
    validationRunner.assertTrue(result.isValid, 'Valid term age should pass');
    validationRunner.assertEqual(result.value.totalDays, 280, 'Should calculate total days correctly');
});

validationRunner.test('validateGestationalAge - too early', () => {
    const result = Validation.validateGestationalAge(19, 0);
    validationRunner.assertFalse(result.isValid, 'Too early should fail');
    validationRunner.assertTrue(result.error.includes('20 weeks'), 'Should indicate minimum weeks');
});

validationRunner.test('validateGestationalAge - too late', () => {
    const result = Validation.validateGestationalAge(45, 0);
    validationRunner.assertFalse(result.isValid, 'Too late should fail');
    validationRunner.assertTrue(result.error.includes('44 weeks'), 'Should indicate maximum weeks');
});

validationRunner.test('validateGestationalAge - invalid days', () => {
    const result = Validation.validateGestationalAge(32, 7);
    validationRunner.assertFalse(result.isValid, 'Invalid days should fail');
    validationRunner.assertTrue(result.error.includes('0 and 6'), 'Should indicate valid day range');
});

validationRunner.test('validateGestationalAge - very preterm warning', () => {
    const result = Validation.validateGestationalAge(23, 0);
    validationRunner.assertTrue(result.isValid, 'Very preterm should be valid');
    validationRunner.assertTrue(result.warning.includes('Very preterm'), 'Should warn about very preterm');
});

validationRunner.test('validateGestationalAge - extremely preterm warning', () => {
    const result = Validation.validateGestationalAge(26, 0);
    validationRunner.assertTrue(result.isValid, 'Extremely preterm should be valid');
    validationRunner.assertTrue(result.warning.includes('Extremely preterm'), 'Should warn about extremely preterm');
});

validationRunner.test('validateGestationalAge - post-term warning', () => {
    const result = Validation.validateGestationalAge(42, 0);
    validationRunner.assertTrue(result.isValid, 'Post-term should be valid');
    validationRunner.assertTrue(result.warning.includes('Post-term'), 'Should warn about post-term');
});

validationRunner.test('validateGestationalAge - invalid input types', () => {
    const result1 = Validation.validateGestationalAge('invalid', 4);
    validationRunner.assertFalse(result1.isValid, 'Non-numeric weeks should fail');
    
    const result2 = Validation.validateGestationalAge(32, 'invalid');
    validationRunner.assertFalse(result2.isValid, 'Non-numeric days should fail');
});

// Test current date validation
validationRunner.test('validateCurrentDate - valid date', () => {
    const birthDate = new Date('2024-01-15');
    const result = Validation.validateCurrentDate('2024-02-15', birthDate);
    validationRunner.assertTrue(result.isValid, 'Valid current date should pass');
});

validationRunner.test('validateCurrentDate - empty date defaults to today', () => {
    const result = Validation.validateCurrentDate('', null);
    validationRunner.assertTrue(result.isValid, 'Empty date should default to today');
    validationRunner.assertEqual(typeof result.value, 'object', 'Should return Date object');
});

validationRunner.test('validateCurrentDate - before birth date', () => {
    const birthDate = new Date('2024-01-15');
    const result = Validation.validateCurrentDate('2024-01-10', birthDate);
    validationRunner.assertFalse(result.isValid, 'Date before birth should fail');
    validationRunner.assertTrue(result.error.includes('before birth'), 'Should indicate before birth error');
});

validationRunner.test('validateCurrentDate - far future warning', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    const result = Validation.validateCurrentDate(futureDateString, new Date('2024-01-15'));
    validationRunner.assertFalse(result.isValid, 'Far future should fail');
    validationRunner.assertTrue(result.error.includes('one year'), 'Should indicate future limit');
});

validationRunner.test('validateCurrentDate - near future warning', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const result = Validation.validateCurrentDate(tomorrowString, new Date('2024-01-15'));
    validationRunner.assertTrue(result.isValid, 'Near future should be valid');
    validationRunner.assertTrue(result.warning.includes('future'), 'Should warn about future calculation');
});

// Test comprehensive validation
validationRunner.test('validateAllInputs - all valid', () => {
    const result = Validation.validateAllInputs('2024-01-15', 32, 4, '2024-02-15');
    validationRunner.assertTrue(result.isValid, 'All valid inputs should pass');
    validationRunner.assertEqual(result.errors.length, 0, 'Should have no errors');
});

validationRunner.test('validateAllInputs - multiple errors', () => {
    const result = Validation.validateAllInputs('invalid-date', 19, 7, '2023-01-01');
    validationRunner.assertFalse(result.isValid, 'Invalid inputs should fail');
    validationRunner.assertTrue(result.errors.length > 1, 'Should have multiple errors');
});

validationRunner.test('validateAllInputs - warnings collected', () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 6);
    const oldDateString = oldDate.toISOString().split('T')[0];
    
    const result = Validation.validateAllInputs(oldDateString, 23, 0, '');
    validationRunner.assertTrue(result.isValid, 'Should be valid despite warnings');
    validationRunner.assertTrue(result.warnings.length > 0, 'Should collect warnings');
});

// Test cross-validation
validationRunner.test('Cross-validation - term infant warning', () => {
    const result = Validation.validateAllInputs('2024-01-15', 39, 0, '2024-01-20');
    validationRunner.assertTrue(result.isValid, 'Should be valid');
    validationRunner.assertTrue(result.warnings.some(w => w.includes('term')), 'Should warn about term infant');
});

// Test edge cases
validationRunner.test('Edge case - leap year date', () => {
    const result = Validation.validateBirthDate('2024-02-29');
    validationRunner.assertTrue(result.isValid, 'Leap year date should be valid');
});

validationRunner.test('Edge case - non-leap year February 29', () => {
    const result = Validation.validateBirthDate('2023-02-29');
    validationRunner.assertFalse(result.isValid, 'Non-leap year Feb 29 should be invalid');
});

validationRunner.test('Edge case - boundary gestational ages', () => {
    const result1 = Validation.validateGestationalAge(20, 0);
    validationRunner.assertTrue(result1.isValid, 'Minimum GA should be valid');
    
    const result2 = Validation.validateGestationalAge(44, 0);
    validationRunner.assertTrue(result2.isValid, 'Maximum GA should be valid');
});

// Test numeric validation helper
validationRunner.test('validateNumericInput - valid number', () => {
    const result = Validation.validateNumericInput('25', 20, 44);
    validationRunner.assertTrue(result.isValid, 'Valid number should pass');
    validationRunner.assertEqual(result.value, 25, 'Should parse number correctly');
});

validationRunner.test('validateNumericInput - out of range', () => {
    const result1 = Validation.validateNumericInput('19', 20, 44);
    validationRunner.assertFalse(result1.isValid, 'Below minimum should fail');
    
    const result2 = Validation.validateNumericInput('45', 20, 44);
    validationRunner.assertFalse(result2.isValid, 'Above maximum should fail');
});

validationRunner.test('validateNumericInput - non-numeric', () => {
    const result = Validation.validateNumericInput('abc', 20, 44);
    validationRunner.assertFalse(result.isValid, 'Non-numeric should fail');
    validationRunner.assertTrue(result.error.includes('valid number'), 'Should indicate number error');
});

// Test error message formatting
validationRunner.test('formatErrorMessage - formatted output', () => {
    const message = Validation.formatErrorMessage('birthDate', 'Test error');
    validationRunner.assertTrue(message.includes('Birth Date'), 'Should include field name');
    validationRunner.assertTrue(message.includes('Test error'), 'Should include error message');
});

validationRunner.test('formatWarningMessage - formatted output', () => {
    const message = Validation.formatWarningMessage('Test warning');
    validationRunner.assertTrue(message.includes('⚠️'), 'Should include warning icon');
    validationRunner.assertTrue(message.includes('Test warning'), 'Should include warning text');
});

// Test date format validation
validationRunner.test('isValidDateFormat - correct format', () => {
    validationRunner.assertTrue(Validation.isValidDateFormat('2024-01-15'), 'YYYY-MM-DD should be valid');
});

validationRunner.test('isValidDateFormat - incorrect formats', () => {
    validationRunner.assertFalse(Validation.isValidDateFormat('01/15/2024'), 'MM/DD/YYYY should be invalid');
    validationRunner.assertFalse(Validation.isValidDateFormat('2024-1-15'), 'Single digit month should be invalid');
    validationRunner.assertFalse(Validation.isValidDateFormat('24-01-15'), 'Two digit year should be invalid');
});

// Test range validation
validationRunner.test('isInRange - valid ranges', () => {
    validationRunner.assertTrue(Validation.isInRange(25, 20, 44), 'Middle value should be in range');
    validationRunner.assertTrue(Validation.isInRange(20, 20, 44), 'Minimum value should be in range');
    validationRunner.assertTrue(Validation.isInRange(44, 20, 44), 'Maximum value should be in range');
});

validationRunner.test('isInRange - invalid ranges', () => {
    validationRunner.assertFalse(Validation.isInRange(19, 20, 44), 'Below minimum should be out of range');
    validationRunner.assertFalse(Validation.isInRange(45, 20, 44), 'Above maximum should be out of range');
    validationRunner.assertFalse(Validation.isInRange(NaN, 20, 44), 'NaN should be out of range');
});

// Run validation tests
if (typeof window !== 'undefined') {
    // Browser environment
    window.runValidationTests = () => validationRunner.run();
    console.log('Validation tests loaded. Run window.runValidationTests() to execute.');
} else {
    // Node.js environment
    const success = validationRunner.run();
    process.exit(success ? 0 : 1);
}
