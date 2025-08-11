import { addDays, differenceInCalendarDays, intervalToDuration } from 'date-fns'
import type {
  AgeBreakdown,
  GestationalAge,
  WeeksDays,
  CalculatorInputs,
  CalculatorResults,
} from './types'

export function toDaysFromWeeksDays(weeksDays: WeeksDays): number {
  if (!Number.isFinite(weeksDays.weeks) || !Number.isFinite(weeksDays.days)) {
    throw new Error('Invalid weeks/days input')
  }
  if (weeksDays.days < 0 || weeksDays.days > 6) {
    throw new Error('Days must be in [0..6]')
  }
  if (weeksDays.weeks < 0) {
    throw new Error('Weeks must be non-negative')
  }
  return weeksDays.weeks * 7 + weeksDays.days
}

export function toWeeksDaysFromDays(totalDays: number): WeeksDays {
  if (!Number.isFinite(totalDays) || totalDays < 0) {
    throw new Error('totalDays must be a non-negative finite number')
  }
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7
  return { weeks, days }
}

function toUtcStartOfDay(date: Date): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid Date')
  }
  // Create a date at UTC midnight for the same calendar date
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function calcPnaDays(birthDate: Date, assessmentDate: Date): number {
  const birthUtc = toUtcStartOfDay(birthDate)
  const assessmentUtc = toUtcStartOfDay(assessmentDate)
  const diff = differenceInCalendarDays(assessmentUtc, birthUtc)
  if (diff < 0) {
    throw new Error('Assessment date must be on or after birth date')
  }
  return diff
}

export function calcPmaDays(gaBirthDays: number, pnaDays: number): number {
  if (!Number.isFinite(gaBirthDays) || gaBirthDays < 0) {
    throw new Error('gaBirthDays must be non-negative')
  }
  if (!Number.isFinite(pnaDays) || pnaDays < 0) {
    throw new Error('pnaDays must be non-negative')
  }
  return gaBirthDays + pnaDays
}

export function calcCorrectionDays(gaBirthDays: number, termWeeks: number = 40): number {
  if (!Number.isFinite(gaBirthDays) || gaBirthDays < 0) {
    throw new Error('gaBirthDays must be non-negative')
  }
  if (!Number.isFinite(termWeeks) || termWeeks <= 0) {
    throw new Error('termWeeks must be positive')
  }
  const termDays = termWeeks * 7
  return Math.max(0, termDays - gaBirthDays)
}

export function calcCorrectedAgeDays(pnaDays: number, correctionDays: number): number {
  if (!Number.isFinite(pnaDays) || pnaDays < 0) {
    throw new Error('pnaDays must be non-negative')
  }
  if (!Number.isFinite(correctionDays) || correctionDays < 0) {
    throw new Error('correctionDays must be non-negative')
  }
  return Math.max(0, pnaDays - correctionDays)
}

export function calcCalendarBreakdownFromCorrected(
  birthDate: Date,
  correctionDays: number,
  assessmentDate: Date,
): AgeBreakdown {
  const correctedBirthDate = addDays(toUtcStartOfDay(birthDate), correctionDays)
  const assessmentUtc = toUtcStartOfDay(assessmentDate)
  if (assessmentUtc.getTime() < correctedBirthDate.getTime()) {
    return { years: 0, months: 0, weeks: 0, days: 0 }
  }
  const duration = intervalToDuration({ start: correctedBirthDate, end: assessmentUtc })
  const years = duration.years ?? 0
  const months = duration.months ?? 0
  const daysTotal = duration.days ?? 0
  const weeks = Math.floor(daysTotal / 7)
  const days = daysTotal % 7
  return { years, months, weeks, days }
}

export function calcCalendarBreakdownFromBirth(
  birthDate: Date,
  assessmentDate: Date,
): AgeBreakdown {
  const birthUtc = toUtcStartOfDay(birthDate)
  const assessmentUtc = toUtcStartOfDay(assessmentDate)
  if (assessmentUtc.getTime() < birthUtc.getTime()) {
    return { years: 0, months: 0, weeks: 0, days: 0 }
  }
  const duration = intervalToDuration({ start: birthUtc, end: assessmentUtc })
  const years = duration.years ?? 0
  const months = duration.months ?? 0
  const daysTotal = duration.days ?? 0
  const weeks = Math.floor(daysTotal / 7)
  const days = daysTotal % 7
  return { years, months, weeks, days }
}

export function validateGestationalAge(ga: GestationalAge): void {
  if (!Number.isFinite(ga.weeks) || !Number.isFinite(ga.days)) {
    throw new Error('Invalid gestational age')
  }
  if (ga.weeks < 22 || ga.weeks > 42) {
    throw new Error('Gestational age weeks must be in [22..42]')
  }
  if (ga.days < 0 || ga.days > 6) {
    throw new Error('Gestational age days must be in [0..6]')
  }
}

export function computeCalculatorResults(inputs: CalculatorInputs): CalculatorResults {
  const pnaDays = calcPnaDays(inputs.birthDate, inputs.assessmentDate)
  const gaBirthDays = toDaysFromWeeksDays(inputs.gaBirth)
  const pmaDays = calcPmaDays(gaBirthDays, pnaDays)
  const correctionDays = inputs.useCorrection ? calcCorrectionDays(gaBirthDays, 40) : 0
  const correctedDays = calcCorrectedAgeDays(pnaDays, correctionDays)
  const correctedWeeksDays = toWeeksDaysFromDays(correctedDays)
  const correctedCalendar = calcCalendarBreakdownFromCorrected(
    inputs.birthDate,
    correctionDays,
    inputs.assessmentDate,
  )
  const pnaCalendar = calcCalendarBreakdownFromBirth(inputs.birthDate, inputs.assessmentDate)

  // Calculate metadata
  const gaBirthWeeks = inputs.gaBirth.weeks + inputs.gaBirth.days / 7
  const isPremature = gaBirthWeeks < 37
  const isCorrectionApplied = inputs.useCorrection && correctionDays > 0
  const correctionRecommendedUntilMonths = 24 // Standard clinical recommendation

  return {
    pna: {
      weeksDays: toWeeksDaysFromDays(pnaDays),
      calendar: pnaCalendar,
    },
    pnaDays,
    pma: toWeeksDaysFromDays(pmaDays),
    pmaDays,
    corrected: {
      weeksDays: correctedWeeksDays,
      days: correctedDays,
      calendar: correctedCalendar,
    },
    metadata: {
      isCorrectionApplied,
      isPremature,
      correctionRecommendedUntilMonths,
      gaBirthWeeks,
    },
  }
}


