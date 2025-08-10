# Testing Strategy and Test Cases (React TypeScript)

## Testing Overview

This document outlines the comprehensive testing strategy for the React TypeScript Corrected Age Calculator, including type-safe unit tests with Vitest, component testing with React Testing Library, end-to-end testing with Playwright, and comprehensive accessibility testing with Material UI's built-in accessibility features.

## React TypeScript Testing Pyramid

```
    ┌─────────────────┐
    │ E2E Tests (5%)  │  ← Playwright with TypeScript
    │ (Playwright)    │     Cross-browser workflows
    ├─────────────────┤
    │ Component Tests │  ← React Testing Library + Vitest
    │ (25% effort)    │     Material UI component interactions
    ├─────────────────┤
    │ Unit Tests      │  ← Vitest with full TypeScript coverage
    │ (70% effort)    │     Type-safe calculations, validation
    └─────────────────┘
```

## Unit Testing

### Test Framework (Vitest + TypeScript)
- **Framework**: Vitest for TypeScript testing with native ESM support
- **Coverage Target**: 95% code coverage with TypeScript strict mode
- **Type Safety**: Full TypeScript coverage for test files and assertions
- **Test Environment**: Node.js with jsdom for DOM simulation

### Calculator Module Tests (`calculator.test.js`)

#### Chronological Age Calculations
```javascript
describe('calculateChronologicalAge', () => {
    test('calculates age for same-day birth', () => {
        const birthDate = new Date('2024-01-15');
        const currentDate = new Date('2024-01-15');
        const result = calculateChronologicalAge(birthDate, currentDate);
        expect(result.totalDays).toBe(0);
        expect(result.weeks).toBe(0);
        expect(result.days).toBe(0);
    });

    test('calculates age for one week old infant', () => {
        const birthDate = new Date('2024-01-15');
        const currentDate = new Date('2024-01-22');
        const result = calculateChronologicalAge(birthDate, currentDate);
        expect(result.totalDays).toBe(7);
        expect(result.weeks).toBe(1);
        expect(result.days).toBe(0);
    });

    test('calculates age across month boundaries', () => {
        const birthDate = new Date('2024-01-30');
        const currentDate = new Date('2024-02-05');
        const result = calculateChronologicalAge(birthDate, currentDate);
        expect(result.totalDays).toBe(6);
        expect(result.weeks).toBe(0);
        expect(result.days).toBe(6);
    });

    test('handles leap year correctly', () => {
        const birthDate = new Date('2024-02-28');
        const currentDate = new Date('2024-03-01');
        const result = calculateChronologicalAge(birthDate, currentDate);
        expect(result.totalDays).toBe(2); // 2024 is leap year
    });
});
```

#### Corrected Age Calculations
```javascript
describe('calculateCorrectedAge', () => {
    test('calculates corrected age for 32-week infant', () => {
        const birthDate = new Date('2024-01-15');
        const gestationalAge = { weeks: 32, days: 0 };
        const currentDate = new Date('2024-03-01'); // 46 days later
        const result = calculateCorrectedAge(birthDate, gestationalAge, currentDate);
        
        // 46 days - (280 - 224) = -10 days
        expect(result.totalDays).toBe(-10);
        expect(result.weeks).toBe(-2);
        expect(result.days).toBe(4);
    });

    test('calculates corrected age for term infant', () => {
        const birthDate = new Date('2024-01-15');
        const gestationalAge = { weeks: 40, days: 0 };
        const currentDate = new Date('2024-02-15'); // 31 days later
        const result = calculateCorrectedAge(birthDate, gestationalAge, currentDate);
        
        expect(result.totalDays).toBe(31);
        expect(result.weeks).toBe(4);
        expect(result.days).toBe(3);
    });

    test('handles post-term infant correctly', () => {
        const birthDate = new Date('2024-01-15');
        const gestationalAge = { weeks: 42, days: 0 };
        const currentDate = new Date('2024-02-15'); // 31 days later
        const result = calculateCorrectedAge(birthDate, gestationalAge, currentDate);
        
        // 31 + 14 = 45 days (corrected age older than chronological)
        expect(result.totalDays).toBe(45);
        expect(result.weeks).toBe(6);
        expect(result.days).toBe(3);
    });
});
```

