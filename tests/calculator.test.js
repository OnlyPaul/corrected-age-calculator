/**
 * Unit tests for the AgeCalculator module
 * Tests core calculation logic for medical accuracy
 */

// Mock the Utils module for testing
const Utils = {
    daysBetween: (date1, date2) => {
        const timeDiff = date2.getTime() - date1.getTime();
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    },
    
    daysToWeeksAndDays: (totalDays) => {
        const weeks = Math.floor(Math.abs(totalDays) / 7);
        const days = Math.abs(totalDays) % 7;
        return {
            weeks: totalDays < 0 ? -weeks : weeks,
            days: totalDays < 0 && days > 0 ? -days : days,
            totalDays: totalDays
        };
    },
    
    formatDateToString: (date) => {
        return date.toISOString().split('T')[0];
    }
};

// Test data sets
const testCases = [
    {
        name: 'Full term infant at 4 weeks old',
        birthDate: new Date('2024-01-15'),
        gestationalAge: { weeks: 40, days: 0, totalDays: 280 },
        currentDate: new Date('2024-02-12'), // 28 days later
        expected: {
            chronological: { totalDays: 28, weeks: 4, days: 0 },
            corrected: { totalDays: 28, weeks: 4, days: 0 },
            postmenstrual: { totalDays: 308, weeks: 44, days: 0 }
        }
    },
    {
        name: 'Very preterm infant (28 weeks) at 8 weeks old',
        birthDate: new Date('2024-01-15'),
        gestationalAge: { weeks: 28, days: 0, totalDays: 196 },
        currentDate: new Date('2024-03-11'), // 56 days later
        expected: {
            chronological: { totalDays: 56, weeks: 8, days: 0 },
            corrected: { totalDays: -28, weeks: -4, days: 0 }, // 56 - (280 - 196)
            postmenstrual: { totalDays: 252, weeks: 36, days: 0 } // 196 + 56
        }
    },
    {
        name: 'Moderate preterm infant (32 weeks + 4 days) at 6 weeks old',
        birthDate: new Date('2024-01-15'),
        gestationalAge: { weeks: 32, days: 4, totalDays: 228 },
        currentDate: new Date('2024-02-26'), // 42 days later
        expected: {
            chronological: { totalDays: 42, weeks: 6, days: 0 },
            corrected: { totalDays: -10, weeks: -1, days: -3 }, // 42 - (280 - 228)
            postmenstrual: { totalDays: 270, weeks: 38, days: 4 } // 228 + 42
        }
    },
    {
        name: 'Post-term infant (42 weeks) at 2 weeks old',
        birthDate: new Date('2024-01-15'),
        gestationalAge: { weeks: 42, days: 0, totalDays: 294 },
        currentDate: new Date('2024-01-29'), // 14 days later
        expected: {
            chronological: { totalDays: 14, weeks: 2, days: 0 },
            corrected: { totalDays: 28, weeks: 4, days: 0 }, // 14 - (280 - 294)
            postmenstrual: { totalDays: 308, weeks: 44, days: 0 } // 294 + 14
        }
    }
];

// Simple test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    run() {
        console.log('🧪 Running AgeCalculator Tests...\n');
        
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
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
    
    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
        }
    }
    
    assertApproxEqual(actual, expected, tolerance = 0, message = '') {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(`${message}\nExpected: ${expected} (±${tolerance})\nActual: ${actual}`);
        }
    }
}

// Initialize test runner
const runner = new TestRunner();

// Test chronological age calculations
runner.test('calculateChronologicalAge - same day birth', () => {
    const birthDate = new Date('2024-01-15');
    const currentDate = new Date('2024-01-15');
    
    const result = AgeCalculator.calculateChronologicalAge(birthDate, currentDate);
    
    runner.assertEqual(result.totalDays, 0, 'Same day should be 0 days');
    runner.assertEqual(result.weeks, 0, 'Same day should be 0 weeks');
    runner.assertEqual(result.days, 0, 'Same day should be 0 days remainder');
});

