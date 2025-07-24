use chrono::Datelike;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::State;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub trainee_name: String,
    pub department_name: String,
    pub company_name: String,
    pub output_directory: String,
    pub start_date: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            trainee_name: "".to_string(),
            department_name: "".to_string(),
            company_name: "".to_string(),
            output_directory: dirs::desktop_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .to_string_lossy()
                .to_string(),
            start_date: "".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DayEntry {
    pub date: String, // YYYY-MM-DD format
    pub area: String, // Department, School, or Seminar
    pub notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeekData {
    pub year: i32,
    pub week: u32,
    pub entries: HashMap<String, DayEntry>, // weekday -> entry
}

type AppState = Mutex<HashMap<String, WeekData>>; // week_key -> week_data

fn get_app_data_dir() -> Result<PathBuf, String> {
    let app_data = dirs::data_dir().ok_or("Could not find app data directory")?;
    let berichtgen_dir = app_data.join("BerichtGen");
    
    if !berichtgen_dir.exists() {
        fs::create_dir_all(&berichtgen_dir).map_err(|e| format!("Could not create app directory: {}", e))?;
    }
    
    Ok(berichtgen_dir)
}

fn get_config_path() -> Result<PathBuf, String> {
    Ok(get_app_data_dir()?.join("config.json"))
}

fn get_week_key(year: i32, week: u32) -> String {
    format!("{}-{:02}", year, week)
}

fn get_week_file_path(year: i32, week: u32) -> Result<PathBuf, String> {
    Ok(get_app_data_dir()?.join(format!("week_{}.json", get_week_key(year, week))))
}

#[tauri::command]
async fn load_config() -> Result<Config, String> {
    let config_path = get_config_path()?;
    
    if config_path.exists() {
        let content = fs::read_to_string(config_path)
            .map_err(|e| format!("Could not read config file: {}", e))?;
        
        serde_json::from_str(&content)
            .map_err(|e| format!("Could not parse config file: {}", e))
    } else {
        Ok(Config::default())
    }
}

#[tauri::command]
async fn save_config(config: Config) -> Result<(), String> {
    let config_path = get_config_path()?;
    
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Could not serialize config: {}", e))?;
    
    fs::write(config_path, content)
        .map_err(|e| format!("Could not write config file: {}", e))
}

#[tauri::command]
async fn get_current_week_info() -> Result<(i32, u32), String> {
    let today = chrono::Local::now().date_naive();
    let iso_week = today.iso_week();
    Ok((iso_week.year(), iso_week.week()))
}

#[tauri::command]
async fn get_week_data(year: i32, week: u32, state: State<'_, AppState>) -> Result<WeekData, String> {
    let week_key = get_week_key(year, week);
    let mut data = state.lock().await;
    
    if let Some(week_data) = data.get(&week_key) {
        return Ok(week_data.clone());
    }
    
    // Try to load from file
    let week_file = get_week_file_path(year, week)?;
    if week_file.exists() {
        let content = fs::read_to_string(week_file)
            .map_err(|e| format!("Could not read week file: {}", e))?;
        
        let week_data: WeekData = serde_json::from_str(&content)
            .map_err(|e| format!("Could not parse week file: {}", e))?;
        
        data.insert(week_key.clone(), week_data.clone());
        Ok(week_data)
    } else {
        // Create new week data
        let week_data = WeekData {
            year,
            week,
            entries: HashMap::new(),
        };
        data.insert(week_key, week_data.clone());
        Ok(week_data)
    }
}

#[tauri::command]
async fn save_day_entry(year: i32, week: u32, weekday: String, entry: DayEntry, state: State<'_, AppState>) -> Result<(), String> {
    let week_key = get_week_key(year, week);
    let mut data = state.lock().await;
    
    // Get or create week data
    if !data.contains_key(&week_key) {
        data.insert(week_key.clone(), WeekData {
            year,
            week,
            entries: HashMap::new(),
        });
    }
    
    if let Some(week_data) = data.get_mut(&week_key) {
        week_data.entries.insert(weekday, entry);
        
        // Save to file
        let week_file = get_week_file_path(year, week)?;
        let content = serde_json::to_string_pretty(week_data)
            .map_err(|e| format!("Could not serialize week data: {}", e))?;
        
        fs::write(week_file, content)
            .map_err(|e| format!("Could not write week file: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn generate_pdf(year: i32, week: u32, state: State<'_, AppState>) -> Result<String, String> {
    let config = load_config().await?;
    let week_data = get_week_data(year, week, state).await?;
    
    // Create text-based report content
    let mut report_content = String::new();
    
    // Header
    report_content.push_str(&format!("BERICHTSHEFT - KALENDERWOCHE {}\n", week));
    report_content.push_str(&format!("Jahr: {}\n", year));
    report_content.push_str("=".repeat(50).as_str());
    report_content.push_str("\n\n");
    
    // Personal info
    report_content.push_str(&format!("Auszubildende/r: {}\n", config.trainee_name));
    report_content.push_str(&format!("Abteilung: {}\n", config.department_name));
    report_content.push_str(&format!("Unternehmen: {}\n", config.company_name));
    report_content.push_str("\n");
    report_content.push_str("=".repeat(50).as_str());
    report_content.push_str("\n\n");
    
    // Week entries
    let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let weekday_names_de = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
    
    for (i, weekday) in weekdays.iter().enumerate() {
        report_content.push_str(&format!("{}:\n", weekday_names_de[i]));
        report_content.push_str("-".repeat(30).as_str());
        report_content.push_str("\n");
        
        if let Some(entry) = week_data.entries.get(*weekday) {
            report_content.push_str(&format!("Datum: {}\n", entry.date));
            report_content.push_str(&format!("Bereich: {}\n", entry.area));
            report_content.push_str("Tätigkeiten/Notizen:\n");
            report_content.push_str(&entry.notes);
            report_content.push_str("\n");
        } else {
            report_content.push_str("Keine Einträge für diesen Tag\n");
        }
        
        report_content.push_str("\n\n");
    }
    
    // Footer
    report_content.push_str("=".repeat(50).as_str());
    report_content.push_str("\n");
    report_content.push_str(&format!("Erstellt am: {}\n", chrono::Local::now().format("%d.%m.%Y %H:%M")));
    
    // Save report as text file
    let safe_trainee_name = config.trainee_name.replace(" ", "_").replace("/", "_").replace("\\", "_");
    let filename = format!("Berichtsheft_KW{:02}_{}_{}_{}.txt", week, year, safe_trainee_name, chrono::Local::now().format("%Y%m%d_%H%M%S"));
    let output_path = PathBuf::from(&config.output_directory).join(filename);
    
    fs::write(&output_path, report_content)
        .map_err(|e| format!("Could not write report file: {}", e))?;
    
    Ok(output_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn get_weeks_around_current(weeks_before: u32, weeks_after: u32) -> Result<Vec<(i32, u32)>, String> {
    let today = chrono::Local::now().date_naive();
    let current_week = today.iso_week();
    
    let mut weeks = Vec::new();
    
    // Calculate weeks before
    for i in (1..=weeks_before).rev() {
        if let Some(date) = today.checked_sub_signed(chrono::Duration::weeks(i as i64)) {
            let week = date.iso_week();
            weeks.push((week.year(), week.week()));
        }
    }
    
    // Current week
    weeks.push((current_week.year(), current_week.week()));
    
    // Calculate weeks after
    for i in 1..=weeks_after {
        if let Some(date) = today.checked_add_signed(chrono::Duration::weeks(i as i64)) {
            let week = date.iso_week();
            weeks.push((week.year(), week.week()));
        }
    }
    
    Ok(weeks)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            load_config,
            save_config,
            get_current_week_info,
            get_week_data,
            save_day_entry,
            generate_pdf,
            get_weeks_around_current
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
