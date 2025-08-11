import type { PaletteMode } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export function getAppTheme(mode: PaletteMode) {
  const base = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
    shape: { borderRadius: 10 },
    typography: {
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
    },
    components: {
      MuiContainer: {
        defaultProps: { maxWidth: 'md' },
      },
      MuiPaper: {
        defaultProps: { elevation: 3 },
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiButton: {
        defaultProps: { variant: 'contained' },
      },
    },
  })
  return responsiveFontSizes(base)
}


