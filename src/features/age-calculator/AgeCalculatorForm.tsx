import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Info } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, useForm } from 'react-hook-form'
import { CalculatorInputsSchema } from '../../domain/age/schemas'
import type { z } from 'zod'
import { useEffect, useMemo } from 'react'

type CalculatorInputs = z.infer<typeof CalculatorInputsSchema>

export function AgeCalculatorForm({
  onSubmit,
  onValuesChange,
}: {
  onSubmit?: (data: CalculatorInputs) => void
  onValuesChange?: (data: CalculatorInputs, isValid: boolean) => void
}) {
  const today = new Date()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CalculatorInputs>({
    resolver: zodResolver(CalculatorInputsSchema),
    defaultValues: {
      birthDate: today,
      assessmentDate: today,
      gaBirth: { weeks: 35, days: 0 },
      useCorrection: true,
    },
    mode: 'onChange',
  })

  const submit = handleSubmit((values) => {
    onSubmit?.(values)
  })

  const values = watch()
  
  // Memoize the values to prevent unnecessary re-renders when object reference changes
  const memoizedValues = useMemo(() => values, [
    values.birthDate?.getTime(),
    values.assessmentDate?.getTime(), 
    values.gaBirth?.weeks,
    values.gaBirth?.days,
    values.useCorrection
  ])
  
  useEffect(() => {
    onValuesChange?.(memoizedValues, isValid)
  }, [memoizedValues, isValid, onValuesChange])

  return (
    <Box component="form" onSubmit={submit} noValidate aria-labelledby="calculator-heading">
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Birth date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.birthDate,
                      helperText: errors.birthDate?.message || "Enter the infant's date of birth",
                      'aria-describedby': 'birth-date-help',
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <Controller
              name="assessmentDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Assessment date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.assessmentDate,
                      helperText: errors.assessmentDate?.message || "Date for age calculation (defaults to today)",
                      'aria-describedby': 'assessment-date-help',
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" component="h4" gutterBottom>
                Gestational Age at Birth
              </Typography>
              <Tooltip title="Enter the gestational age when the infant was born (typically 22-42 weeks)">
                <IconButton size="small" aria-label="gestational age information">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <TextField
              label="Weeks"
              type="number"
              inputProps={{ 
                min: 22, 
                max: 42, 
                'aria-describedby': 'ga-weeks-help',
                step: 1 
              }}
              fullWidth
              error={!!errors.gaBirth?.weeks}
              helperText={errors.gaBirth?.weeks?.message || "22-42 weeks"}
              {...register('gaBirth.weeks', { valueAsNumber: true })}
            />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <TextField
              label="Days"
              type="number"
              inputProps={{ 
                min: 0, 
                max: 6, 
                'aria-describedby': 'ga-days-help',
                step: 1 
              }}
              fullWidth
              error={!!errors.gaBirth?.days}
              helperText={errors.gaBirth?.days?.message || "0-6 days"}
              {...register('gaBirth.days', { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={12}>
            <FormControl>
              <FormControlLabel
                control={
                  <Switch 
                    defaultChecked 
                    {...register('useCorrection')}
                    inputProps={{ 'aria-describedby': 'correction-help' }}
                  />
                }
                label="Apply corrected age calculation"
              />
              <FormHelperText 
                id="correction-help"
                error={!!errors.useCorrection}
              >
                {errors.useCorrection?.message || 
                 "Recommended for premature infants (< 37 weeks GA) until 24 months of age"}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default AgeCalculatorForm