#### Postmenstrual Age Calculations
```javascript
describe('calculatePostmenstrualAge', () => {
    test('calculates PMA for preterm infant', () => {
        const birthDate = new Date('2024-01-15');
        const gestationalAge = { weeks: 28, days: 3 };
        const currentDate = new Date('2024-02-15'); // 31 days later
        const result = calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
        
        // (28*7 + 3) + 31 = 196 + 31 = 227 days = 32 weeks 3 days
        expect(result.totalDays).toBe(227);
        expect(result.weeks).toBe(32);
        expect(result.days).toBe(3);
    });

    test('identifies term equivalent correctly', () => {
        const birthDate = new Date('2024-01-01');
        const gestationalAge = { weeks: 28, days: 0 };
        const currentDate = new Date('2024-02-25'); // 55 days later
        const result = calculatePostmenstrualAge(birthDate, gestationalAge, currentDate);
        
        // (28*7) + 55 = 196 + 55 = 251 days
        expect(result.totalDays).toBe(251);
        expect(result.isTermEquivalent).toBe(false);
        
        // At 84 days (12 weeks), should reach term equivalent
        const termDate = new Date('2024-03-25');
        const termResult = calculatePostmenstrualAge(birthDate, gestationalAge, termDate);
        expect(termResult.isTermEquivalent).toBe(true);
    });
});
```

### Validation Module Tests (`validation.test.js`)

#### Date Validation
```javascript
describe('validateBirthDate', () => {
    test('accepts valid birth dates', () => {
        const validDates = [
            '2024-01-15',
            '2023-12-25',
            '2020-02-29' // leap year
        ];
        validDates.forEach(date => {
            expect(validateBirthDate(date).isValid).toBe(true);
        });
    });

    test('rejects future dates', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const result = validateBirthDate(futureDate.toISOString().split('T')[0]);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('future');
    });

    test('rejects invalid date formats', () => {
        const invalidDates = [
            '2024-13-01', // invalid month
            '2024-02-30', // invalid day
            '2023-02-29', // not leap year
            'invalid-date',
            '',
            null
        ];
        invalidDates.forEach(date => {
            expect(validateBirthDate(date).isValid).toBe(false);
        });
    });
});
```

#### Gestational Age Validation
```javascript
describe('validateGestationalAge', () => {
    test('accepts valid gestational ages', () => {
        const validAges = [
            { weeks: 24, days: 0 },
            { weeks: 32, days: 4 },
            { weeks: 40, days: 0 },
            { weeks: 42, days: 6 }
        ];
        validAges.forEach(age => {
            expect(validateGestationalAge(age.weeks, age.days).isValid).toBe(true);
        });
    });

    test('rejects invalid ranges', () => {
        const invalidAges = [
            { weeks: 19, days: 0 }, // too early
            { weeks: 45, days: 0 }, // too late
            { weeks: 32, days: 7 }, // invalid days
            { weeks: 32, days: -1 }, // negative days
            { weeks: -1, days: 0 } // negative weeks
        ];
        invalidAges.forEach(age => {
            expect(validateGestationalAge(age.weeks, age.days).isValid).toBe(false);
        });
    });

    test('provides warnings for edge cases', () => {
        const result = validateGestationalAge(23, 0);
        expect(result.isValid).toBe(true);
        expect(result.warning).toContain('very preterm');
    });
});
```

### Edge Cases and Boundary Testing

```javascript
describe('Edge Cases', () => {
    test('handles very preterm infants (20 weeks)', () => {
        // Test minimum viable gestational age
    });

    test('handles post-term infants (44+ weeks)', () => {
        // Test maximum reasonable gestational age
    });

    test('handles calculation on exact term date', () => {
        // Test when PMA = 40 weeks exactly
    });

    test('handles same date inputs', () => {
        // Test when birth date = current date
    });

    test('handles year boundaries', () => {
        // Test calculations spanning multiple years
    });

    test('handles DST transitions', () => {
        // Test date calculations during daylight saving transitions
    });
});
```

