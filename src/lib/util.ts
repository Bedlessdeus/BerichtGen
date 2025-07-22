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
