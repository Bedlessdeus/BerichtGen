import { readDir, readTextFile } from "@tauri-apps/plugin-fs";

export type Language = {
  monday_text: string;
  tuesday_text: string;
  wednesday_text: string;
  thursday_text: string;
  friday_text: string;

  holiday_text: string;
  department_text: string;
  school_text: string;
  seminar_text: string;

  program_title: string;
  program_subtitle_calendar_week: string;
  program_previous_week: string;
  program_next_week: string;
  program_loading: string;
  program_loading_week_data: string;
  program_button_pdf_preview: string;
  program_button_text_report: string;
  program_button_generating: string;
  program_last_report_generated: string;

  config_title_configuration: string;
  config_button_text: string;

  config_input_label_trainee: string;
  config_input_placeholder_trainee: string;
  config_input_label_department: string;
  config_input_placeholder_department: string;
  config_input_label_company: string;
  config_input_placeholder_company: string;
  config_input_label_training_start: string;
  config_input_placeholder_training_start: string;
  config_input_label_output_directory: string;
  config_input_placeholder_output_directory: string;
  config_input_button_text_output_directory: string;
  config_input_label_self_directory: string;
  config_input_placeholder_self_directory: string;
  config_input_button_text_self_directory: string;
  config_input_label_language: string;
  config_input_label_custom_language_directory: string;
  config_input_placeholder_custom_language_directory: string;
  config_input_button_text_custom_language_directory: string;

  config_input_label_output_format: string;

  config_input_label_banner_image: string;
  config_input_placeholder_banner_image: string;
  config_input_button_text_banner_image: string;

  config_input_label_company_logo: string;
  config_input_placeholder_company_logo: string;
  config_input_button_text_company_logo: string;

  config_button_save_text: string;
  config_button_save_text_saving: string;
  config_button_cancel_text: string;

  day_input_label_date: string;
  day_input_placeholder_date: string;
  day_input_label_area: string;
  day_input_notes_label: string;
  day_input_notes_placeholder: string;

  day_button_edit_text: string;
  day_button_add_text: string;
  day_button_save_text: string;
  day_button_save_text_saving: string;
  day_button_cancel_text: string;

  day_view_label_date: string;
  day_view_label_area: string;
  day_view_label_notes: string;
  day_view_label_no_notes: string;
  day_view_missing_entry: string;

  pdf_preview_title: string;

  pdf_preview_button_close_text: string;
  pdf_preview_button_save_text: string;
  pdf_preview_button_print_text: string;

  pdf_gen_title: string;

  pdf_gen_label_department: string;
  pdf_gen_label_from: string;
  pdf_gen_label_to: string;
  pdf_gen_label_trainee: string;
  pdf_gen_label_current_date: string;
  pdf_gen_label_report_number: string;
  pdf_gen_label_signature_trainer: string;
  pdf_gen_label_signature_trainee: string;
  pdf_gen_label_signature_guardian: string;
};

