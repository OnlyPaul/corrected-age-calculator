# Technical Specification

## Architecture Overview

This application will be built as a simple, single-page HTML application with vanilla JavaScript, CSS, and HTML. The architecture prioritizes simplicity, performance, and offline functionality.

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Process**: None required (direct HTML/CSS/JS files)
- **Testing**: Jest for unit tests, manual testing for UI
- **Version Control**: Git
- **Deployment**: Static file hosting (GitHub Pages, Netlify, etc.)

### File Structure
```
corrected-age-calculator/
├── index.html              # Main application page
├── css/
│   ├── styles.css          # Main stylesheet
│   └── responsive.css      # Mobile responsiveness
├── js/
│   ├── calculator.js       # Core calculation logic
│   ├── ui.js              # UI interaction handling
│   ├── validation.js      # Input validation
│   └── utils.js           # Utility functions
├── assets/
│   ├── icons/             # Application icons
│   └── images/            # Any required images
├── tests/
│   ├── calculator.test.js # Unit tests for calculations
│   ├── validation.test.js # Validation tests
│   └── test-runner.html   # Browser-based test runner
└── docs/
    └── README.md          # User documentation
```

## Core Components

### 1. Calculator Module (`js/calculator.js`)
Handles all age calculations with pure functions.

**Key Functions**:
```javascript
// Core calculation functions
calculateChronologicalAge(birthDate, currentDate)
calculateCorrectedAge(birthDate, gestationalAge, currentDate)
calculatePostmenstrualAge(birthDate, gestationalAge, currentDate)

// Utility functions
parseGestationalAge(gestationalString)
formatAge(ageInDays, format)
isValidGestationalAge(weeks, days)
```

**Data Structures**:
```javascript
// Age representation
const Age = {
    totalDays: number,
    weeks: number,
    days: number,
    months: number,
    years: number
}

// Gestational age representation
const GestationalAge = {
    weeks: number,        // 20-44
    days: number,         // 0-6
    totalDays: number     // calculated
}
```

### 2. UI Controller (`js/ui.js`)
Manages user interface interactions and updates.

**Key Functions**:
```javascript
// Event handlers
handleFormSubmit(event)
handleInputChange(event)
handleDateSelection(event)

// UI updates
updateResults(calculations)
displayErrors(validationErrors)
clearResults()
updateHelp(calculationType)
```

### 3. Validation Module (`js/validation.js`)
Validates all user inputs and provides error messages.

**Key Functions**:
```javascript
// Input validation
validateBirthDate(dateString)
validateGestationalAge(weeks, days)
validateCurrentDate(dateString, birthDate)

// Error handling
formatValidationError(field, errorType)
isValidDateRange(date1, date2)
```

### 4. Utilities (`js/utils.js`)
Common utility functions used across modules.

**Key Functions**:
```javascript
// Date utilities
parseDate(dateString)
formatDate(date, locale)
daysBetween(date1, date2)

// Number utilities
roundToNearest(value, precision)
clampToRange(value, min, max)

// String utilities
sanitizeInput(input)
formatNumber(number, locale)
```

## Data Flow

### Input Processing Flow
1. User enters data in form fields
2. Input validation occurs on blur/change events
3. Real-time feedback provided for invalid inputs
4. Form submission triggers comprehensive validation
5. If valid, calculations are performed
6. Results are displayed with appropriate formatting

### Calculation Flow
```
User Input → Validation → Parsing → Calculation → Formatting → Display
```

### Error Handling Flow
```
Input Error → Validation → Error Message → User Feedback → Correction → Retry
```

## API Design

### Calculator API
```javascript
class AgeCalculator {
    // Main calculation methods
    static calculateAges(birthDate, gestationalAge, currentDate) {
        return {
            chronological: ChronologicalAge,
            corrected: CorrectedAge,
            postmenstrual: PostmenstrualAge,
            metadata: CalculationMetadata
        }
    }
    
    // Individual calculation methods
    static calculateChronologicalAge(birthDate, currentDate)
    static calculateCorrectedAge(birthDate, gestationalAge, currentDate)
    static calculatePostmenstrualAge(birthDate, gestationalAge, currentDate)
    
    // Validation methods
    static validateInputs(birthDate, gestationalAge, currentDate)
    static isPreterm(gestationalAge)
    static getTermStatus(gestationalAge)
}
```

