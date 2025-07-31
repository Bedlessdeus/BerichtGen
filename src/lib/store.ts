import { writable, derived } from "svelte/store";
import { invoke } from "@tauri-apps/api/core";
import type { Config, WeekData, DayEntry } from "./types.js";

export const config = writable<Config>({
  trainee_name: "",
  department_name: "",
  company_name: "",
  output_directory: "",
  start_date: "",
});

export const currentWeek = writable<{ year: number; week: number }>({
  year: 2025,
  week: 1,
});

export const weekDataCache = writable<Map<string, WeekData>>(new Map());

export const isLoading = writable(false);
export const isConfigOpen = writable(false);
export const selfDirectory = writable<string>("");

export const currentWeekData = derived(
  [currentWeek, weekDataCache],
  ([$currentWeek, $weekDataCache]) => {
    const key = `${$currentWeek.year}-${$currentWeek.week
      .toString()
      .padStart(2, "0")}`;
    return (
      $weekDataCache.get(key) || {
        year: $currentWeek.year,
        week: $currentWeek.week,
        entries: {},
      }
    );
  }
);

export const loadConfig = async () => {
  try {
    const loadedConfig = await invoke<Config>("load_config");
    config.set(loadedConfig);
    selfDirectory.set(await invoke<string>("get_self_directory"));
    return loadedConfig;
  } catch (error) {
    console.error("Failed to load config:", error);
    throw error;
  }
};

export const saveConfig = async (newConfig: Config) => {
  try {
    await invoke("save_config", { config: newConfig });
    config.set(newConfig);
  } catch (error) {
    console.error("Failed to save config:", error);
    throw error;
  }
};

export const loadWeekData = async (year: number, week: number) => {
  try {
    isLoading.set(true);
    const data = await invoke<WeekData>("get_week_data", { year, week });

    weekDataCache.update((cache) => {
      const key = `${year}-${week.toString().padStart(2, "0")}`;
      cache.set(key, data);
      return cache;
    });

    return data;
  } catch (error) {
    console.error("Failed to load week data:", error);
    throw error;
  } finally {
    isLoading.set(false);
  }
};

export const saveDayEntry = async (
  year: number,
  week: number,
  weekday: string,
  entry: DayEntry
) => {
  try {
    await invoke("save_day_entry", { year, week, weekday, entry });

    weekDataCache.update((cache) => {
      const key = `${year}-${week.toString().padStart(2, "0")}`;
      const weekData = cache.get(key) || { year, week, entries: {} };
      weekData.entries[weekday] = entry;
      cache.set(key, weekData);
      return cache;
    });
  } catch (error) {
    console.error("Failed to save day entry:", error);
    throw error;
  }
};

export const generatePDF = async (year: number, week: number) => {
  try {
    isLoading.set(true);
    const reportPath = await invoke<string>("generate_pdf", { year, week });
    return reportPath;
  } catch (error) {
    console.error("Failed to generate report:", error);
    throw error;
  } finally {
    isLoading.set(false);
  }
};

export const getCurrentWeekInfo = async () => {
  try {
    const [year, week] = await invoke<[number, number]>(
      "get_current_week_info"
    );
    currentWeek.set({ year, week });
    return { year, week };
  } catch (error) {
    console.error("Failed to get current week info:", error);
    throw error;
  }
};

export const getWeeksAroundCurrent = async (
  weeksBefore: number = 5,
  weeksAfter: number = 5
) => {
  try {
    const weeks = await invoke<[number, number][]>("get_weeks_around_current", {
      weeksBefore,
      weeksAfter,
    });
    return weeks;
  } catch (error) {
    console.error("Failed to get weeks around current:", error);
    throw error;
  }
};