export const EN: Language = {
  monday_text: "Monday",
  tuesday_text: "Tuesday",
  wednesday_text: "Wednesday",
  thursday_text: "Thursday",
  friday_text: "Friday",

  holiday_text: "Holiday",
  department_text: "Department",
  school_text: "School",
  seminar_text: "Seminar",

  program_title: "BerichtGen - Report Book Generator",
  program_subtitle_calendar_week: "Calendar Week",
  program_previous_week: "← Previous Week",
  program_next_week: "Next Week →",
  program_loading: "Loading...",
  program_loading_week_data: "Loading week data...",
  program_button_pdf_preview: "PDF Preview",
  program_button_text_report: "Text Report",
  program_button_generating: "Generating...",
  program_last_report_generated: "Last report generated:",

  config_title_configuration: "Configuration",
  config_button_text: "⚙️ Configuration",

  config_input_label_trainee: "Trainee Name",
  config_input_placeholder_trainee: "Trainee name",

  config_input_label_department: "Department Name",
  config_input_placeholder_department: "Deparment Name",

  config_input_label_company: "Company Name",
  config_input_placeholder_company: "Company Name",

  config_input_label_training_start: "Training Start Date",
  config_input_placeholder_training_start: "Training Start Date",

  config_input_label_output_directory: "Output Directory",
  config_input_placeholder_output_directory: "Select Output directory",
  config_input_button_text_output_directory: "Browse",

  config_input_label_self_directory: "Source Directory",
  config_input_placeholder_self_directory: "Source Self directory",
  config_input_button_text_self_directory: "Browse",

  config_input_label_language: "Language",

  config_input_label_custom_language_directory: "Custom Language Directory",
  config_input_placeholder_custom_language_directory:
    "Select custom language directory",
  config_input_button_text_custom_language_directory: "Browse",

  config_input_label_output_format: "Output Format",

  config_input_label_banner_image: "Banner Image",
  config_input_placeholder_banner_image: "Select banner image",
  config_input_button_text_banner_image: "Browse",

  config_input_label_company_logo: "Company Logo",
  config_input_placeholder_company_logo: "Select company logo",
  config_input_button_text_company_logo: "Browse",

  config_button_save_text: "Save",
  config_button_save_text_saving: "Saving...",

  config_button_cancel_text: "Cancel",

  day_button_edit_text: "Edit",
  day_button_add_text: "Add",

  day_input_label_date: "Date:",
  day_input_placeholder_date: "DD.MM.YYYY",

  day_input_label_area: "Area:",

  day_input_notes_label: "Notes:",
  day_input_notes_placeholder: "Enter notes here...",

  day_button_save_text: "Save",
  day_button_save_text_saving: "Saving...",
  day_button_cancel_text: "Cancel",

  day_view_label_date: "Date:",
  day_view_label_area: "Area:",
  day_view_label_notes: "Notes:",
  day_view_label_no_notes: "No notes available",
  day_view_missing_entry: "No entry for this day",

  pdf_preview_title: "Report Book Preview - KW",

  pdf_preview_button_close_text: "Close",
  pdf_preview_button_save_text: "Save",
  pdf_preview_button_print_text: "Print",

  pdf_gen_title: "Report Book",
  pdf_gen_label_department: "Department",
  pdf_gen_label_from: "From",
  pdf_gen_label_to: "To",
  pdf_gen_label_trainee: "Name",
  pdf_gen_label_current_date: "Date",
  pdf_gen_label_report_number: "Report Number",
  pdf_gen_label_signature_trainer: "Trainer Signature",
  pdf_gen_label_signature_trainee: "Trainee Signature",
  pdf_gen_label_signature_guardian: "Guardian Signature",
};

