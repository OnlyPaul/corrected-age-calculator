# Technical Specification (React TypeScript)

## Architecture Overview

This application is built as a modern React TypeScript single-page application with Material UI components. The architecture prioritizes type safety, component reusability, performance optimization, and maintainability.

### Technology Stack
- **Frontend**: React 18, TypeScript 5, Material UI 5
- **Build Process**: Vite with TypeScript compilation and optimization
- **State Management**: React Context API with custom hooks
- **Date Handling**: Day.js with Material UI Date Pickers
- **Testing**: Vitest, React Testing Library, Jest DOM, Playwright
- **Linting**: ESLint with TypeScript rules, Prettier
- **Version Control**: Git with conventional commits
- **Deployment**: Vercel/Netlify with preview environments

### React TypeScript File Structure
```
corrected-age-calculator/
├── index.html                    # Vite entry point
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript compiler config
├── src/
│   ├── main.tsx                 # React app entry point
│   ├── App.tsx                  # Root component with providers
│   ├── components/              # React components
│   │   ├── Calculator/
│   │   │   ├── CalculatorForm.tsx    # Main form with Material UI
│   │   │   ├── DateInput.tsx         # MUI DatePicker wrapper
│   │   │   └── GestationalAgeInput.tsx # Custom number inputs
│   │   ├── Results/
│   │   │   ├── ResultsDisplay.tsx    # Results container
│   │   │   ├── AgeResult.tsx         # Individual age display
│   │   │   └── AdditionalInfo.tsx    # Insights and recommendations
│   │   ├── Layout/
│   │   │   ├── Header.tsx            # App header with help
│   │   │   ├── Footer.tsx            # App footer
│   │   │   └── HelpPanel.tsx         # Educational content
│   │   └── Common/
│   │       ├── LoadingSpinner.tsx    # Loading states
│   │       └── ErrorBoundary.tsx     # Error handling
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCalculator.ts         # Calculator state management
│   │   ├── useValidation.ts         # Form validation logic
│   │   └── useLocalStorage.ts       # Persistence utility
│   ├── lib/                     # Core business logic
│   │   ├── calculator.ts            # Type-safe calculations
│   │   ├── validation.ts            # Input validation
│   │   └── utils.ts                # Utility functions
│   ├── types/                   # TypeScript definitions
│   │   ├── calculator.ts            # Calculation types
│   │   └── validation.ts            # Validation types
│   ├── theme/                   # Material UI theme
│   │   ├── theme.ts                # Custom theme config
│   │   └── components.ts           # Component overrides
│   └── __tests__/              # Test files
│       ├── components/             # Component tests
│       ├── lib/                   # Logic tests  
│       └── hooks/                 # Hook tests
├── public/
│   └── assets/                 # Static assets
└── docs/                       # Documentation
```

## Core React TypeScript Components

### 1. Calculator Logic (`src/lib/calculator.ts`)
Type-safe calculation engine with comprehensive error handling.

**Key Functions**:
```typescript
// Type-safe core calculation functions
export const calculateChronologicalAge = (
  birthDate: Date, 
  currentDate: Date
): ChronologicalAgeResult => { /* ... */ }

export const calculateCorrectedAge = (
  birthDate: Date,
  gestationalAge: GestationalAge,
  currentDate: Date
): CorrectedAgeResult => { /* ... */ }

export const calculatePostmenstrualAge = (
  birthDate: Date,
  gestationalAge: GestationalAge,
  currentDate: Date
): PostmenstrualAgeResult => { /* ... */ }

// Utility functions with strict typing
export const parseGestationalAge = (weeks: number, days: number): GestationalAge
export const formatAgeResult = (totalDays: number): AgeResult
export const validateCalculationInputs = (inputs: CalculatorInputs): boolean
```

**TypeScript Interfaces**:
```typescript
// Comprehensive age representation
interface AgeResult {
  totalDays: number;
  weeks: number;
  days: number;
  months: number;
  years: number;
  primaryDisplay: string;
  secondaryDisplay: string;
}

// Strict gestational age typing
interface GestationalAge {
  weeks: number;        // 20-44 inclusive
  days: number;         // 0-6 inclusive
  totalDays: number;    // calculated: weeks * 7 + days
}
```

### 2. React Components (`src/components/`)
Material UI-based components with TypeScript props and state management.

**Calculator Form Component**:
```typescript
interface CalculatorFormProps {
  onSubmit: (data: CalculatorInputs) => void;
  isLoading: boolean;
  validationErrors: Record<string, string>;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
  onSubmit, 
  isLoading, 
  validationErrors 
}) => {
  // Material UI form implementation with type-safe state
};
```

**Results Display Component**:
```typescript
interface ResultsDisplayProps {
  results: CalculationResults;
  onClear: () => void;
  onPrint: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  results, 
  onClear, 
  onPrint 
}) => {
  // Material UI Cards and Typography for results
};
```

### 3. Custom Hooks (`src/hooks/`)
Type-safe React hooks for state management and side effects.

**Calculator Hook**:
```typescript
interface UseCalculatorReturn {
  state: CalculatorState;
  actions: {
    calculate: (inputs: CalculatorInputs) => Promise<void>;
    clear: () => void;
    updateInput: (field: keyof CalculatorInputs, value: any) => void;
  };
}

export const useCalculator = (): UseCalculatorReturn => {
  // React state management with TypeScript
};
```

**Validation Hook**:
```typescript
interface UseValidationReturn {
  errors: Record<string, string>;
  validateField: (field: string, value: any) => boolean;
  validateAll: (inputs: CalculatorInputs) => boolean;
  clearErrors: () => void;
}

export const useValidation = (): UseValidationReturn => {
  // Form validation with Material UI integration
};
```

### 4. Material UI Theme (`src/theme/`)
Custom theme configuration for medical application styling.

**Theme Configuration**:
```typescript
import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#2563eb',      // Medical blue
      light: '#dbeafe',
      dark: '#1d4ed8'
    },
    secondary: {
      main: '#059669',      // Success green
      light: '#d1fae5',
      dark: '#047857'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 500 }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    }
  }
};

export const theme = createTheme(themeOptions);
```

## React Data Flow

### Component Data Flow
```typescript
// React Context for global state
interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}

const CalculatorContext = React.createContext<CalculatorContextType | undefined>(undefined);

// Custom hook for accessing calculator state
export const useCalculatorContext = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext must be used within CalculatorProvider');
  }
  return context;
};
```

### Type-Safe State Management Flow
```
User Input (Material UI) → 
useValidation Hook → 
Form State Update → 
React Context Dispatch → 
Calculator Logic → 
Results State Update → 
Material UI Display Components
```

### Error Handling with React Error Boundaries
```typescript
class CalculatorErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calculator Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <CalculatorErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
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
