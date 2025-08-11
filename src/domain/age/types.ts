export type AgeInDays = number

export interface WeeksDays {
  weeks: number
  days: number
}

export interface GestationalAge {
  weeks: number
  days: number
}

export interface AgeBreakdown {
  years: number
  months: number
  weeks: number
  days: number
}

export interface CalculatorInputs {
  birthDate: Date
  assessmentDate: Date
  gaBirth: GestationalAge
  useCorrection: boolean
}

export interface CalculatorResults {
  pna: {
    weeksDays: WeeksDays
    calendar: AgeBreakdown
  }
  pnaDays: number
  pma: WeeksDays
  pmaDays: number
  corrected: {
    weeksDays: WeeksDays
    days: number
    calendar: AgeBreakdown
  }
  metadata: {
    isCorrectionApplied: boolean
    isPremature: boolean
    correctionRecommendedUntilMonths: number
    gaBirthWeeks: number
  }
}