export const DE: Language = {
  monday_text: "Montag",
  tuesday_text: "Dienstag",
  wednesday_text: "Mittwoch",
  thursday_text: "Donnerstag",
  friday_text: "Freitag",

  holiday_text: "Urlaub",
  department_text: "Abteilung",
  school_text: "Schule",
  seminar_text: "Seminar",

  program_title: "BerichtGen - Berichtsheft Generator",
  program_subtitle_calendar_week: "Kalenderwoche",
  program_previous_week: "← Vorherige Woche",
  program_next_week: "Nächste Woche →",
  program_loading: "Laden...",
  program_loading_week_data: "Lade Wochendaten...",
  program_button_pdf_preview: "PDF Vorschau",
  program_button_text_report: "Text Bericht",
  program_button_generating: "Generiere...",
  program_last_report_generated: "Letzter Bericht generiert:",

  config_title_configuration: "Konfiguration",
  config_button_text: "⚙️ Konfiguration",

  config_input_label_trainee: "Auszubildender Name",
  config_input_placeholder_trainee: "Name des Auszubildenden",

  config_input_label_department: "Abteilungsname",
  config_input_placeholder_department: "Name der Abteilung",

  config_input_label_company: "Firmenname",
  config_input_placeholder_company: "Name der Firma",

  config_input_label_training_start: "Ausbildungsbeginn",
  config_input_placeholder_training_start: "Ausbildungsbeginn",

  config_input_label_output_directory: "Ausgabeverzeichnis",
  config_input_placeholder_output_directory: "Ausgabeverzeichnis auswählen",
  config_input_button_text_output_directory: "Durchsuchen",

  config_input_label_self_directory: "Quellverzeichnis",
  config_input_placeholder_self_directory: "Quellverzeichnis auswählen",
  config_input_button_text_self_directory: "Durchsuchen",

  config_input_label_language: "Sprache",

  config_input_label_custom_language_directory:
    "Benutzerdefinierte Sprachenverzeichnis",
  config_input_placeholder_custom_language_directory:
    "Benutzerdefinierte Sprachenverzeichnis auswählen",
  config_input_button_text_custom_language_directory: "Durchsuchen",

  config_input_label_output_format: "Ausgabeformat",

  config_input_label_banner_image: "Banner Bild",
  config_input_placeholder_banner_image: "Banner Bild auswählen",
  config_input_button_text_banner_image: "Durchsuchen",

  config_input_label_company_logo: "Firmenlogo",
  config_input_placeholder_company_logo: "Firmenlogo auswählen",
  config_input_button_text_company_logo: "Durchsuchen",

  config_button_save_text: "Speichern",
  config_button_save_text_saving: "Speichere...",

  config_button_cancel_text: "Abbrechen",

  day_button_edit_text: "Bearbeiten",
  day_button_add_text: "Hinzufügen",

  day_input_label_date: "Datum:",
  day_input_placeholder_date: "TT.MM.JJJJ",

  day_input_label_area: "Bereich:",

  day_input_notes_label: "Notizen:",
  day_input_notes_placeholder: "Notizen hier eingeben...",

  day_button_save_text: "Speichern",
  day_button_save_text_saving: "Speichere...",

  day_button_cancel_text: "Abbrechen",

  day_view_label_date: "Datum:",
  day_view_label_area: "Bereich:",
  day_view_label_notes: "Notizen:",
  day_view_label_no_notes: "Keine Notizen verfügbar",
  day_view_missing_entry: "Kein Eintrag für diesen Tag",

  pdf_preview_title: "Berichtsheft Vorschau - KW",

  pdf_preview_button_close_text: "Schließen",
  pdf_preview_button_save_text: "Speichern",
  pdf_preview_button_print_text: "Drucken",

  pdf_gen_title: "Ausbildungsnachweis",
  pdf_gen_label_department: "GB/Werk/Abt",
  pdf_gen_label_from: "Von",
  pdf_gen_label_to: "Bis",
  pdf_gen_label_trainee: "Name",
  pdf_gen_label_current_date: "Datum",
  pdf_gen_label_report_number: "Berichtsnr.",
  pdf_gen_label_signature_trainer: "Unterschrift Ausbilder",
  pdf_gen_label_signature_trainee: "Unterschrift Auszubildender",
  pdf_gen_label_signature_guardian: "Unterschrift Erziehungsberechtigter",
};

export const AVAILABLE_LANGUAGES = {
  en: { code: "en", name: "English", data: EN },
  de: { code: "de", name: "Deutsch", data: DE },
};

const languageCache = new Map<string, Language>();

