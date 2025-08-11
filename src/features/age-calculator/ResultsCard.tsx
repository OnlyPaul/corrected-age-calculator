import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation'
import TodayIcon from '@mui/icons-material/Today'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import type { CalculatorResults, AgeBreakdown, WeeksDays } from '../../domain/age/types'

function formatAgeDisplay(weeksDays: WeeksDays, calendar: AgeBreakdown): { primary: string; secondary: string } {
  // If there are years or months, show the calendar format as primary
  if (calendar.years > 0 || calendar.months > 0) {
    const parts = []
    if (calendar.years > 0) parts.push(`${calendar.years} y`)
    if (calendar.months > 0) parts.push(`${calendar.months} mo`)
    const primary = parts.join(' · ')
    const secondary = `${weeksDays.weeks} wk ${weeksDays.days} d`
    return { primary, secondary }
  }
  
  // For younger babies, show weeks and days as primary
  const primary = `${weeksDays.weeks} wk ${weeksDays.days} d`
  const secondary = ''
  return { primary, secondary }
}

function formatSmartCalendar(calendar: AgeBreakdown): string {
  const parts = []
  if (calendar.years > 0) parts.push(`${calendar.years} y`)
  if (calendar.months > 0) parts.push(`${calendar.months} mo`)
  if (calendar.weeks > 0) parts.push(`${calendar.weeks} wk`)
  if (calendar.days > 0) parts.push(`${calendar.days} d`)
  
  // If no components, show "0 d"
  if (parts.length === 0) return '0 d'
  
  return parts.join(' · ')
}



