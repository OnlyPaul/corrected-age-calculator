# Calculation Specifications (TypeScript Implementation)

## Overview

This document provides detailed TypeScript specifications for calculating corrected age and postmenstrual age for infants, including type-safe mathematical formulas, comprehensive edge case handling, and validation rules with full type coverage.

## TypeScript Input Requirements

### Date of Birth (Type-Safe Validation)
```typescript
interface DateValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
  value: Date | null;
}

const validateBirthDate = (dateString: string): DateValidation => {
  // TypeScript implementation with dayjs for robust date parsing
  const date = dayjs(dateString);
  if (!date.isValid()) {
    return { isValid: false, error: 'Invalid date format', value: null };
  }
  // Additional validation logic...
};
```

### Gestational Age at Birth (Strict Type Checking)
```typescript
interface GestationalAge {
  weeks: number;        // 20-44 inclusive
  days: number;         // 0-6 inclusive  
  totalDays: number;    // calculated: weeks * 7 + days
}

const validateGestationalAge = (weeks: number, days: number): ValidationResult<GestationalAge> => {
  if (!Number.isInteger(weeks) || weeks < 20 || weeks > 44) {
    return { isValid: false, error: 'Weeks must be 20-44', value: null };
  }
  if (!Number.isInteger(days) || days < 0 || days > 6) {
    return { isValid: false, error: 'Days must be 0-6', value: null };
  }
  
  const totalDays = weeks * 7 + days;
  return { 
    isValid: true, 
    value: { weeks, days, totalDays },
    error: '',
    warning: '' 
  };
};
```

### Current Date (Material UI DatePicker Integration)
```typescript
interface CalculationDate {
  date: Date;
  isToday: boolean;
  isProjected: boolean;  // future date for projected calculations
}

const validateCurrentDate = (
  dateString: string, 
  birthDate: Date
): ValidationResult<CalculationDate> => {
  // Type-safe validation with comprehensive error handling
};
```

## TypeScript Core Calculations

### 1. Chronological Age (Type-Safe Implementation)
```typescript
interface ChronologicalAgeResult extends AgeResult {
  type: 'chronological';
  description: string;
}

const calculateChronologicalAge = (
  birthDate: Date, 
  currentDate: Date
): ChronologicalAgeResult => {
  const totalDays = dayjs(currentDate).diff(dayjs(birthDate), 'days');
  const ageFormatted = formatAgeResult(totalDays);
  
  return {
    ...ageFormatted,
    type: 'chronological',
    description: 'Actual time elapsed since birth'
  };
};
```

**Type-Safe Output Formats**:
```typescript
interface AgeResult {
  totalDays: number;
  weeks: number;
  days: number;
  months: number;
  years: number;
  primaryDisplay: string;    // "6 weeks 4 days"
  secondaryDisplay: string;  // "(1 month 1 week)"
}
```

### 2. Corrected Age (Type-Safe Implementation)
```typescript
interface CorrectedAgeResult extends AgeResult {
  type: 'corrected';
  description: string;
  prematurityOffset: number;
  isNegative: boolean;
  wouldReachTermAt: Date;
}

const calculateCorrectedAge = (
  birthDate: Date,
  gestationalAge: GestationalAge,
  currentDate: Date
): CorrectedAgeResult => {
  // Type-safe calculation with comprehensive error handling
  const chronologicalDays = dayjs(currentDate).diff(dayjs(birthDate), 'days');
  const fullTermDays = 40 * 7; // 280 days
  const prematurityOffset = fullTermDays - gestationalAge.totalDays;
  const correctedDays = chronologicalDays - prematurityOffset;
  
  const ageFormatted = formatAgeResult(correctedDays);
  const termDate = dayjs(birthDate).add(prematurityOffset, 'days').toDate();
  
  return {
    ...ageFormatted,
    type: 'corrected',
    description: 'Age adjusted for prematurity (if born at full term)',
    prematurityOffset,
    isNegative: correctedDays < 0,
    wouldReachTermAt: termDate
  };
};
```

**TypeScript Calculation Steps**:
```typescript
// All calculations with strict type checking
const FULL_TERM_DAYS = 280 as const;
const DAYS_PER_WEEK = 7 as const;

type CalculationStep = {
  gestationalDays: number;      // GA_weeks * 7 + GA_days
  prematurityOffset: number;    // 280 - gestationalDays  
  chronologicalDays: number;    // dayjs diff calculation
  correctedDays: number;        // chronologicalDays - offset
};
```

**Type-Safe Edge Case Handling**:
- Negative corrected age properly typed and handled
- Term/post-term infants with type guards
- Calculation validation with comprehensive error types

### 3. Postmenstrual Age (TypeScript Implementation)
```typescript
interface PostmenstrualAgeResult extends AgeResult {
  type: 'postmenstrual';
  description: string;
  isTermEquivalent: boolean;
  daysToTerm: number;
  termDate: Date;
}

const calculatePostmenstrualAge = (
  birthDate: Date,
  gestationalAge: GestationalAge,
  currentDate: Date
): PostmenstrualAgeResult => {
  const chronologicalDays = dayjs(currentDate).diff(dayjs(birthDate), 'days');
  const pmaDays = gestationalAge.totalDays + chronologicalDays;
  
  const ageFormatted = formatAgeResult(pmaDays);
  const fullTermDays = 40 * 7;
  const isTermEquivalent = pmaDays >= fullTermDays;
  const daysToTerm = Math.max(0, fullTermDays - pmaDays);
  const termDate = dayjs(birthDate).add(fullTermDays - gestationalAge.totalDays, 'days').toDate();
  
  return {
    ...ageFormatted,
    type: 'postmenstrual',
    description: 'Total time since onset of last menstrual period',
    isTermEquivalent,
    daysToTerm,
    termDate
  };
};
```

