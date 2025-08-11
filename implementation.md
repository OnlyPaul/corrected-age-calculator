### Implementation Plan: React TypeScript App for Corrected Age and Postmenstrual Age (PMA)

#### 1) Objective and Scope
- **Goal**: Build a modern, accessible, highly accurate calculator that computes corrected age and postmenstrual age for infants, designed for healthcare professionals and parents.
- **Primary outputs**:
  - Postnatal age (time since birth)
  - Postmenstrual age (PMA)
  - Corrected age (aka adjusted age) for prematurity
- **Platforms**: Web (desktop and mobile). Optional PWA later.
- **Target audience**: Neonatologists, pediatricians, therapists, nurses, and parents.

#### 2) Domain definitions and formulas
- **Gestational Age at birth (GA_birth)**: Age of the fetus at birth in weeks and days.
- **Postnatal age (PNA)**: Time elapsed since the date of birth.
  - PNA_days = differenceInCalendarDays(assessmentDateUTC, birthDateUTC)
- **Postmenstrual Age (PMA)**: GA_birth + PNA, typically expressed in weeks+days.
  - PMA_days = GA_birth_days + PNA_days
  - PMA_wk = floor(PMA_days / 7), PMA_d = PMA_days % 7
- **Corrected age (CA)**: Chronological age adjusted for prematurity, typically used until 24 months for infants born < 37 weeks GA.
  - term_days = 40 * 7 (using 40 weeks as term reference)
  - prematurity_deficit_days = max(0, term_days - GA_birth_days)
  - CA_days = max(0, PNA_days - prematurity_deficit_days)
  - For calendar-based year/month/day representation, compute correctedBirthDate = addDays(birthDate, prematurity_deficit_days), then CA = interval(assessmentDate, correctedBirthDate) with calendar math.

Notes and clinical conventions:
- Correction generally applied if GA_birth < 37w0d and commonly up to 24 months postnatal age.
- Always show the underlying assumptions and allow toggling correction on/off with a clear explanation.
- Time computations should use UTC-safe calculations based on days to avoid DST issues.

#### 3) User stories and acceptance criteria
- As a clinician, I can enter birth date, assessment date (defaults to today), and GA at birth (weeks+days) to see PNA, PMA, and corrected age.
  - AC: Results update instantly with clear units; precision: weeks+days and calendar Y/M/D for corrected age.
- As a parent, I can read plain-language explanations and see whether correction applies and until what age.
  - AC: An info panel explains terms, assumptions, and when to use corrected age.
- As any user, I can copy a shareable link capturing inputs and results.
  - AC: Query params reflect inputs; opening the URL restores the state and recalculates.
- As a user, I can save common cases locally and revisit them.
  - AC: Saved cases persist in localStorage and can be loaded/deleted.
- As an accessibility user, I can operate the app by keyboard and screen reader.
  - AC: All interactive elements are focusable, labeled, and have visible focus states; contrast meets WCAG AA.

#### 4) Tech stack and libraries
- React 18 + TypeScript, Vite
- Material UI (MUI): `@mui/material`, `@mui/icons-material`, theming
- Date picker: `@mui/x-date-pickers` with `AdapterDateFns` (v3)
- Date utilities: `date-fns` (+ `date-fns-tz` if needed)
- Forms and validation: `react-hook-form`, `zod`, `@hookform/resolvers/zod`
- Testing: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
- Lint/format: ESLint (TS), Prettier
- Optional: `zod-to-ts` (if generating types elsewhere), `msw` (future API mocks)

#### 5) Architecture and project structure
- Feature-first, domain-oriented structure:
  - `src/domain/` domain logic (pure functions for age math, types, validators)
  - `src/components/` reusable UI (inputs, results cards)
  - `src/features/age-calculator/` feature composition (form + results + info)
  - `src/hooks/` shared hooks (query param sync, localStorage helpers)
  - `src/styles/` theme setup
  - `src/pages/` top-level route(s)
- Keep domain logic UI-agnostic and fully unit tested.

#### 6) Data modeling and types (TypeScript)
- `AgeInDays` (number)
- `WeeksDays` { weeks: number; days: number }
- `GestationalAge` { weeks: number; days: number } (days in [0..6], weeks in [22..42])
- `AgeBreakdown` { years: number; months: number; weeks: number; days: number }
- `CalculatorInputs` { birthDate: Date; assessmentDate: Date; gaBirth: GestationalAge; useCorrection: boolean }
- `CalculatorResults` { pna: WeeksDays; pnaDays: number; pma: WeeksDays; pmaDays: number; corrected: { weeksDays: WeeksDays; days: number; calendar: AgeBreakdown } }

#### 7) Algorithms and utilities
- Utilities in `src/domain/age`: 
  - `toDaysFromWeeksDays(weeksDays: WeeksDays): number`
  - `toWeeksDaysFromDays(days: number): WeeksDays`
  - `calcPnaDays(birthDate: Date, assessmentDate: Date): number` (UTC diff in calendar days)
  - `calcPmaDays(gaBirthDays: number, pnaDays: number): number`
  - `calcCorrectionDays(gaBirthDays: number, termWeeks: number = 40): number`
  - `calcCorrectedAgeDays(pnaDays: number, correctionDays: number): number`
  - `calcCalendarBreakdownFromCorrected(birthDate: Date, correctionDays: number, assessmentDate: Date): AgeBreakdown` using date-fns intervalToDuration
- All functions pure, with unit tests and explicit input validation.