### UI API
```javascript
class UIController {
    // Initialization
    static init()
    static bindEvents()
    
    // Event handlers
    static handleCalculation()
    static handleReset()
    static handleHelpToggle()
    
    // Display methods
    static displayResults(results)
    static displayError(error)
    static clearDisplay()
    
    // Utility methods
    static getFormData()
    static setFormData(data)
    static validateForm()
}
```

## State Management

### Application State
The application maintains minimal state:
- Current form inputs
- Last calculation results
- UI state (help panels, error states)
- User preferences (date format, language)

### State Storage
```javascript
const AppState = {
    inputs: {
        birthDate: '',
        gestationalWeeks: '',
        gestationalDays: '',
        currentDate: ''
    },
    results: {
        chronological: null,
        corrected: null,
        postmenstrual: null,
        metadata: null
    },
    ui: {
        showHelp: false,
        expandedSections: [],
        errors: []
    },
    preferences: {
        dateFormat: 'auto',
        language: 'en'
    }
}
```

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Load help content and advanced features on demand
2. **Debouncing**: Debounce input validation for better UX
3. **Caching**: Cache calculation results for identical inputs
4. **Minification**: Minify CSS/JS for production
5. **Compression**: Enable gzip compression on server

### Performance Targets
- **Initial Load**: < 2 seconds on 3G connection
- **Calculation Time**: < 100ms for any input combination
- **UI Response**: < 50ms for form interactions
- **Memory Usage**: < 10MB total application footprint

## Security Considerations

### Input Sanitization
- Validate all date inputs against expected formats
- Sanitize numeric inputs to prevent injection
- Limit input string lengths to reasonable values
- Use allowlists for gestational age values

### Data Privacy
- No data transmission to external servers
- No local storage of sensitive information
- Clear data on page refresh/close
- No analytics or tracking by default

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;">
```

## Browser Compatibility

### Target Browsers
- Chrome 80+ (2020)
- Firefox 75+ (2020)
- Safari 13+ (2019)
- Edge 80+ (2020)

### Feature Support Requirements
- ES6+ JavaScript features
- CSS Grid and Flexbox
- HTML5 input types (date, number)
- Local Storage API (optional)

### Fallbacks
- Polyfills for older browser support if needed
- Progressive enhancement for advanced features
- Graceful degradation for unsupported features

## Error Handling Strategy

### Error Types
1. **Validation Errors**: Invalid input format or range
2. **Calculation Errors**: Mathematical edge cases
3. **System Errors**: Browser compatibility issues
4. **Network Errors**: Loading failures (minimal impact)

### Error Display
```javascript
const ErrorDisplay = {
    inline: 'Show errors next to relevant form fields',
    summary: 'Show error summary at top of form',
    modal: 'Show critical errors in modal dialogs',
    console: 'Log technical errors to browser console'
}
```

### Recovery Mechanisms
- Auto-correction for minor input errors
- Suggestion prompts for common mistakes
- Reset functionality to clear all inputs
- Help text to guide users through corrections

## Accessibility Requirements

### WCAG 2.1 Compliance
- **Level AA** conformance target
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

### Implementation Details
- Semantic HTML structure
- ARIA labels and descriptions
- Logical tab order
- Error announcements
- Alternative text for visual elements

### Testing Strategy
- Automated accessibility testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation testing
- Color contrast validation
- User testing with accessibility users

## Internationalization (Future Enhancement)

### Localization Support
- Date format localization
- Number format localization
- Text translation framework
- RTL language support

### Implementation Approach
- JSON-based translation files
- Dynamic text loading
- Locale-aware date/number formatting
- Cultural adaptation of medical terminology

## Deployment Strategy

### Build Process
1. **Development**: Direct file editing and browser testing
2. **Testing**: Automated unit tests and manual QA
3. **Staging**: Deploy to test environment
4. **Production**: Deploy to static hosting service

### Hosting Options
- **GitHub Pages**: Free hosting with Git integration
- **Netlify**: Advanced features and CDN
- **Vercel**: Optimized for static sites
- **AWS S3**: Enterprise-grade hosting

### Monitoring
- Basic analytics (optional, privacy-compliant)
- Error tracking for JavaScript errors
- Performance monitoring
- User feedback collection system
