# Corrected Age Calculator

A medical tool for calculating corrected age and postmenstrual age for preterm infants. Built as a static web application for healthcare professionals and parents.

## 🚀 Quick Start

1. **Open the calculator**: Open `index.html` in any modern web browser
2. **Enter information**:
   - Date of birth
   - Gestational age at birth (weeks + days)
   - Calculation date (defaults to today)
3. **Calculate**: Click "Calculate Ages" to see results
4. **View results**: See corrected age, postmenstrual age, and developmental guidance

## 📋 Features

### Core Calculations
- **Corrected Age**: Age adjusted for prematurity (if born at full term)
- **Postmenstrual Age**: Total time since onset of last menstrual period
- **Chronological Age**: Actual time elapsed since birth (for reference)

### User Experience
- 📱 **Mobile-first responsive design**
- ♿ **WCAG 2.1 AA accessibility compliance**
- 🔒 **Privacy-first**: No data storage or transmission
- 📚 **Educational content** with medical explanations
- 🖨️ **Print-friendly results**

### Medical Features
- ✅ **Medically accurate formulas** based on established standards
- ⚠️ **Smart validation** with warnings for edge cases
- 🎯 **Developmental guidance** appropriate for age and prematurity level
- 📊 **Multiple age formats** (weeks/days, months, years)

## 🏗️ Project Structure

```
corrected-age-calculator/
├── index.html              # Main application
├── css/
│   ├── styles.css          # Core styling
│   └── responsive.css      # Mobile responsiveness
├── js/
│   ├── calculator.js       # Calculation engine
│   ├── ui.js              # User interface
│   ├── validation.js      # Input validation
│   └── utils.js           # Utility functions
├── assets/
│   └── favicon.svg        # Site icon
├── tests/
│   ├── calculator.test.js # Calculator tests
│   ├── validation.test.js # Validation tests
│   └── test-runner.html   # Browser test runner
├── design-docs/           # Comprehensive documentation
└── README.md             # This file
```

## 🧪 Testing

### Run Tests in Browser
1. Open `tests/test-runner.html` in your browser
2. Click "Run All Tests" to execute the full test suite
3. Individual test suites can be run separately

### Test Coverage
- **Unit Tests**: Core calculation logic and validation
- **Integration Tests**: Component interaction
- **Edge Cases**: Boundary conditions and error handling
- **Performance Tests**: Calculation speed verification

### Test Results
All tests must pass for medical accuracy:
- ✅ Chronological age calculations
- ✅ Corrected age formulas (including negative ages)
- ✅ Postmenstrual age calculations
- ✅ Input validation and error handling
- ✅ Edge cases (leap years, extreme prematurity, etc.)

## 📖 Medical Background

### What is Corrected Age?
Corrected age (adjusted age) is the age a preterm infant would be if they had been born at full term (40 weeks gestation). It's essential for:
- Assessing developmental milestones
- Timing medical interventions
- Providing appropriate developmental expectations

**Formula**: `Corrected Age = Chronological Age - (40 weeks - Gestational Age at Birth)`

### What is Postmenstrual Age?
Postmenstrual age (PMA) represents the total time since the onset of the mother's last menstrual period.

**Formula**: `PMA = Gestational Age at Birth + Chronological Age`

### When to Use Corrected Age
- **Highly relevant**: Very preterm infants (<32 weeks) up to 2-3 years
- **Moderately relevant**: Late preterm infants (32-37 weeks) up to 1-2 years
- **Limited relevance**: Term infants (≥37 weeks) or children >3 years

## 🔧 Technical Details

### Browser Support
- Chrome 80+ (2020)
- Firefox 75+ (2020)
- Safari 13+ (2019)
- Edge 80+ (2020)

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No dependencies for maximum compatibility
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Performance Targets
- ⚡ Page load: <2 seconds on 3G
- 🔄 Calculation time: <100ms
- 💾 Memory usage: <10MB
- 📱 Touch targets: ≥44px minimum

### Accessibility Features
- Semantic HTML structure
- ARIA labels and live regions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Access via `https://yourusername.github.io/corrected-age-calculator`

### Other Static Hosting
Works with any static hosting service:
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

### Local Development
Simply open `index.html` in a web browser. No build process required.

## 📚 Documentation

Comprehensive design documentation is available in the `design-docs/` folder:

- **01-project-overview.md**: Purpose and requirements
- **02-calculation-specifications.md**: Mathematical formulas
- **03-technical-specification.md**: Implementation details
- **04-ui-ux-design.md**: Interface design
- **05-testing-strategy.md**: Testing approach

## ⚠️ Medical Disclaimer

**Important**: This calculator is for educational and informational purposes only. Always consult with qualified healthcare professionals for medical decisions. The calculations provided should not replace professional medical advice, diagnosis, or treatment.

## 🤝 Contributing

This project welcomes contributions, especially from:
- Healthcare professionals (for medical accuracy review)
- Accessibility experts (for WCAG compliance)
- Parents of preterm infants (for usability feedback)

### Development Guidelines
1. All changes must pass the test suite
2. Medical calculations require professional validation
3. Maintain WCAG 2.1 AA accessibility compliance
4. Follow mobile-first responsive design principles

## 📄 License

This project is released under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Medical formulas based on established pediatric and neonatal standards
- Accessibility guidelines from WCAG 2.1
- UI/UX principles from healthcare design best practices
- Testing approach inspired by medical device validation standards

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Medical Review**: Pending (recommended before clinical use)

For questions, issues, or medical review requests, please open an issue in the repository.