Pseudo-flow for calculation:
1) Normalize all dates to UTC midnight.
2) pnaDays = differenceInCalendarDays(assessment, birth)
3) gaBirthDays = toDaysFromWeeksDays(gaBirth)
4) pmaDays = gaBirthDays + pnaDays
5) correctionDays = useCorrection ? max(0, 280 - gaBirthDays) : 0
6) correctedDays = max(0, pnaDays - correctionDays)
7) correctedWeeksDays = toWeeksDaysFromDays(correctedDays)
8) correctedCalendar = interval between (assessment, addDays(birth, correctionDays))

#### 8) UI and interaction design (MUI)
- Layout: responsive container with top app bar, form on top, results below, info drawer.
- Components:
  - `AgeCalculatorForm`: 
    - Birth date (MUI Date Picker)
    - Assessment date (MUI Date Picker, default Today)
    - GA at birth: weeks (TextField with stepper) + days (0–6)
    - Toggle: Apply correction (default on if GA < 37w)
    - Validation feedback inline
  - `ResultsCard`:
    - PNA: weeks+days (and total days)
    - PMA: weeks+days
    - Corrected age: weeks+days plus calendar Y/M/D
    - Badges for “Correction applied” and “Recommended until 24 months”
  - `InfoPanel` or drawer: concise explanations + references
  - `SavedCasesPanel`: list + load/delete; share button creates URL with query params
- Theming: light/dark mode toggle; high-contrast colors meeting WCAG AA.

#### 9) Validation and error handling
- `zod` schema for `CalculatorInputs`:
  - Dates are valid, birth <= assessment, assessment not absurdly far from birth (e.g., < 10 years)
  - GA weeks in [22..42], days in [0..6]
  - If GA >= 37w => default correction off; allow manual toggle
- User feedback via MUI `FormHelperText`, `Alert` for cross-field errors.

#### 10) State management and persistence
- `react-hook-form` for form state + zod resolver
- URL query params sync (birthDate, assessmentDate, gaWeeks, gaDays, useCorrection)
- Local persistence for saved cases via localStorage with versioned schema key

#### 11) Date/time correctness
- Use UTC-based date math for day-level diffs (no time-of-day inputs)
- Normalize all dates to startOfDay UTC prior to diff
- Consider leap years (date-fns handles calendar math); avoid timezone surprises

#### 12) Accessibility and i18n
- Labels, roles, and descriptions on all inputs
- Keyboard navigable, visible focus, semantic structure
- Announce calculation updates via polite `aria-live` region
- i18n-ready formatting for dates and units; English first, design for easy locale expansion

#### 13) Testing strategy
- Unit tests (domain): all utilities with table-driven cases
- Component tests: form validation, rendering of results, URL param restoration
- Accessibility checks: axe (optional) for basic violations
- Example test cases:
  - GA 30w0d, PNA 10w0d => PMA 40w0d, CorrectedAge 0w0d
  - GA 32w3d, PNA 8w4d => PMA 41w0d, Correction = (40w0d - 32w3d) = 7w4d, CorrectedAge = 1d
  - GA 38w0d, PNA 6w2d => PMA 44w2d, Correction default off
  - Birth today, GA 35w0d, assessment today => PMA 35w0d, CorrectedAge 0

#### 14) Security and privacy
- No PHI is sent to any server; compute locally only
- No analytics by default; user-consent gate for future telemetry
- Clear privacy note in info panel

#### 15) CI/CD and quality gates
- Pre-commit checks: typecheck, lint, test
- CI pipeline (GitHub Actions): install, typecheck, lint, test, build
- Build artifacts: static site

#### 16) Project tasks and milestones
Milestone 1: Domain foundation (1–2 days)
- [x] Set up dependencies (MUI, pickers, date-fns, RHF, zod, testing libs)
- [x] Implement domain utilities in `src/domain/age`
- [x] Define types and zod schemas

Milestone 2: UI skeleton and form (1–2 days)
- [x] MUI theme + layout scaffold
- [x] `AgeCalculatorForm` with RHF + zod
- [x] Live calculations wired to results (no persistence yet)

Milestone 3: Results and UX polish (1–2 days)
- [x] `ResultsCard` with formatted outputs and badges
- [x] Info panel with explanations and references
- [x] Accessibility pass (labels, aria-live, keyboard)

Milestone 4: Persistence and shareability (1 day)
- [ ] Query param sync and restore
- [ ] Saved cases with localStorage

Milestone 5: Hardening and release (1 day)
- [ ] Full test coverage for core paths
- [ ] Error states and boundary cases
- [ ] CI pipeline and production build

#### 17) References (to surface in Info panel)
- AAP/CDC guidance on corrected age usage up to 24 months for preterm infants
- Neonatal clinical practice references for PMA and corrected age definitions

#### 18) Implementation notes (dev tips)
- Represent ages in days internally; convert to display units at the edge
- Prefer `intervalToDuration` for calendar Y/M/D of corrected age based on correctedBirthDate
- Keep domain pure and tested; UI should be a thin layer
- Provide clear copywriting and unit labels (e.g., “weeks + days”, “years · months · days”)

---

### Concrete next steps (initial commands and files)
- Add packages:
  - `@mui/material @mui/icons-material @emotion/react @emotion/styled @mui/x-date-pickers date-fns react-hook-form zod @hookform/resolvers vitest @testing-library/react @testing-library/user-event jsdom`
- Create files:
  - `src/domain/age/types.ts`
  - `src/domain/age/utils.ts`
  - `src/domain/age/utils.test.ts`
  - `src/features/age-calculator/AgeCalculatorForm.tsx`
  - `src/features/age-calculator/ResultsCard.tsx`
  - `src/features/age-calculator/InfoPanel.tsx`
  - `src/hooks/useQueryParams.ts`
  - `src/hooks/useLocalStorage.ts`
  - Integrate feature into `src/App.tsx`

This plan ensures accurate calculations, strong type safety, excellent accessibility, and a clean, maintainable architecture suitable for clinical and family use.


