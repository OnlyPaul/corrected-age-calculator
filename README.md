# Neonatal Age Tools

A clinical calculator for computing corrected age, postmenstrual age (PMA), and postnatal age (PNA) for neonatal and pediatric patients. This tool is designed for healthcare professionals working with premature infants and provides clinically accurate age calculations following established medical guidelines.

## Features

- **Corrected Age Calculator**: Adjusts chronological age for prematurity by accounting for gestational age at birth
- **Postmenstrual Age (PMA)**: Calculates gestational age + postnatal age for medication dosing and clinical assessments
- **Postnatal Age (PNA)**: Standard chronological age since birth
- **Clinical Guidelines**: Built-in reference information about when and how to use each age calculation
- **Privacy-First**: All calculations performed locally in the browser - no patient data transmitted or stored
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Comfortable viewing in any clinical environment

## Clinical Use Cases

This calculator is particularly useful for:

- **Developmental Assessments**: Use corrected age for milestone tracking in premature infants
- **Growth Monitoring**: Plot corrected age on growth charts for accurate assessment
- **Medication Dosing**: Use PMA for age-dependent drug protocols in neonatal care
- **Clinical Documentation**: Ensure consistent age calculations across healthcare teams
- **Parent Education**: Help families understand their premature infant's development timeline

## Usage

1. **Enter Birth Date**: The infant's actual date of birth
2. **Set Assessment Date**: Date for calculation (defaults to today)
3. **Input Gestational Age**: Weeks and days at birth (22-42 weeks supported)
4. **Choose Correction**: Toggle corrected age calculation (recommended for premature infants < 37 weeks)

The calculator will display:
- Postnatal age in weeks and days
- Postmenstrual age in weeks and days  
- Corrected age in weeks/days and calendar format (years, months, weeks, days)

## Clinical Guidelines

- **Corrected Age**: Recommended for premature infants (< 37 weeks GA) until 24 months of age
- **Term Reference**: Uses 40 weeks gestational age as the term reference point
- **Immunizations**: Always use chronological age (PNA), not corrected age, for vaccination schedules
- **Documentation**: Follow your institution's specific protocols for age reporting

## Technology Stack

Built with modern web technologies for reliability and performance:

- **React 19** with TypeScript for type-safe development
- **Material-UI (MUI)** for professional clinical interface design
- **Vite** for fast development and optimized builds
- **date-fns** for robust date calculations
- **Zod** for input validation and data integrity
- **React Hook Form** for efficient form handling

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd draft

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Privacy & Security

- **Local Processing**: All calculations performed in your browser
- **No Data Collection**: No personal or medical information is transmitted or stored
- **HIPAA Compliant**: Tool processes no PHI and can be used in clinical environments
- **Offline Capable**: Works without internet connection once loaded

## Medical Disclaimer

This calculator is for educational and clinical reference purposes. Always consult with qualified healthcare professionals for medical decisions and follow your institution's specific protocols and guidelines. The tool provides calculations based on established clinical formulas but should not replace clinical judgment.
