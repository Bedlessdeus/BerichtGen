# Language System

This application supports multiple languages through a flexible language system that allows both built-in languages and custom user-defined languages.

## Built-in Languages

The following languages are built into the application:
- **English** (en) - Default language
- **German** (de) - Deutsche Sprache

## Static Language Files

The application includes example language files in `/static/languages/`:
- **French** (fr) - Français
- **Spanish** (es) - Español
- **Template** (template.json) - Base template for creating new languages

## Custom User Languages

Users can create and load their own custom language files from any directory on their system.

### Setting Up Custom Languages

1. **Select Custom Language Directory**: In the Configuration modal, use the "Custom Language Directory" field to select a folder containing your custom language files.

2. **Create Language Files**: In your selected directory, create JSON files named with the language code (e.g., `it.json` for Italian, `pt.json` for Portuguese).

3. **Language File Format**: Each language file should follow this structure:

```json
{
    "config_title_configuration": "Configuration",
    "config_input_label_trainee": "Trainee Name",
    "config_input_placeholder_trainee": "Trainee name",
    "config_input_label_department": "Department Name",
    "config_input_placeholder_department": "Department Name",
    "config_input_label_company": "Company Name",
    "config_input_placeholder_company": "Company Name",
    "config_input_label_training_start": "Training Start Date",
    "config_input_placeholder_training_start": "Training Start Date",
    "config_input_label_output_directory": "Output Directory",
    "config_input_placeholder_output_directory": "Select Output directory",
    "config_input_button_text_output_directory": "Browse",
    "config_input_label_self_directory": "Source Directory",
    "config_input_placeholder_self_directory": "Source Self directory",
    "config_input_button_text_self_directory": "Browse",
    "config_input_label_language": "Language",
    "config_input_label_custom_language_directory": "Custom Language Directory",
    "config_input_placeholder_custom_language_directory": "Select custom language directory",
    "config_input_button_text_custom_language_directory": "Browse",
    "config_button_save_text": "Save",
    "config_button_save_text_saving": "Saving...",
    "config_button_cancel_text": "Cancel"
}
```

4. **Auto-Loading**: Once you select a custom language directory, the application will automatically scan and load all valid language files from that directory.

### Creating a New Custom Language

1. **Copy Template**: Use the template file at `/static/languages/template.json` as a starting point.

2. **Translate Strings**: Replace all English text with your target language translations.

3. **Name Your File**: Save the file with your language code (e.g., `it.json`, `pt.json`, `zh.json`).

4. **Load in Application**: 
   - Open the Configuration modal
   - Select your custom language directory
   - The new language will appear in the language selector
   - Select and save your configuration

### Example Custom Language Directory Structure

```
my-languages/
├── it.json          (Italian)
├── pt.json          (Portuguese)
├── zh.json          (Chinese)
└── custom-en.json   (Custom English variant)
```

## Language Selection and Persistence

- **Language Selection**: Users can select their preferred language from the Configuration modal
- **Persistence**: The selected language is saved with the user's configuration
- **Auto-Loading**: Custom languages are automatically reloaded when the configuration modal is opened
- **Validation**: All language files are validated to ensure they contain all required strings

## Language Coverage

The language system now covers all user-facing text in the application:

### Main Application Interface
- Program title and navigation
- Week navigation buttons
- Loading states and messages
- Report generation buttons and status

### Configuration Modal
- All form labels and placeholders
- Button text and states
- Directory selection fields
- Language selection interface

### Day Entry System
- Day editing interface
- Form labels and placeholders
- Button states and actions
- Data display labels

### PDF Generation and Preview
- PDF preview interface
- Report generation labels
- Form headers and fields
- Signature sections
- Print and export controls

### Weekday and Area Translation
- Automatic translation of weekdays (Monday through Friday)
- Area type translation (Department, School, Seminar, Holiday)
- Consistent terminology across all interfaces

### Loading Priority
1. Built-in languages (English, German)
2. Static language files (French, Spanish)
3. User custom languages (from selected directory)

### File Validation
- All language files must contain every required translation key
- Missing or invalid files are skipped with console warnings
- The system falls back to English if the selected language becomes unavailable

### Error Handling
- Invalid JSON files are logged and skipped
- Missing required keys result in validation failure
- Network or file system errors are handled gracefully
- User feedback is provided for successful/failed language loading

## Extending the Language System

To add new translatable strings to the application:

1. **Update Type Definition**: Add the new key to the `Language` type in `src/lib/lang.ts`
2. **Update Built-in Languages**: Add translations to `EN` and `DE` objects
3. **Update Validation**: Add the new key to the `validateLanguageData` function
4. **Update Template**: Add the new key to the template file
5. **Update Documentation**: Document the new translatable element

### Adding New UI Elements

When adding new UI elements that need translation:

```typescript
// In your Svelte component
import { currentLanguage } from "../lib/store.js";

// Use in template
<label>{$currentLanguage.your_new_key}</label>
```

## Troubleshooting

**Language not appearing in selector:**
- Check that the JSON file is valid
- Ensure all required keys are present
- Verify the custom language directory is correctly selected
- Check the browser console for validation errors

**Custom languages not loading:**
- Ensure the directory path is accessible
- Check file permissions
- Verify JSON syntax is correct
- Look for console error messages

**Language selection not persisting:**
- Ensure configuration is being saved successfully
- Check if the language file still exists in the directory
- Verify the language code matches the filename (without .json extension)
