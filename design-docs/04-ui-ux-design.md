# UI/UX Design Specification (Material UI)

## Design Philosophy

The application follows Material Design principles combined with medical device design standards: **clarity, consistency, and efficiency**. The interface leverages Material UI components to provide a familiar, accessible experience for healthcare professionals and parents while maintaining medical accuracy and professional appearance.

### Design Principles
1. **Material Design Clarity**: Consistent visual hierarchy using Material UI Typography and spacing
2. **Error Prevention**: Material UI form validation with clear error states and helpful messaging
3. **Immediate Feedback**: Real-time validation with Material UI Snackbar notifications and input states
4. **Accessibility**: WCAG 2.1 AA compliance through Material UI's built-in accessibility features
5. **Responsive Design**: Material UI Grid system for optimal mobile and desktop experiences
6. **Progressive Disclosure**: Material UI Accordion and Dialog components for layered information

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

## Material UI Information Architecture

### Component Hierarchy with Material UI
```typescript
// React component structure with Material UI
<ThemeProvider theme={customTheme}>
  <CssBaseline />
  <Container maxWidth="lg">
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5">Corrected Age Calculator</Typography>
        <IconButton onClick={handleHelpToggle}>
          <HelpIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2}>
          <Box p={3}>
            <Typography variant="h6">Input Information</Typography>
            <DatePicker label="Date of Birth" />
            <TextField label="Gestational Weeks" type="number" />
            <TextField label="Gestational Days" type="number" />
            <Button variant="contained" size="large">
              Calculate Ages
            </Button>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Results</Typography>
            <ResultsDisplay results={calculationResults} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    
    <Dialog open={helpOpen}>
      <DialogTitle>Help & Information</DialogTitle>
      <DialogContent>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Calculation Explanations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Educational content */}
          </AccordionDetails>
        </Accordion>
      </DialogContent>
    </Dialog>
  </Container>
</ThemeProvider>
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

## Material UI Component Layouts

### Mobile Layout (Material UI Grid)
```typescript
// Mobile-first responsive layout using Material UI
<Container maxWidth="sm">
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        🍼 Corrected Age Calculator
      </Typography>
      <IconButton color="inherit" onClick={handleHelpOpen}>
        <HelpIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
  
  <Box sx={{ mt: 2 }}>
    <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Input Information
      </Typography>
      
      <Stack spacing={3}>
        <DatePicker
          label="Date of Birth"
          value={birthDate}
          onChange={setBirthDate}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Weeks"
            type="number"
            inputProps={{ min: 20, max: 44 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Days"
            type="number"
            inputProps={{ min: 0, max: 6 }}
            sx={{ flex: 1 }}
          />
        </Box>
        
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<CalculateIcon />}
          onClick={handleCalculate}
        >
          Calculate Ages
        </Button>
      </Stack>
    </Paper>
    
    <Collapse in={hasResults}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <ResultCards results={results} />
        </CardContent>
      </Card>
    </Collapse>
  </Box>
</Container>
```

### Desktop Layout (Material UI Responsive Grid)
```typescript
// Desktop layout with side-by-side panels
<Container maxWidth="lg">
  <Grid container spacing={3}>
    {/* Input Panel */}
    <Grid item xs={12} md={6}>
      <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
        <Typography variant="h5" gutterBottom>
          Input Information
        </Typography>
        <InputForm onSubmit={handleCalculate} />
      </Paper>
    </Grid>
    
    {/* Results Panel */}
    <Grid item xs={12} md={6}>
      <Fade in={hasResults}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Calculation Results
          </Typography>
          
          <Stack spacing={2}>
            <ResultCard
              title="Corrected Age"
              value={results.corrected}
              color="primary"
              icon={<BabyIcon />}
            />
            <ResultCard
              title="Postmenstrual Age"
              value={results.postmenstrual}
              color="secondary"
              icon={<TimeIcon />}
            />
            <ResultCard
              title="Chronological Age"
              value={results.chronological}
              color="grey"
              icon={<CalendarIcon />}
            />
          </Stack>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button startIcon={<PrintIcon />} onClick={handlePrint}>
              Print
            </Button>
            <Button startIcon={<ShareIcon />} onClick={handleShare}>
              Share
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Grid>
  </Grid>
</Container>
```

## Material UI Design System

### Custom Theme Configuration
```typescript
import { createTheme } from '@mui/material/styles';

export const medicalTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',        // Medical blue - trust and reliability
      light: '#dbeafe',       // Light blue for backgrounds
      dark: '#1d4ed8',        // Dark blue for emphasis
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#059669',        // Success green - positive results
      light: '#d1fae5',       // Light green backgrounds
      dark: '#047857',        // Dark green for emphasis
      contrastText: '#ffffff'
    },
    error: {
      main: '#dc2626',        // Error red - validation issues
      light: '#fecaca',       // Light red for backgrounds
      dark: '#991b1b'         // Dark red for emphasis
    },
    warning: {
      main: '#d97706',        // Warning orange - alerts
      light: '#fed7aa',       // Light orange backgrounds
      dark: '#92400e'         // Dark orange for emphasis
    },
    info: {
      main: '#6b7280',        // Info gray - secondary information
      light: '#f3f4f6',       // Light gray backgrounds
      dark: '#374151'         // Dark gray for text
    }
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 500, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 },
    h6: { fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 }
  },
  
  spacing: 8, // 8px base unit for consistent spacing
  
  shape: {
    borderRadius: 8 // Consistent border radius
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Remove default uppercase
          fontWeight: 500,
          borderRadius: 8
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1.125rem'
        }
      }
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb'
            }
          }
        }
      }
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});
```

### Responsive Breakpoints
```typescript
// Material UI responsive breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,      // Mobile
      sm: 640,    // Small tablet
      md: 1024,   // Desktop
      lg: 1280,   // Large desktop
      xl: 1920    // Extra large
    }
  }
});

// Usage in components
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4)
    }
  }
}));
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