runner.test('calculateChronologicalAge - one week old', () => {
    const birthDate = new Date('2024-01-15');
    const currentDate = new Date('2024-01-22');
    
    const result = AgeCalculator.calculateChronologicalAge(birthDate, currentDate);
    
    runner.assertEqual(result.totalDays, 7, 'One week should be 7 days');
    runner.assertEqual(result.weeks, 1, 'One week should be 1 week');
    runner.assertEqual(result.days, 0, 'One week should be 0 days remainder');
});

runner.test('calculateChronologicalAge - leap year handling', () => {
    const birthDate = new Date('2024-02-28');
    const currentDate = new Date('2024-03-01');
    
    const result = AgeCalculator.calculateChronologicalAge(birthDate, currentDate);
    
    runner.assertEqual(result.totalDays, 2, '2024 leap year: Feb 28 to Mar 1 should be 2 days');
});

// Test corrected age calculations
runner.test('calculateCorrectedAge - full term infant', () => {
    const testCase = testCases[0];
    
    const result = AgeCalculator.calculateCorrectedAge(
        testCase.birthDate,
        testCase.gestationalAge,
        testCase.currentDate
    );
    
    runner.assertEqual(result.totalDays, testCase.expected.corrected.totalDays, 
        'Full term corrected age should equal chronological age');
});

runner.test('calculateCorrectedAge - very preterm infant', () => {
    const testCase = testCases[1];
    
    const result = AgeCalculator.calculateCorrectedAge(
        testCase.birthDate,
        testCase.gestationalAge,
        testCase.currentDate
    );
    
    runner.assertEqual(result.totalDays, testCase.expected.corrected.totalDays,
        'Very preterm corrected age should be negative');
    runner.assertEqual(result.isNegative, true, 'Should flag negative corrected age');
});

runner.test('calculateCorrectedAge - moderate preterm infant', () => {
    const testCase = testCases[2];
    
    const result = AgeCalculator.calculateCorrectedAge(
        testCase.birthDate,
        testCase.gestationalAge,
        testCase.currentDate
    );
    
    runner.assertEqual(result.totalDays, testCase.expected.corrected.totalDays,
        'Moderate preterm corrected age calculation');
});

runner.test('calculateCorrectedAge - post-term infant', () => {
    const testCase = testCases[3];
    
    const result = AgeCalculator.calculateCorrectedAge(
        testCase.birthDate,
        testCase.gestationalAge,
        testCase.currentDate
    );
    
    runner.assertEqual(result.totalDays, testCase.expected.corrected.totalDays,
        'Post-term corrected age should be older than chronological');
});

// Test postmenstrual age calculations
runner.test('calculatePostmenstrualAge - preterm infant', () => {
    const testCase = testCases[1];
    
    const result = AgeCalculator.calculatePostmenstrualAge(
        testCase.birthDate,
        testCase.gestationalAge,
        testCase.currentDate
    );
    
    runner.assertEqual(result.totalDays, testCase.expected.postmenstrual.totalDays,
        'PMA should be gestational age + chronological age');
    runner.assertEqual(result.isTermEquivalent, false, 'Should not be term equivalent yet');
});

runner.test('calculatePostmenstrualAge - term equivalent reached', () => {
    const birthDate = new Date('2024-01-15');
    const gestationalAge = { weeks: 28, days: 0, totalDays: 196 };
    const currentDate = new Date('2024-03-25'); // 84 days later: 196 + 84 = 280 = 40 weeks
    
    const result = AgeCalculator.calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
    
    runner.assertEqual(result.totalDays, 280, 'Should reach exactly 40 weeks PMA');
    runner.assertEqual(result.isTermEquivalent, true, 'Should be term equivalent');
    runner.assertEqual(result.daysToTerm, 0, 'Should have 0 days to term');
});