function AgeTimeline({ gaBirthWeeks, pmaDays, isPremature }: {
  gaBirthWeeks: number
  pmaDays: number
  isPremature: boolean
}) {
  const termWeeks = 40
  const maxTimelineWeeks = Math.max(termWeeks + 12, pmaDays / 7) // Show at least 52 weeks or current age + 12 weeks
  
  // Calculate positions as percentages
  const birthPosition = (gaBirthWeeks / maxTimelineWeeks) * 100
  const termPosition = (termWeeks / maxTimelineWeeks) * 100
  const currentPosition = ((pmaDays / 7) / maxTimelineWeeks) * 100
  
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        borderRadius: 3,
        background: (theme) => 
          theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)'
            : 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
        Age Timeline (Gestational + Postnatal)
      </Typography>
      
      <Box sx={{ position: 'relative', mt: 4, mb: 5 }}>
        {/* Timeline background bar */}
        <Box
          sx={{
            height: 12,
            borderRadius: 6,
            bgcolor: 'grey.100',
            border: (theme) => `1px solid ${theme.palette.grey[200]}`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Progress fill with gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${currentPosition}%`,
              background: isPremature 
                ? 'linear-gradient(90deg, #ffb74d,rgb(250, 185, 196))'
                : 'linear-gradient(90deg, #42a5f5,rgb(239, 180, 245))',
              borderRadius: 6,
              transition: 'width 0.3s ease-in-out',
            }}
          />
        </Box>
        
        {/* Birth marker */}
        <Box sx={{ 
          position: 'absolute', 
          left: `${birthPosition}%`, 
          top: -16, 
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: (theme) => `3px solid ${isPremature ? '#f57c00' : theme.palette.primary.main}`,
              transform: 'translateY(5px)',
            }}
          >
            <BabyChangingStationIcon 
              sx={{ 
                color: isPremature ? '#f57c00' : 'primary.main', 
                fontSize: 16
              }} 
            />
          </Box>
        </Box>
        
        {/* Term marker (only show if premature) */}
        {isPremature && (
          <Box sx={{ 
            position: 'absolute', 
            left: `${termPosition}%`, 
            top: -16, 
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: '3px solid #2e7d32',
                transform: 'translateY(5px)',
              }}
            >
              <CalendarMonthIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
            </Box>
          </Box>
        )}
        
        {/* Current age marker */}
        <Box sx={{ 
          position: 'absolute', 
          left: `${currentPosition}%`, 
          top: -16, 
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: '3px solid #1565c0',
              transform: 'translateY(5px)',
            }}
          >
            <TodayIcon sx={{ color: '#1565c0', fontSize: 16 }} />
          </Box>
        </Box>
      </Box>
      
      {/* Legend */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={3} 
        sx={{ 
          mt: 3,
          pt: 2,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        justifyContent="center"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              border: (theme) => `2px solid ${isPremature ? '#f57c00' : theme.palette.primary.main}`,
            }}
          >
            <BabyChangingStationIcon 
              sx={{ 
                color: isPremature ? '#f57c00' : 'primary.main', 
                fontSize: 12 
              }} 
            />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Birth ({gaBirthWeeks.toFixed(1)} wk GA)
          </Typography>
        </Box>
        
        {isPremature && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                border: '2px solid #2e7d32',
              }}
            >
              <CalendarMonthIcon sx={{ color: '#2e7d32', fontSize: 12 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Term (40 wk GA)
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              border: '2px solid #1565c0',
            }}
          >
            <TodayIcon sx={{ color: '#1565c0', fontSize: 12 }} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Current ({(pmaDays / 7).toFixed(1)} wk PMA)
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

export default function ResultsCard({ results }: { results: CalculatorResults }) {
  const { pna, pnaDays, pma, corrected, metadata } = results

  // Format postnatal age display
  const pnaDisplay = formatAgeDisplay(pna.weeksDays, pna.calendar)

  // Determine if correction should be recommended based on clinical guidelines
  const shouldRecommendCorrection = metadata.isPremature && !metadata.isCorrectionApplied
  const correctionAppliedAppropriately = metadata.isPremature && metadata.isCorrectionApplied

  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }} aria-live="polite" aria-atomic role="region" aria-labelledby="results-heading">
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Typography id="results-heading" variant="h5" component="h2">
          Age Calculation Results
        </Typography>
        
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Stat 
              label="Postnatal age" 
              value={pnaDisplay.primary} 
              sub={pnaDisplay.secondary || `${pnaDays} days total`}
              description="Time since birth"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Stat 
              label="Postmenstrual age (PMA)" 
              value={`${pma.weeks} wk ${pma.days} d`}
              description="Gestational age at birth + postnatal age"
            />
          </Grid>
          
          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Stat
              label="Corrected age (weeks+days)"
              value={`${corrected.weeksDays.weeks} wk ${corrected.weeksDays.days} d`}
              sub={`${corrected.days} days total`}
              description="Age adjusted for prematurity"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Stat
              label="Corrected age (calendar)"
              value={formatSmartCalendar(corrected.calendar)}
              description="Calendar representation of corrected age"
            />
          </Grid>
        </Grid>

        {/* Age Timeline Visualization */}
        <AgeTimeline 
          gaBirthWeeks={metadata.gaBirthWeeks}
          pmaDays={results.pmaDays}
          isPremature={metadata.isPremature}
        />

        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {metadata.isCorrectionApplied && (
              <Chip
                size="small"
                icon={<CheckCircleIcon />}
                label="Correction Applied"
                color="success"
                variant="outlined"
              />
            )}
            
            {metadata.isPremature && (
              <Chip
                size="small"
                icon={<InfoIcon />}
                label={`Premature (${metadata.gaBirthWeeks.toFixed(1)} wk GA)`}
                color="info"
                variant="outlined"
              />
            )}
            
            {correctionAppliedAppropriately && (
              <Chip
                size="small"
                icon={<InfoIcon />}
                label={`Recommended until ${metadata.correctionRecommendedUntilMonths} months`}
                color="primary"
                variant="outlined"
              />
            )}
            
            {shouldRecommendCorrection && (
              <Chip
                size="small"
                icon={<WarningIcon />}
                label="Consider enabling correction"
                color="warning"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function Stat({ 
  label, 
  value, 
  sub, 
  description 
}: { 
  label: string; 
  value: string; 
  sub?: string; 
  description?: string 
}) {
  return (
    <Stack spacing={0.5}>
      <Typography 
        variant="overline" 
        color="text.secondary"
        component="dt"
        title={description}
      >
        {label}
      </Typography>
      <Typography variant="h6" component="dd" sx={{ m: 0 }}>
        {value}
      </Typography>
      {sub ? (
        <Typography variant="body2" color="text.secondary" component="dd" sx={{ m: 0 }}>
          {sub}
        </Typography>
      ) : null}
    </Stack>
  )
}