export async function loadLanguageFile(
  filePath: string
): Promise<Language | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load language file: ${response.statusText}`);
    }
    const data = await response.json();
    if (validateLanguageData(data)) {
      return data as Language;
    } else {
      console.error("Invalid language file format:", filePath);
      return null;
    }
  } catch (error) {
    console.error("Error loading language file:", error);
    return null;
  }
}

export const loadUserLanguageFile = async (
  filePath: string
): Promise<Language | null> => {
  try {
    const content = await readTextFile(filePath);
    const data = JSON.parse(content);
    if (validateLanguageData(data)) {
      return data as Language;
    } else {
      console.error("Invalid language file format:", filePath);
      return null;
    }
  } catch (error) {
    console.error("Error loading user language file:", error);
    return null;
  }
};

const validateLanguageData = (data: any): boolean => {
  const requiredKeys: (keyof Language)[] = [
    "monday_text",
    "tuesday_text",
    "wednesday_text",
    "thursday_text",
    "friday_text",
    "holiday_text",
    "department_text",
    "school_text",
    "seminar_text",
    "program_title",
    "program_subtitle_calendar_week",
    "program_previous_week",
    "program_next_week",
    "program_loading",
    "program_loading_week_data",
    "program_button_pdf_preview",
    "program_button_text_report",
    "program_button_generating",
    "program_last_report_generated",
    "config_title_configuration",
    "config_button_text",
    "config_input_label_trainee",
    "config_input_placeholder_trainee",
    "config_input_label_department",
    "config_input_placeholder_department",
    "config_input_label_company",
    "config_input_placeholder_company",
    "config_input_label_training_start",
    "config_input_placeholder_training_start",
    "config_input_label_output_directory",
    "config_input_placeholder_output_directory",
    "config_input_button_text_output_directory",
    "config_input_label_self_directory",
    "config_input_placeholder_self_directory",
    "config_input_button_text_self_directory",
    "config_input_label_language",
    "config_input_label_custom_language_directory",
    "config_input_placeholder_custom_language_directory",
    "config_input_button_text_custom_language_directory",
    "config_input_label_output_format",
    "config_input_label_banner_image",
    "config_input_placeholder_banner_image",
    "config_input_button_text_banner_image",
    "config_input_label_company_logo",
    "config_input_placeholder_company_logo",
    "config_input_button_text_company_logo",
    "config_button_save_text",
    "config_button_save_text_saving",
    "config_button_cancel_text",
    "day_input_label_date",
    "day_input_placeholder_date",
    "day_input_label_area",
    "day_input_notes_label",
    "day_input_notes_placeholder",
    "day_button_edit_text",
    "day_button_add_text",
    "day_button_save_text",
    "day_button_save_text_saving",
    "day_button_cancel_text",
    "day_view_label_date",
    "day_view_label_area",
    "day_view_label_notes",
    "day_view_label_no_notes",
    "day_view_missing_entry",
    "pdf_preview_title",
    "pdf_preview_button_close_text",
    "pdf_preview_button_save_text",
    "pdf_preview_button_print_text",
    "pdf_gen_title",
    "pdf_gen_label_department",
    "pdf_gen_label_from",
    "pdf_gen_label_to",
    "pdf_gen_label_trainee",
    "pdf_gen_label_current_date",
    "pdf_gen_label_report_number",
    "pdf_gen_label_signature_trainer",
    "pdf_gen_label_signature_trainee",
    "pdf_gen_label_signature_guardian",
  ];

  return requiredKeys.every(
    (key) => typeof data[key] === "string" && data[key].length > 0
  );
};

export const registerLanguage = (
  code: string,
  name: string,
  language: Language
): void => {
  languageCache.set(code, language);
  (AVAILABLE_LANGUAGES as any)[code] = { code, name, data: language };
};

export const getLanguage = (code: string): Language => {
  const builtIn = AVAILABLE_LANGUAGES[code as keyof typeof AVAILABLE_LANGUAGES];
  if (builtIn) {
    return builtIn.data;
  }

  const cached = languageCache.get(code);
  if (cached) {
    return cached;
  }

  return EN;
};

export const getAvailableLanguages = (): Array<{
  code: string;
  name: string;
}> => {
  return Object.values(AVAILABLE_LANGUAGES).map((lang) => ({
    code: lang.code,
    name: lang.name,
  }));
};

export const scanDirectoryForLanguageFiles = async (
  dirPath: string
): Promise<Array<{ code: string; name: string; path: string }>> => {
  try {
    const entries = await readDir(dirPath);
    const languageFiles: Array<{ code: string; name: string; path: string }> =
      [];

    for (const entry of entries) {
      if (entry.isFile && entry.name.toLowerCase().endsWith(".json")) {
        const code = entry.name.replace(/\.json$/i, "").toLowerCase();

        const fullPath = `${dirPath}/${entry.name}`;
        const langData = await loadUserLanguageFile(fullPath);

        if (langData) {
          const name =
            langData.config_title_configuration || code.toUpperCase();
          languageFiles.push({ code, name, path: fullPath });
        }
      }
    }

    return languageFiles;
  } catch (error) {
    console.error("Error scanning directory for language files:", error);
    return [];
  }
};

export const loadUserLanguagesFromDirectory = async (
  dirPath: string
): Promise<number> => {
  /*const languageFiles = await scanDirectoryForLanguageFiles(dirPath);
  let loadedCount = 0;

  for (const langFile of languageFiles) {
    const langData = await loadUserLanguageFile(langFile.path);
    if (langData) {
      registerLanguage(langFile.code, langFile.name, langData);
      loadedCount++;
    }
  }

  return loadedCount;*/
  return 0;
};

export const translateWeekday = (
  weekday: string,
  language: Language
): string => {
  switch (weekday.toLowerCase()) {
    case "monday":
      return language.monday_text;
    case "tuesday":
      return language.tuesday_text;
    case "wednesday":
      return language.wednesday_text;
    case "thursday":
      return language.thursday_text;
    case "friday":
      return language.friday_text;
    default:
      return weekday;
  }
};

export const translateArea = (area: string, language: Language): string => {
  switch (area) {
    case "Holiday":
      return language.holiday_text;
    case "Department":
      return language.department_text;
    case "School":
      return language.school_text;
    case "Seminar":
      return language.seminar_text;
    default:
      return area;
  }
};
