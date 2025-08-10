# Calculation Specifications

## Overview

This document provides detailed specifications for calculating corrected age and postmenstrual age for infants, including mathematical formulas, edge cases, and validation rules.

## Input Requirements

### Date of Birth
- **Format**: ISO 8601 format (YYYY-MM-DD) or locale-appropriate format
- **Validation**: Must be a valid date, cannot be in the future
- **Range**: Reasonable range (not more than 5 years ago for typical use cases)

### Gestational Age at Birth
- **Format**: Weeks + Days (e.g., "32 weeks 4 days" or "32+4")
- **Range**: 20-44 weeks (medical viability range)
- **Validation**: 
  - Weeks must be integer between 20-44
  - Days must be integer between 0-6
  - Total must not exceed 44 weeks + 0 days

### Current Date (or Calculation Date)
- **Format**: ISO 8601 format (YYYY-MM-DD)
- **Validation**: Cannot be before date of birth
- **Default**: Today's date if not specified

## Core Calculations

### 1. Chronological Age
The actual time elapsed since birth.

```
Chronological Age = Current Date - Date of Birth
```

**Output Formats**:
- Days (total)
- Weeks and days
- Months and days
- Years, months, and days

### 2. Corrected Age (Adjusted Age)
The age the infant would be if born at full term (40 weeks).

```
Corrected Age = Chronological Age - Prematurity Offset

Where:
Prematurity Offset = 40 weeks - Gestational Age at Birth
```

**Detailed Formula**:
```
1. Convert gestational age to total days: GA_days = (GA_weeks × 7) + GA_days
2. Calculate full term in days: Full_term = 40 × 7 = 280 days
3. Calculate prematurity offset: Offset = Full_term - GA_days
4. Calculate chronological age in days: Chrono_days = Current_Date - Birth_Date
5. Calculate corrected age: Corrected_days = Chrono_days - Offset
```

**Important Notes**:
- Corrected age can be negative for very preterm infants
- Corrected age is typically used until 2-3 years of age
- For infants born at or after 37 weeks, corrected age ≈ chronological age

### 3. Postmenstrual Age (PMA)
The total time since the onset of the last menstrual period.

```
Postmenstrual Age = Gestational Age at Birth + Chronological Age
```

**Detailed Formula**:
```
1. Convert gestational age to days: GA_days = (GA_weeks × 7) + GA_days
2. Calculate chronological age in days: Chrono_days = Current_Date - Birth_Date
3. Calculate PMA in days: PMA_days = GA_days + Chrono_days
4. Convert back to weeks and days: PMA_weeks = floor(PMA_days / 7), PMA_remainder_days = PMA_days % 7
```

## Edge Cases and Special Scenarios

### 1. Negative Corrected Age
- **Scenario**: Very preterm infant whose corrected age is negative
- **Handling**: Display as negative value with clear explanation
- **Example**: 24-week infant at 2 weeks old has corrected age of -14 weeks

### 2. Post-term Birth
- **Scenario**: Infant born after 42 weeks gestation
- **Handling**: Use actual gestational age, note post-term status
- **Calculation**: Proceeds normally, corrected age will be older than chronological age

### 3. Leap Years
- **Consideration**: February 29th handling
- **Implementation**: Use proper date arithmetic libraries
- **Testing**: Include leap year test cases

### 4. Time Zones
- **Approach**: Use local dates only, avoid time zone complications
- **Implementation**: Date-only calculations, no time components

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
