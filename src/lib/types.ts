export interface Config {
  trainee_name: string;
  department_name: string;
  company_name: string;
  output_directory: string;
}

export interface DayEntry {
  date: string;
  area: AreaType;
  notes: string;
}

export interface WeekData {
  year: number;
  week: number;
  entries: Record<string, DayEntry>;
}

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export const WEEKDAYS: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const AREAS = ['Department', 'School', 'Seminar'] as const;
export type AreaType = typeof AREAS[number];
