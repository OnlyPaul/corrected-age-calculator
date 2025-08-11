import { useCallback, useContext, useState } from 'react'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Paper,
  Stack,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { ColorModeContext } from './styles/ColorModeContext'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import AgeCalculatorForm from './features/age-calculator/AgeCalculatorForm'
import ResultsCard from './features/age-calculator/ResultsCard'
import InfoPanel from './features/age-calculator/InfoPanel'
import { computeCalculatorResults } from './domain/age/utils'
import { useTheme } from '@mui/material/styles'
import type { CalculatorInputs, CalculatorResults } from './domain/age/types'

function App() {
  const { toggleColorMode } = useContext(ColorModeContext)
  const theme = useTheme()
  const [results, setResults] = useState<CalculatorResults | null>(null)

  const handleValuesChange = useCallback((values: CalculatorInputs, isValid: boolean) => {
    // Additional safety checks beyond form validation
    const isValidData = isValid && 
      Number.isFinite(values.gaBirth?.weeks) && 
      Number.isFinite(values.gaBirth?.days) &&
      values.gaBirth?.weeks >= 22 && values.gaBirth?.weeks <= 42 &&
      values.gaBirth?.days >= 0 && values.gaBirth?.days <= 6;
    
    if (isValidData) {
      try {
        setResults(computeCalculatorResults(values))
      } catch (error) {
        // Gracefully handle any unexpected errors
        console.warn('Calculation error:', error)
        setResults(null)
      }
    } else {
      setResults(null)
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #faf8ff 0%, #f3efff 100%)'
            : 'linear-gradient(180deg,rgb(58, 58, 58) 0%,rgb(49, 22, 33) 100%)',
      }}
    >
      <AppBar position="sticky" color="transparent" enableColorOnDark sx={{ backdropFilter: 'blur(6px)' }}>
        <Toolbar>
          <IconButton 
            size="large" 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ mr: 2 }}
            tabIndex={0}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Neonatal Age Tools
          </Typography>
          <IconButton
            color="inherit"
            aria-label={`Switch to ${theme.palette.mode === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleColorMode}
            sx={{
              ml: 1,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(15deg)',
                bgcolor: 'action.hover',
              },
            }}
          >
            {theme.palette.mode === 'light' ? (
              <DarkModeOutlinedIcon sx={{ fontSize: 24 }} />
            ) : (
              <LightModeOutlinedIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, md: 6 }, 
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
            <Stack spacing={4}>
              <Box component="header" textAlign="center">
                <Typography variant="h2" component="h2" gutterBottom>
                  Corrected Age and PMA Calculator
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Compute postnatal age, postmenstrual age, and corrected age with clinically consistent rules.
                </Typography>
              </Box>

              {/* Two-column layout for calculator and results on wide screens */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  gap: 4,
                  alignItems: 'stretch'
                }}
              >
                {/* Calculator Column */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <Paper sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }} component="section" aria-labelledby="calculator-heading">
                    <Typography id="calculator-heading" variant="h5" component="h5" gutterBottom sx={{ marginBottom: 4 }}>
                      Age Calculator
                    </Typography>
                    <AgeCalculatorForm
                      onValuesChange={handleValuesChange}
                    />
                  </Paper>
                </Box>

                {/* Results Column */}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  {results ? (
                    <Box component="section" aria-labelledby="results-section" sx={{ height: '100%' }}>
                      <ResultsCard results={results} />
                    </Box>
                  ) : (
                    <Paper 
                      sx={{ 
                        p: { xs: 2, md: 4 }, 
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        bgcolor: 'action.hover'
                      }}
                    >
                      <Box textAlign="center">
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Results will appear here
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enter the birth date and gestational age to see calculated ages
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </Box>
              </Box>

              <Box component="section" aria-labelledby="info-section">
                <InfoPanel />
              </Box>
            </Stack>
          </Box>
        </LocalizationProvider>
      </Container>
    </Box>
  )
}

export default App