## Integration Testing

### UI Integration Tests

#### Form Interaction Tests
```javascript
describe('Form Interactions', () => {
    test('calculates ages when form is submitted', async () => {
        // Setup DOM
        document.body.innerHTML = getHTMLFixture();
        
        // Fill form
        await userEvent.type(screen.getByLabelText('Date of Birth'), '2024-01-15');
        await userEvent.type(screen.getByLabelText('Gestational Weeks'), '32');
        await userEvent.type(screen.getByLabelText('Gestational Days'), '0');
        
        // Submit form
        await userEvent.click(screen.getByRole('button', { name: 'Calculate Ages' }));
        
        // Verify results displayed
        expect(screen.getByText(/Corrected Age/)).toBeInTheDocument();
        expect(screen.getByText(/Postmenstrual Age/)).toBeInTheDocument();
    });

    test('displays validation errors for invalid inputs', async () => {
        document.body.innerHTML = getHTMLFixture();
        
        // Enter invalid date
        await userEvent.type(screen.getByLabelText('Date of Birth'), '2025-01-15');
        
        // Submit form
        await userEvent.click(screen.getByRole('button', { name: 'Calculate Ages' }));
        
        // Verify error message
        expect(screen.getByText(/cannot be in the future/)).toBeInTheDocument();
    });
});
```

#### Real-time Validation Tests
```javascript
describe('Real-time Validation', () => {
    test('validates input on blur', async () => {
        // Test immediate feedback when user leaves field
    });

    test('clears errors when input becomes valid', async () => {
        // Test error state cleanup
    });

    test('updates calculations as user types', async () => {
        // Test live calculation updates
    });
});
```

## User Acceptance Testing

### Test Scenarios

#### Scenario 1: Healthcare Professional - Quick Calculation
**User Story**: As a neonatologist, I want to quickly calculate corrected age during rounds.

**Test Steps**:
1. Navigate to calculator
2. Enter patient's birth date: January 15, 2024
3. Enter gestational age: 32 weeks 0 days
4. Use today's date for current date
5. Click calculate

**Expected Results**:
- Calculation completes in < 2 seconds
- Results clearly display corrected age and PMA
- All results are medically accurate
- Interface remains usable on mobile device

#### Scenario 2: Parent - Understanding Development
**User Story**: As a parent of a preterm baby, I want to understand my child's developmental timeline.

**Test Steps**:
1. Open calculator on mobile phone
2. Enter baby's information with help text
3. View results with explanations
4. Access additional educational content

**Expected Results**:
- All medical terms are explained clearly
- Help content is easily accessible
- Results include context about development
- No anxiety-inducing language used

#### Scenario 3: Medical Student - Learning Tool
**User Story**: As a medical student, I want to practice age calculations and understand the concepts.

**Test Steps**:
1. Use calculator with various example cases
2. Access detailed explanations
3. Verify calculations manually
4. Test edge cases and unusual scenarios

**Expected Results**:
- Educational content enhances understanding
- Examples cover common clinical scenarios
- Calculations match textbook formulas
- Edge cases are handled appropriately

### Acceptance Criteria

#### Functional Requirements
- [ ] All calculations are mathematically accurate
- [ ] Input validation prevents invalid data entry
- [ ] Results display in multiple formats (weeks/days, months)
- [ ] Application works offline
- [ ] No data is transmitted or stored

#### Performance Requirements
- [ ] Page loads in < 2 seconds on 3G connection
- [ ] Calculations complete in < 100ms
- [ ] UI interactions respond in < 50ms
- [ ] Application uses < 10MB memory

#### Usability Requirements
- [ ] First-time users can complete calculation without help
- [ ] Expert users can complete calculation in < 30 seconds
- [ ] Error recovery is intuitive and helpful
- [ ] Help content answers common questions

#### Accessibility Requirements
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader compatibility tested
- [ ] Keyboard navigation fully functional
- [ ] High contrast mode supported

## Accessibility Testing

