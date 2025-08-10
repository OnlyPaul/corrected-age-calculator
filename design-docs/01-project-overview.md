# Corrected Age Calculator - Project Overview (React TypeScript)

## Purpose

This modern React TypeScript application is designed to help healthcare professionals and parents calculate the corrected age and postmenstrual age of infants, particularly preterm babies. Built with Material UI components and comprehensive type safety, these calculations are crucial for assessing developmental milestones and medical care for infants born before full term.

## Target Users

- Healthcare professionals (pediatricians, nurses, neonatologists)
- Parents of preterm infants
- Medical students and trainees
- Child development specialists

## Key Features

### Primary Calculations
1. **Corrected Age (Adjusted Age)**: The age an infant would be if they had been born at full term (40 weeks gestation)
2. **Postmenstrual Age (PMA)**: The gestational age at birth plus the chronological age since birth

### Required Inputs (TypeScript Interfaces)
```typescript
interface CalculatorInputs {
  birthDate: string;           // ISO date string, validated with Material UI DatePicker
  gestationalWeeks: number;    // 20-44, validated with Material UI TextField
  gestationalDays: number;     // 0-6, validated with Material UI TextField
  currentDate: string;         // ISO date string, defaults to today
}
```

### Output Display (Type-Safe Results)
```typescript
interface CalculationResults {
  corrected: CorrectedAgeResult;        // Type-safe age calculation
  postmenstrual: PostmenstrualAgeResult; // Type-safe PMA calculation
  chronological: ChronologicalAgeResult; // Type-safe reference age
  insights: CalculationInsights;         // Medical context and recommendations
}
```

- Corrected age displayed with Material UI Typography components
- Postmenstrual age with term equivalent indicators using Material UI Chips
- Chronological age for reference with clear visual hierarchy
- Comprehensive explanations using Material UI Accordion components

## Medical Background

### Corrected Age
Corrected age is used to assess whether a preterm infant is meeting developmental milestones appropriately. It adjusts for the fact that the infant was born early.

**Formula**: Corrected Age = Chronological Age - (40 weeks - Gestational Age at Birth)

### Postmenstrual Age
Postmenstrual age represents the total time since the onset of the last menstrual period, combining gestational age at birth with time since birth.

**Formula**: PMA = Gestational Age at Birth + Chronological Age

## Success Criteria

1. **Type Safety**: All calculations implemented with TypeScript strict mode for medical accuracy
2. **Material UI Consistency**: Intuitive interface using Material Design principles
3. **Accessibility**: WCAG 2.1 AA compliance with Material UI accessibility features
4. **Performance**: React optimization with Lighthouse score > 95
5. **Modern Cross-platform**: Progressive Web App with responsive Material UI components
6. **Offline capability**: Service worker implementation with React offline patterns

## Constraints and Considerations

- TypeScript strict mode must handle all edge cases with comprehensive type safety
- Material UI Snackbar components for user-friendly warnings
- Internationalization support with React i18n for cultural sensitivity
- Educational content implemented as Material UI Dialog components
- Privacy-focused: React state management without external data transmission

## Non-Functional Requirements

- **Performance**: Vite build optimization, bundle size < 500KB
- **Browser Support**: Modern ES2020+ browsers with React 18 features
- **Responsive Design**: Material UI responsive grid system and breakpoints
- **Dependencies**: Managed through npm with TypeScript compatibility
- **Offline Architecture**: React service worker with Workbox integration
