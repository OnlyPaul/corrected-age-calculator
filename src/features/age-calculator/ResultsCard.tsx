import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import type { CalculatorResults } from '../../domain/age/types'

export default function ResultsCard({ results }: { results: CalculatorResults }) {
  const { pna, pnaDays, pma, corrected, metadata } = results

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
              value={`${pna.weeks} wk ${pna.days} d`} 
              sub={`${pnaDays} days total`}
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
              value={`${corrected.calendar.years} y · ${corrected.calendar.months} mo`}
              sub={`${corrected.calendar.weeks} wk ${corrected.calendar.days} d`}
              description="Calendar representation of corrected age"
            />
          </Grid>
        </Grid>

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


