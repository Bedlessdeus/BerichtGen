export const formatDateToGerman = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDatesToGerman = (dates: Date[]): string[] => {
  return dates.map((date) =>
    date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
};

export const getWorkWeekDateRange = (year: number, week: number): DateRange => {
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - jan4Day + 1);

  const targetMonday = new Date(mondayOfWeek1);
  targetMonday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);

  const friday = new Date(targetMonday);
  friday.setDate(targetMonday.getDate() + 4);

  return new DateRange(targetMonday, friday);
};

export const calculateCalenderWeek = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const jan4Day = (jan4.getDay() + 6) % 7;
  const week1Monday = new Date(jan4.getFullYear(), 0, 4 - jan4Day);
  const dayDiff =
    (target.getTime() - week1Monday.getTime()) / (24 * 60 * 60 * 1000);
  return Math.floor(dayDiff / 7) + 1;
};

class DateRange {
  start: Date;
  end: Date;
  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  toString(): string {
    return `${this.startToString()} - ${this.endToString()}`;
  }

  startToString(): string {
    return this.start.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  endToString(): string {
    return this.end.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

export const calculateTrainingWeekNumber = (
  startDate: string,
  currentYear: number,
  currentWeek: number
): number => {
  if (!startDate) return currentWeek;

  const start = new Date(startDate);

  const currentWeekRange = getWorkWeekDateRange(currentYear, currentWeek);
  const currentWeekStart = currentWeekRange.start;

  const startWeek = calculateCalenderWeek(start);
  const startYear = start.getFullYear();
  const startWeekRange = getWorkWeekDateRange(startYear, startWeek);
  const startWeekStart = startWeekRange.start;

  const timeDiff = currentWeekStart.getTime() - startWeekStart.getTime();
  const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));

  if (weeksDiff < 0) {
    return 1;
  }

  return weeksDiff + 1;
};
