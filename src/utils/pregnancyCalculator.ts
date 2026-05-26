/**
 * Pregnancy Calculator helper utilities.
 * Calculated based on the standard obstetric duration of 280 days (40 weeks).
 */

export interface PregnancyResult {
  estimatedDueDate: Date;
  gestationalWeeks: number;
  gestationalDays: number;
  remainingDays: number;
  percentComplete: number;
  trimester: 1 | 2 | 3;
  trimesterLabel: string;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Create date using local timezone to avoid timezone shifting
  return new Date(year, month - 1, day);
}

export function formatLocalDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculates pregnancy stats when given the Last Menstrual Period date (LMP).
 * EDD is exactly LMP + 280 days.
 */
export function calculateFromLMP(lastPeriodDateStr: string, benchmarkDate: Date = new Date()): PregnancyResult {
  const lmp = parseLocalDate(lastPeriodDateStr);
  const edd = new Date(lmp.getTime());
  edd.setDate(edd.getDate() + 280);

  return calculateFromEDD(formatLocalDate(edd), benchmarkDate);
}

/**
 * Calculates pregnancy stats when given the Estimated Due Date (EDD).
 * Pregnancy start day is EDD - 280 days.
 */
export function calculateFromEDD(dueDateStr: string, benchmarkDate: Date = new Date()): PregnancyResult {
  const edd = parseLocalDate(dueDateStr);
  
  // Clean dates to exclude times for pure day subtraction
  const today = new Date(benchmarkDate.getFullYear(), benchmarkDate.getMonth(), benchmarkDate.getDate());
  const formattedDueDate = new Date(edd.getFullYear(), edd.getMonth(), edd.getDate());

  const startOfPregnancy = new Date(formattedDueDate.getTime());
  startOfPregnancy.setDate(startOfPregnancy.getDate() - 280);

  // Remaining days to baby arises
  const timeDiffToDue = formattedDueDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(timeDiffToDue / (1000 * 60 * 60 * 24));

  // Gestational days completed
  const timeDiffCompleted = today.getTime() - startOfPregnancy.getTime();
  let gestationalTotalDays = Math.floor(timeDiffCompleted / (1000 * 60 * 60 * 24));

  // Edge cases
  if (gestationalTotalDays < 0) {
    gestationalTotalDays = 0;
  }
  if (gestationalTotalDays > 294) {
    // Cap or represent standard pregnancy up to 42 weeks (294 days)
    gestationalTotalDays = 294;
  }

  const gestationalWeeks = Math.floor(gestationalTotalDays / 7);
  const gestationalDays = gestationalTotalDays % 7;

  const percentComplete = Math.min(100, Math.max(0, (gestationalTotalDays / 280) * 100));

  let trimester: 1 | 2 | 3 = 1;
  let trimesterLabel = "Tam cá nguyệt 1 (3 tháng đầu)";

  if (gestationalWeeks >= 14 && gestationalWeeks <= 27) {
    trimester = 2;
    trimesterLabel = "Tam cá nguyệt 2 (3 tháng giữa)";
  } else if (gestationalWeeks >= 28) {
    trimester = 3;
    trimesterLabel = "Tam cá nguyệt 3 (3 tháng cuối)";
  }

  return {
    estimatedDueDate: edd,
    gestationalWeeks,
    gestationalDays,
    remainingDays,
    percentComplete: Math.round(percentComplete * 10) / 10,
    trimester,
    trimesterLabel,
  };
}
