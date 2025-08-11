import { differenceInCalendarDays } from 'date-fns'
import { z } from 'zod'

export const WeeksDaysSchema = z.object({
  weeks: z.number().int().min(0, 'weeks must be >= 0'),
  days: z.number().int().min(0, 'days must be >= 0').max(6, 'days must be <= 6'),
})

export const GestationalAgeSchema = z.object({
  weeks: z.number().int().min(22, 'GA weeks must be >= 22').max(42, 'GA weeks must be <= 42'),
  days: z.number().int().min(0, 'GA days must be >= 0').max(6, 'GA days must be <= 6'),
})

function toUtcStartOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export const CalculatorInputsSchema = z
  .object({
    birthDate: z.date(),
    assessmentDate: z.date(),
    gaBirth: GestationalAgeSchema,
    useCorrection: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const birthUtc = toUtcStartOfDay(data.birthDate)
    const assessUtc = toUtcStartOfDay(data.assessmentDate)
    if (assessUtc.getTime() < birthUtc.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['assessmentDate'],
        message: 'assessmentDate must be on or after birthDate',
      })
    }
    const diffDays = differenceInCalendarDays(assessUtc, birthUtc)
    if (diffDays > 365 * 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['assessmentDate'],
        message: 'assessmentDate must be within 10 years of birthDate',
      })
    }
  })