### Automated Testing
```bash
# Tools and commands for automated accessibility testing
npm install -g axe-cli pa11y
axe index.html --tags wcag2a,wcag2aa
pa11y http://localhost:3000 --standard WCAG2AA
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab order is logical and complete
- [ ] All interactive elements are reachable
- [ ] Focus indicators are clearly visible
- [ ] Keyboard shortcuts work as expected

#### Screen Reader Testing
- [ ] All content is announced correctly
- [ ] Form labels are associated properly
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

#### Visual Testing
- [ ] Color contrast meets WCAG requirements
- [ ] Text scales to 200% without horizontal scrolling
- [ ] Focus indicators are visible at all zoom levels
- [ ] Content is usable with high contrast mode

## Performance Testing

### Load Testing
```javascript
// Performance test scenarios
describe('Performance Tests', () => {
    test('page load performance', () => {
        const startTime = performance.now();
        // Load page
        const loadTime = performance.now() - startTime;
        expect(loadTime).toBeLessThan(2000); // 2 seconds
    });

    test('calculation performance', () => {
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            calculateAllAges(testData[i]);
        }
        
        const avgTime = (performance.now() - startTime) / iterations;
        expect(avgTime).toBeLessThan(1); // 1ms average
    });
});
```

### Memory Testing
- Monitor memory usage during extended use
- Test for memory leaks in single-page usage
- Verify garbage collection of calculation results

## Security Testing

### Input Sanitization Testing
```javascript
describe('Security Tests', () => {
    test('prevents XSS in date inputs', () => {
        const maliciousInput = '<script>alert("xss")</script>';
        expect(() => validateBirthDate(maliciousInput)).not.toThrow();
        // Verify input is sanitized
    });

    test('handles extremely large numbers gracefully', () => {
        const largeNumber = Number.MAX_SAFE_INTEGER;
        expect(() => calculateChronologicalAge(new Date(largeNumber))).not.toThrow();
    });
});
```

## Cross-Browser Testing

### Browser Matrix
| Browser | Versions | Platforms | Priority |
|---------|----------|-----------|----------|
| Chrome | 80+ | All | High |
| Firefox | 75+ | All | High |
| Safari | 13+ | macOS, iOS | High |
| Edge | 80+ | Windows | Medium |

### Mobile Testing
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)
- Samsung Internet Browser
- Mobile Firefox

## Test Data and Fixtures

### Standard Test Cases
```javascript
const testCases = [
    {
        name: 'Full term infant',
        birthDate: '2024-01-15',
        gestationalAge: { weeks: 40, days: 0 },
        currentDate: '2024-02-15',
        expected: {
            chronological: { weeks: 4, days: 3 },
            corrected: { weeks: 4, days: 3 },
            postmenstrual: { weeks: 44, days: 3 }
        }
    },
    {
        name: 'Very preterm infant',
        birthDate: '2024-01-15',
        gestationalAge: { weeks: 24, days: 0 },
        currentDate: '2024-03-15',
        expected: {
            chronological: { weeks: 8, days: 4 },
            corrected: { weeks: -7, days: 3 },
            postmenstrual: { weeks: 32, days: 4 }
        }
    }
    // Additional test cases...
];
```

## Test Automation

### Continuous Integration
```yaml
# GitHub Actions workflow for testing
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:accessibility
      - run: npm run test:performance
```

### Test Reporting
- Coverage reports generated by Jest
- Accessibility reports from axe-core
- Performance metrics from Lighthouse
- Cross-browser test results from BrowserStack

## Risk-Based Testing

### High-Risk Areas
1. **Calculation Logic**: Core business logic errors
2. **Date Handling**: Cross-browser date parsing issues
3. **Input Validation**: Security and data integrity
4. **Edge Cases**: Extreme premature or post-term cases

### Medium-Risk Areas
1. **UI Responsiveness**: Layout issues on different devices
2. **Help Content**: Accuracy of medical explanations
3. **Performance**: Slow loading or calculation times

### Low-Risk Areas
1. **Visual Design**: Minor styling inconsistencies
2. **Browser Compatibility**: Non-critical feature differences
3. **Content Updates**: Static text and label changes
