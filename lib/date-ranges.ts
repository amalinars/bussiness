export const BUSINESS_TIME_ZONE = "Asia/Jakarta";

export type PeriodFilter = "day" | "week" | "month" | "all";

export type DateOnlyRange = {
  startDate: string;
  endDate: string;
};

function toDatePartMap(date: Date, timeZone: string) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as { year: string; month: string; day: string };
}

export function toDateOnlyInTimeZone(date: Date, timeZone = BUSINESS_TIME_ZONE) {
  const parts = toDatePartMap(date, timeZone);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getMonthRangeForDateInTimeZone(date: Date, timeZone = BUSINESS_TIME_ZONE) {
  const parts = toDatePartMap(date, timeZone);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    monthStart: `${parts.year}-${parts.month}-01`,
    monthEnd: `${parts.year}-${parts.month}-${String(daysInMonth).padStart(2, "0")}`,
  };
}

export function addDaysToDateOnly(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
}

export function getWeekRangeForDateInTimeZone(date: Date, timeZone = BUSINESS_TIME_ZONE) {
  const todayDate = toDateOnlyInTimeZone(date, timeZone);
  const [year, month, day] = todayDate.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = utcDate.getUTCDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = addDaysToDateOnly(todayDate, -daysSinceMonday);

  return {
    weekStart,
    weekEnd: addDaysToDateOnly(weekStart, 6),
  };
}

export function normalizePeriodFilter(period?: string | null): PeriodFilter {
  return period === "day" || period === "week" || period === "month" || period === "all" ? period : "all";
}

export function getDateRangeForPeriod(period: PeriodFilter, date: Date = new Date(), timeZone = BUSINESS_TIME_ZONE): DateOnlyRange | null {
  if (period === "all") {
    return null;
  }

  if (period === "day") {
    const dateOnly = toDateOnlyInTimeZone(date, timeZone);

    return { startDate: dateOnly, endDate: dateOnly };
  }

  if (period === "week") {
    const { weekStart, weekEnd } = getWeekRangeForDateInTimeZone(date, timeZone);

    return { startDate: weekStart, endDate: weekEnd };
  }

  const { monthStart, monthEnd } = getMonthRangeForDateInTimeZone(date, timeZone);

  return { startDate: monthStart, endDate: monthEnd };
}

export function isDateInRange(dateValue: string, startDate: string, endDate: string) {
  return dateValue >= startDate && dateValue <= endDate;
}

export function isDateRangeOverlapping(startA: string, endA: string, startB: string, endB: string) {
  return startA <= endB && endA >= startB;
}

export function getMonthRangeForMonthKey(monthKey: string) {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    monthStart: `${yearValue}-${monthValue}-01`,
    monthEnd: `${yearValue}-${monthValue}-${String(daysInMonth).padStart(2, "0")}`,
  };
}

export function getMonthKeysTouchedByDateRange(startDate: string, endDate: string) {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const [endYear, endMonth] = endDate.split("-").map(Number);
  const monthKeys: string[] = [];

  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    monthKeys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;

    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return monthKeys;
}
