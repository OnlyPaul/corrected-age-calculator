# UI/UX Design Specification

## Design Philosophy

The application follows principles of medical device design: **clarity, accuracy, and efficiency**. The interface prioritizes usability for healthcare professionals working in fast-paced environments while remaining accessible to parents and caregivers.

### Design Principles
1. **Clarity First**: All information is clearly labeled and easy to understand
2. **Error Prevention**: Design prevents common input mistakes
3. **Immediate Feedback**: Real-time validation and calculation updates
4. **Accessibility**: Usable by all users regardless of abilities
5. **Mobile-First**: Optimized for use on phones and tablets
6. **Minimal Cognitive Load**: Reduce mental effort required to use the app

## User Personas

### Primary Persona: Dr. Sarah Chen - Neonatologist
- **Age**: 35, experienced with technology
- **Context**: Using during rounds, needs quick calculations
- **Goals**: Fast, accurate age calculations for multiple patients
- **Pain Points**: Time pressure, small mobile screens, interruptions
- **Needs**: Quick input, clear results, ability to share/print results

### Secondary Persona: Maria Rodriguez - New Parent
- **Age**: 28, moderate technology skills
- **Context**: At home, tracking development milestones
- **Goals**: Understanding her preterm baby's development
- **Pain Points**: Medical terminology confusion, anxiety about calculations
- **Needs**: Clear explanations, educational content, reassurance

## Information Architecture

### Content Hierarchy
```
Application Title
├── Input Section
│   ├── Date of Birth
│   ├── Gestational Age at Birth
│   └── Current Date (optional)
├── Calculation Button
├── Results Section
│   ├── Corrected Age
│   ├── Postmenstrual Age
│   ├── Chronological Age (reference)
│   └── Additional Information
├── Help & Information
│   ├── Calculation Explanations
│   ├── Medical Background
│   └── Usage Examples
└── Footer
    ├── About/Credits
    └── Privacy Information
```

## User Flow Diagrams

### Primary User Flow: Quick Calculation
```
Start → Enter Birth Date → Enter Gestational Age → Calculate → View Results → Done
```

### Extended User Flow: First-Time User
```
Start → Read Help → Enter Data → Get Validation Error → Correct Input → Calculate → Read Explanations → Save/Share → Done
```

### Error Recovery Flow
```
Input Error → See Error Message → Read Help Text → Correct Input → Try Again → Success
```

## Wireframes

### Mobile Layout (Primary)
```
┌─────────────────────┐
│ Corrected Age Calc  │  ← Header with title
├─────────────────────┤
│ 📅 Date of Birth    │  ← Input section
│ [MM/DD/YYYY]        │    with icons
│                     │
│ 🤱 Gestational Age  │
│ [##] weeks [#] days │
│                     │
│ 📅 Current Date     │
│ [Today] [Custom]    │
│                     │
│ [CALCULATE AGES]    │  ← Large CTA button
├─────────────────────┤
│ Results             │  ← Results section
│ Corrected Age       │    (hidden until calc)
│ ## weeks ## days    │
│                     │
│ Postmenstrual Age   │
│ ## weeks ## days    │
│                     │
│ [More Info] [Help]  │  ← Action buttons
└─────────────────────┘
```

### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│ 🍼 Corrected Age Calculator                    [?] Help │  ← Header
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Input Information          │  Results                   │  ← Two-column
│ ┌─────────────────────────┐ │ ┌───────────────────────┐  │    layout
│ │ Date of Birth           │ │ │ Corrected Age         │  │
│ │ [MM/DD/YYYY]            │ │ │ [Calculated result]   │  │
│ │                         │ │ │                       │  │
│ │ Gestational Age         │ │ │ Postmenstrual Age     │  │
│ │ [##] weeks [#] days     │ │ │ [Calculated result]   │  │
│ │                         │ │ │                       │  │
│ │ Current Date            │ │ │ Additional Info       │  │
│ │ ○ Today ○ Custom Date   │ │ │ [Explanations]        │  │
│ │                         │ │ │                       │  │
│ │ [CALCULATE]             │ │ │ [Share] [Print]       │  │
│ └─────────────────────────┘ │ └───────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Visual Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563eb      /* Medical blue, trust and reliability */
--primary-light: #dbeafe    /* Light blue for backgrounds */
--primary-dark: #1d4ed8     /* Dark blue for text */

/* Semantic Colors */
--success-green: #059669    /* Successful calculations */
--warning-orange: #d97706   /* Warnings and alerts */
--error-red: #dc2626       /* Errors and validation issues */
--info-gray: #6b7280       /* Secondary information */

/* Neutral Colors */
--white: #ffffff           /* Backgrounds */
--gray-50: #f9fafb        /* Light backgrounds */
--gray-100: #f3f4f6       /* Borders and dividers */
--gray-800: #1f2937       /* Primary text */
--gray-600: #4b5563       /* Secondary text */
```

### Typography
```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;

/* Type Scale */
--text-xs: 0.75rem     /* 12px - Small labels */
--text-sm: 0.875rem    /* 14px - Body text */
--text-base: 1rem      /* 16px - Default */
--text-lg: 1.125rem    /* 18px - Input labels */
--text-xl: 1.25rem     /* 20px - Section headers */
--text-2xl: 1.5rem     /* 24px - Results */
--text-3xl: 1.875rem   /* 30px - Page title */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing System
```css
/* Spacing Scale (based on 8px grid) */
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
```

## Component Specifications

### Input Components

#### Date Input
```css
.date-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--gray-100);
    border-radius: 8px;
    font-size: var(--text-lg);
    transition: border-color 0.2s ease;
}

.date-input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.date-input.error {
    border-color: var(--error-red);
}
```

#### Gestational Age Input
- Two-part input: weeks dropdown (20-44) + days input (0-6)
- Visual connection between the two fields
- Auto-advance from weeks to days field
- Format display as "32+4" notation

#### Button Components
```css
/* Primary Button */
.btn-primary {
    background: var(--primary-blue);
    color: white;
    padding: 16px 32px;
    border: none;
    border-radius: 8px;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-primary:disabled {
    background: var(--gray-100);
    color: var(--gray-600);
    cursor: not-allowed;
}
```

### Results Display

#### Age Display Component
```html
<div class="age-result">
    <h3 class="age-type">Corrected Age</h3>
    <div class="age-value">
        <span class="primary">6 weeks 4 days</span>
        <span class="secondary">(1 month 1 week)</span>
    </div>
    <div class="age-explanation">
        <p>The age your baby would be if born at full term</p>
    </div>
</div>
```

#### Progress Indicators
- Visual timeline showing development milestones
- Term equivalent date highlighting
- Progress bars for gestational development

### Error and Help Components

#### Inline Error Messages
```html
<div class="field-error">
    <span class="error-icon">⚠️</span>
    <span class="error-text">Please enter a valid birth date</span>
</div>
```

#### Help Tooltips
- Hover/tap to reveal explanations
- Contextual help for each input field
- Progressive disclosure of complex information

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--mobile: 0px          /* Default, up to 640px */
--tablet: 640px        /* Medium devices */
--desktop: 1024px      /* Large devices */
--wide: 1280px         /* Extra large devices */
```

### Layout Adaptations

#### Mobile (< 640px)
- Single column layout
- Full-width inputs
- Stacked result cards
- Bottom-fixed calculate button
- Collapsible help sections

#### Tablet (640px - 1024px)
- Two-column layout for results
- Larger touch targets
- Side-by-side input groups
- Expanded help sections

#### Desktop (> 1024px)
- Three-column layout option
- Hover states for interactive elements
- Keyboard shortcuts
- Advanced features (print, export)

## Interaction Design

### Micro-interactions
1. **Loading States**: Subtle animation during calculation
2. **Success States**: Brief celebration animation for completed calculation
3. **Input Focus**: Smooth transitions and highlighting
4. **Error States**: Gentle shake animation for invalid inputs
5. **Help Expansion**: Smooth accordion-style expansion

### Gesture Support
- **Swipe**: Navigate between help sections on mobile
- **Pinch**: Zoom on results display for accessibility
- **Long Press**: Access additional options/context menus

### Keyboard Navigation
- **Tab Order**: Logical flow through all interactive elements
- **Enter**: Submit calculation from any input field
- **Escape**: Close help panels or error messages
- **Arrow Keys**: Navigate between related inputs

## Accessibility Features

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Live regions for dynamic content updates
- Descriptive text for calculations

### Visual Accessibility
- High contrast mode support
- Minimum 4.5:1 color contrast ratios
- Scalable text up to 200% without horizontal scrolling
- Clear visual focus indicators

### Motor Accessibility
- Large touch targets (minimum 44px)
- Generous spacing between interactive elements
- Drag-and-drop alternatives
- Voice input support

## Performance Considerations

### Loading Strategy
- Critical CSS inlined in HTML
- Progressive enhancement for advanced features
- Lazy loading of help content
- Service worker for offline functionality

### Animation Performance
- CSS transforms and opacity only
- 60fps target for all animations
- Reduced motion support for accessibility
- Hardware acceleration where appropriate

## Content Strategy

### Microcopy
- **Input Labels**: Clear, medical terminology with plain language alternatives
- **Button Text**: Action-oriented, specific ("Calculate Ages" not "Submit")
- **Error Messages**: Helpful, specific guidance for correction
- **Help Text**: Layered complexity (basic → intermediate → advanced)

### Educational Content
- Brief explanations of medical concepts
- Links to authoritative medical resources
- Examples with realistic scenarios
- Cultural sensitivity in language choices

## Testing Strategy

### Usability Testing
- Task completion rates for primary use cases
- Time to complete calculations
- Error recovery success rates
- User satisfaction surveys

### A/B Testing Opportunities
- Input field layouts and groupings
- Result presentation formats
- Help content organization
- Color schemes and visual hierarchy

### Accessibility Testing
- Screen reader compatibility testing
- Keyboard-only navigation testing
- Color contrast validation
- Cognitive accessibility evaluation