// Test edge cases
runner.test('Edge case - very preterm (24 weeks)', () => {
    const birthDate = new Date('2024-01-15');
    const gestationalAge = { weeks: 24, days: 0, totalDays: 168 };
    const currentDate = new Date('2024-02-15'); // 31 days later
    
    const corrected = AgeCalculator.calculateCorrectedAge(birthDate, gestationalAge, currentDate);
    const pma = AgeCalculator.calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
    
    runner.assertEqual(corrected.totalDays, 31 - (280 - 168), 'Very preterm corrected age');
    runner.assertEqual(pma.totalDays, 168 + 31, 'Very preterm PMA');
});

runner.test('Edge case - late preterm (36 weeks)', () => {
    const birthDate = new Date('2024-01-15');
    const gestationalAge = { weeks: 36, days: 0, totalDays: 252 };
    const currentDate = new Date('2024-02-15'); // 31 days later
    
    const corrected = AgeCalculator.calculateCorrectedAge(birthDate, gestationalAge, currentDate);
    const pma = AgeCalculator.calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
    
    runner.assertEqual(corrected.totalDays, 31 - (280 - 252), 'Late preterm corrected age');
    runner.assertEqual(pma.totalDays, 252 + 31, 'Late preterm PMA');
});

// Test input validation
runner.test('Input validation - invalid dates', () => {
    try {
        AgeCalculator.calculateChronologicalAge('invalid', new Date());
        throw new Error('Should have thrown an error for invalid birth date');
    } catch (error) {
        if (!error.message.includes('valid Date objects')) {
            throw error;
        }
    }
});

runner.test('Input validation - invalid gestational age', () => {
    try {
        AgeCalculator.calculateCorrectedAge(new Date(), { invalid: true }, new Date());
        throw new Error('Should have thrown an error for invalid gestational age');
    } catch (error) {
        if (!error.message.includes('totalDays property')) {
            throw error;
        }
    }
});

// Test calculation insights
runner.test('Insights generation - preterm infant', () => {
    const results = AgeCalculator.calculateAllAges(
        new Date('2024-01-15'),
        { weeks: 32, days: 0, totalDays: 224 },
        new Date('2024-02-15')
    );
    
    runner.assertEqual(typeof results.insights, 'object', 'Should generate insights object');
    runner.assertEqual(results.insights.prematurityLevel, 'Very preterm', 'Should identify prematurity level');
    runner.assertEqual(results.insights.correctionRelevance.includes('relevant'), true, 'Should indicate correction relevance');
});

runner.test('Insights generation - term infant', () => {
    const results = AgeCalculator.calculateAllAges(
        new Date('2024-01-15'),
        { weeks: 40, days: 0, totalDays: 280 },
        new Date('2024-02-15')
    );
    
    runner.assertEqual(results.insights.prematurityLevel, 'Term', 'Should identify as term');
    runner.assertEqual(results.insights.correctionRelevance.includes('Limited'), true, 'Should indicate limited correction relevance');
});

// Test mathematical precision
runner.test('Mathematical precision - complex gestational ages', () => {
    const birthDate = new Date('2024-01-15');
    const gestationalAge = { weeks: 33, days: 5, totalDays: (33 * 7) + 5 }; // 236 days
    const currentDate = new Date('2024-03-01'); // 46 days later
    
    const corrected = AgeCalculator.calculateCorrectedAge(birthDate, gestationalAge, currentDate);
    const pma = AgeCalculator.calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
    
    const expectedCorrected = 46 - (280 - 236); // 46 - 44 = 2
    const expectedPMA = 236 + 46; // 282
    
    runner.assertEqual(corrected.totalDays, expectedCorrected, 'Complex gestational age corrected calculation');
    runner.assertEqual(pma.totalDays, expectedPMA, 'Complex gestational age PMA calculation');
});

// Run all tests
if (typeof window !== 'undefined') {
    // Browser environment
    window.runCalculatorTests = () => runner.run();
    console.log('Calculator tests loaded. Run window.runCalculatorTests() to execute.');
} else {
    // Node.js environment
    const success = runner.run();
    process.exit(success ? 0 : 1);
}