**Type-Safe PMA Calculation**:
```typescript
type PMACalculation = {
  gestationalDays: number;     // GA_weeks * 7 + GA_days
  chronologicalDays: number;   // dayjs().diff() calculation  
  pmaDays: number;            // gestationalDays + chronologicalDays
  pmaWeeks: number;           // Math.floor(pmaDays / 7)
  pmaRemainderDays: number;   // pmaDays % 7
};
```

## TypeScript Edge Cases and Special Scenarios

### 1. Negative Corrected Age (Type-Safe Handling)
```typescript
interface NegativeCorrectedAge {
  isNegative: true;
  explanation: string;
  daysUntilTerm: number;
  displayWarning: boolean;
}

const handleNegativeCorrectedAge = (correctedDays: number): NegativeCorrectedAge | null => {
  if (correctedDays >= 0) return null;
  
  return {
    isNegative: true,
    explanation: 'Infant has not yet reached their original due date',
    daysUntilTerm: Math.abs(correctedDays),
    displayWarning: Math.abs(correctedDays) > 98 // > 14 weeks negative
  };
};
```

### 2. Post-term Birth (Type Guards)
```typescript
type BirthTerm = 'extremely-preterm' | 'very-preterm' | 'moderate-preterm' | 'late-preterm' | 'term' | 'post-term';

const getBirthTermCategory = (weeks: number): BirthTerm => {
  if (weeks < 28) return 'extremely-preterm';
  if (weeks < 32) return 'very-preterm';
  if (weeks < 34) return 'moderate-preterm';
  if (weeks < 37) return 'late-preterm';
  if (weeks <= 42) return 'term';
  return 'post-term';
};
```

### 3. Date Handling (Day.js Integration)
```typescript
// Robust date handling with TypeScript
const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  return dayjs(endDate).diff(dayjs(startDate), 'days', true); // precise calculation
};

// Leap year handling built into dayjs
const isLeapYear = (date: Date): boolean => {
  return dayjs(date).isLeapYear();
};
```

## Precision and Rounding

### Age Calculations
- **Days**: Exact calculation, no rounding
- **Weeks**: Round down to nearest whole week, show remainder as days
- **Months**: Use calendar months, account for varying month lengths
- **Years**: Use calendar years

### Display Precision
- **Corrected Age**: Show in most appropriate unit (days for newborns, weeks for infants, months for older babies)
- **PMA**: Always show in weeks and days format
- **Chronological Age**: Show in multiple formats for reference

## Validation Rules

### Input Validation
1. **Date of Birth**:
   - Must be valid calendar date
   - Cannot be in the future
   - Should be within reasonable range (< 5 years ago)

2. **Gestational Age**:
   - Weeks: 20-44 (inclusive)
   - Days: 0-6 (inclusive)
   - Total must not exceed 44+0

3. **Current Date**:
   - Must be valid calendar date
   - Must be on or after date of birth

### Calculation Validation
1. **Range Checks**:
   - Warn if gestational age < 24 weeks (very early)
   - Warn if gestational age > 42 weeks (post-term)
   - Alert if chronological age > 3 years (corrected age less relevant)

2. **Logical Checks**:
   - Ensure all inputs are internally consistent
   - Verify calculation results are reasonable

## Output Specifications

### Corrected Age Display
```
Primary: "X weeks Y days" (for infants < 1 year)
Secondary: "X months Y days" (for infants > 6 months)
Tertiary: "X years Y months" (for children > 1 year)
```

### Postmenstrual Age Display
```
Standard: "X weeks Y days PMA"
Range indicator: Include expected ranges for reference
```

### Additional Information
- Term equivalent age marker (40 weeks PMA)
- Due date reference
- Developmental milestone context

## Mathematical Examples

### Example 1: Typical Preterm Infant
- **Birth Date**: January 15, 2024
- **Gestational Age**: 32 weeks 0 days
- **Current Date**: March 1, 2024
- **Chronological Age**: 46 days (6 weeks 4 days)
- **Corrected Age**: 46 - (280 - 224) = -10 days (-1 week 3 days)
- **PMA**: 224 + 46 = 270 days (38 weeks 4 days)

### Example 2: Term Infant
- **Birth Date**: January 15, 2024
- **Gestational Age**: 39 weeks 2 days
- **Current Date**: March 1, 2024
- **Chronological Age**: 46 days (6 weeks 4 days)
- **Corrected Age**: 46 - (280 - 275) = 41 days (5 weeks 6 days)
- **PMA**: 275 + 46 = 321 days (45 weeks 6 days)

## Algorithm Implementation Notes

1. **Date Arithmetic**: Use standard library functions for date calculations
2. **Integer Division**: Handle week/day conversions carefully
3. **Error Handling**: Graceful handling of invalid inputs
4. **Performance**: Calculations should be near-instantaneous
5. **Precision**: Maintain day-level precision throughout calculations
