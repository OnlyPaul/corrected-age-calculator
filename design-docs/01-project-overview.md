# Corrected Age Calculator - Project Overview

## Purpose

This application is designed to help healthcare professionals and parents calculate the corrected age and postmenstrual age of infants, particularly preterm babies. These calculations are crucial for assessing developmental milestones and medical care for infants born before full term.

## Target Users

- Healthcare professionals (pediatricians, nurses, neonatologists)
- Parents of preterm infants
- Medical students and trainees
- Child development specialists

## Key Features

### Primary Calculations
1. **Corrected Age (Adjusted Age)**: The age an infant would be if they had been born at full term (40 weeks gestation)
2. **Postmenstrual Age (PMA)**: The gestational age at birth plus the chronological age since birth

### Required Inputs
- Date of birth
- Gestational age at birth (in weeks and days)
- Current date (or date for calculation)

### Output Display
- Corrected age in weeks, days, months, and years
- Postmenstrual age in weeks and days
- Chronological age for reference
- Clear explanations of each calculation

## Medical Background

### Corrected Age
Corrected age is used to assess whether a preterm infant is meeting developmental milestones appropriately. It adjusts for the fact that the infant was born early.

**Formula**: Corrected Age = Chronological Age - (40 weeks - Gestational Age at Birth)

### Postmenstrual Age
Postmenstrual age represents the total time since the onset of the last menstrual period, combining gestational age at birth with time since birth.

**Formula**: PMA = Gestational Age at Birth + Chronological Age

## Success Criteria

1. **Accuracy**: All calculations must be medically accurate and validated
2. **Usability**: Simple, intuitive interface requiring minimal training
3. **Accessibility**: Compliant with WCAG 2.1 guidelines
4. **Performance**: Fast loading and calculation times
5. **Cross-platform**: Works on desktop and mobile browsers
6. **Offline capability**: Can function without internet connection

## Constraints and Considerations

- Must handle edge cases (very preterm infants, dates in different formats)
- Should provide warnings for unusual inputs
- Must be culturally sensitive to different date formats
- Should include educational information about the calculations
- Privacy-focused: no data storage or transmission

## Non-Functional Requirements

- Load time: < 2 seconds
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No external dependencies for core functionality
- Offline-first architecture
