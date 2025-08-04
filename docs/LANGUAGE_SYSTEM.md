# Language System Documentation

This application supports multiple languages through a flexible language system that allows both built-in languages and custom user-defined languages.

## Overview

The BerichtGen language system provides:

- **Built-in Languages**: English (default) and German
- **Static Examples**: French, Spanish, Italian, and template files
- **Custom Languages**: User-defined language files from any directory
- **Real-time Switching**: Instant language changes without restart
- **Comprehensive Coverage**: 65+ translation keys covering the entire UI

## Quick Start Guide

### For End Users

1. **Create a Language Directory**: Create a folder anywhere on your computer (e.g., `C:\MyLanguages`)
2. **Copy the Template**: Get `template.json` from the `static/languages` folder
3. **Create Your Language**:
   - Rename to your language code (e.g., `pt.json` for Portuguese)
   - Translate all English text to your target language
4. **Load in Application**:
   - Open BerichtGen → Configuration (⚙️)
   - Browse and select your language directory
   - Select your language from the dropdown
   - Save configuration

### For Developers

The language system is built around a comprehensive `Language` type with 65+ translation keys covering all UI elements.

## Language Types

### Built-in Languages

- **English** (en) - Default language with all 65+ translation keys
- **German** (de) - Complete German translation

### Static Language Files

Located in `static/languages/` directory:

- **French** (fr) - Complete French translation
- **Spanish** (es) - Complete Spanish translation
- **Italian** (it) - Complete Italian translation
- **Template** (template.json) - Base template for creating new languages

### Custom User Languages

User-defined language files loaded from any directory on the system.

## Creating Custom Languages

### Example Portuguese Language File (`pt.json`)

```json
{
  "monday_text": "Segunda-feira",
  "tuesday_text": "Terça-feira",
  "wednesday_text": "Quarta-feira",
  "thursday_text": "Quinta-feira",
  "friday_text": "Sexta-feira",
  "holiday_text": "Feriado",
  "department_text": "Departamento",
  "school_text": "Escola",
  "seminar_text": "Seminário",
  "program_title": "BerichtGen - Gerador de Livro de Relatórios",
  "program_subtitle_calendar_week": "Semana do Calendário",
  "program_previous_week": "← Semana Anterior",
  "program_next_week": "Próxima Semana →",
  "program_loading": "Carregando...",
  "program_loading_week_data": "Carregando dados da semana...",
  "program_button_pdf_preview": "Visualização PDF",
  "program_button_text_report": "Relatório de Texto",
  "program_button_generating": "Gerando...",
  "program_last_report_generated": "Último relatório gerado:",
  "config_title_configuration": "Configuração",
  "config_button_text": "⚙️ Configuração",
  "config_input_label_trainee": "Nome do Estagiário",
  "config_input_placeholder_trainee": "Nome do estagiário",
  "config_input_label_department": "Nome do Departamento",
  "config_input_placeholder_department": "Nome do departamento",
  "config_input_label_company": "Nome da Empresa",
  "config_input_placeholder_company": "Nome da empresa",
  "config_input_label_training_start": "Data de Início do Treinamento",
  "config_input_placeholder_training_start": "Data de início do treinamento",
  "config_input_label_output_directory": "Diretório de Saída",
  "config_input_placeholder_output_directory": "Selecionar diretório de saída",
  "config_input_button_text_output_directory": "Navegar",
  "config_input_label_self_directory": "Diretório Fonte",
  "config_input_placeholder_self_directory": "Selecionar diretório fonte",
  "config_input_button_text_self_directory": "Navegar",
  "config_input_label_language": "Idioma",
  "config_input_label_custom_language_directory": "Diretório de Idiomas Personalizados",
  "config_input_placeholder_custom_language_directory": "Selecionar diretório",
  "config_input_button_text_custom_language_directory": "Navegar",
  "config_input_label_banner_image": "Imagem do banner",
  "config_input_placeholder_banner_image": "Selecionar imagem do banner",
  "config_input_button_text_banner_image": "Navegar",
  "config_input_label_company_logo": "Logótipo da empresa",
  "config_input_placeholder_company_logo": "Selecione o logótipo da empresa",
  "config_input_button_text_company_logo": "Navegar",
  "config_button_save_text": "Salvar",
  "config_button_save_text_saving": "Salvando...",
  "config_button_cancel_text": "Cancelar",
  "day_input_label_date": "Data:",
  "day_input_placeholder_date": "DD.MM.AAAA",
  "day_input_label_area": "Área:",
  "day_input_notes_label": "Notas:",
  "day_input_notes_placeholder": "Inserir notas aqui...",
  "day_button_edit_text": "Editar",
  "day_button_add_text": "Adicionar",
  "day_button_save_text": "Salvar",
  "day_button_save_text_saving": "Salvando...",
  "day_button_cancel_text": "Cancelar",
  "day_view_label_date": "Data:",
  "day_view_label_area": "Área:",
  "day_view_label_notes": "Notas:",
  "day_view_label_no_notes": "Nenhuma nota disponível",
  "day_view_missing_entry": "Nenhuma entrada para este dia",
  "pdf_preview_title": "Visualização do Livro de Relatórios - SC",
  "pdf_preview_button_close_text": "Fechar",
  "pdf_preview_button_save_text": "Salvar",
  "pdf_preview_button_print_text": "Imprimir",
  "pdf_gen_title": "Livro de Relatórios",
  "pdf_gen_label_department": "Departamento",
  "pdf_gen_label_from": "De",
  "pdf_gen_label_to": "Para",
  "pdf_gen_label_trainee": "Nome",
  "pdf_gen_label_current_date": "Data",
  "pdf_gen_label_report_number": "Número do Relatório",
  "pdf_gen_label_signature_trainer": "Assinatura do Instrutor",
  "pdf_gen_label_signature_trainee": "Assinatura do Estagiário",
  "pdf_gen_label_signature_guardian": "Assinatura do Responsável"
}
```

### Directory Structure Example

```
MyCustomLanguages/
├── pt.json     (Portuguese)
├── ru.json     (Russian)
├── zh.json     (Chinese)
├── ar.json     (Arabic)
└── nl.json     (Dutch)
```

### File Requirements

**Naming Convention:**

- Use 2-letter language codes (ISO 639-1): `pt.json`, `zh.json`, etc.
- Filename (without .json) becomes the language code in the application

**Content Requirements:**

- All 65 translation keys must be present
- All values must be non-empty strings
- Valid JSON syntax required
- UTF-8 encoding for special characters
- Missing keys will cause language validation to fail

## Using the Language System

### Loading Custom Languages

1. **In Configuration Modal:**

   - Click "Custom Language Directory" → "Browse"
   - Select folder containing your language files
   - Files are automatically scanned and validated

2. **Language Selection:**
   - Custom languages appear in the Language dropdown
   - Select your language and click "Save"
   - Language switches immediately across the entire application

### Language Loading Priority

1. Built-in languages (English, German)
2. Static language files (French, Spanish, Italian)
3. User custom languages (from selected directory)

## Language Coverage Areas

The 65+ translation keys cover every aspect of the application:

### Main Interface

- Program title and navigation
- Week navigation (Previous/Next Week)
- Loading states and status messages
- Report generation buttons and states

### Configuration System

- Form labels and placeholders
- Directory selection interfaces
- Button text and saving states
- Language selection dropdown

### Day Entry Management

- Date and area input fields
- Notes editing interface
- Action buttons (Edit, Add, Save, Cancel)
- Data display labels and empty states

### PDF System

- PDF preview interface and controls
- Report generation labels and headers
- Form fields and signature sections
- Print and export functionality

### Weekday & Area Types

- Complete weekday translation (Monday-Friday)
- Area types: Department, School, Seminar, Holiday
- Consistent terminology across all interfaces

## Technical Implementation

### For Developers

**Architecture:**

- Core language types and validation in `src/lib/lang.ts`
- Reactive language state in `src/lib/store.ts`
- Real-time UI updates via Svelte stores
- File system integration through Tauri APIs

**Adding New Translatable Strings:**

1. **Update Type Definition**: Add new key to `Language` type in `src/lib/lang.ts`
2. **Update Built-in Languages**: Add translations to `EN` and `DE` objects
3. **Update Validation**: Add the new key to `validateLanguageData` function
4. **Update Template**: Add the new key to `static/languages/template.json`
5. **Update Components**: Use `$currentLanguage.your_new_key` in Svelte templates

**Example Usage in Components:**

```typescript
import { currentLanguage } from "../lib/store.js";

// In Svelte template
<label>{$currentLanguage.config_input_label_trainee}</label>
<button>{$currentLanguage.config_button_save_text}</button>
```

### File Validation System

- Validates JSON syntax and structure
- Checks for all 65 required translation keys
- Provides detailed error reporting
- Graceful fallback to English for missing/invalid languages

### Error Handling

- Invalid JSON files are logged and skipped
- Missing required keys result in validation failure
- File system errors are handled gracefully
- User feedback provided for loading success/failure

## Troubleshooting

### Language Not Appearing in Selector

- **Check JSON Syntax**: Use a JSON validator to verify file format
- **Verify All Keys Present**: Ensure all 65 required translation keys exist
- **Check Directory Path**: Confirm the custom language directory is accessible
- **File Permissions**: Verify read permissions for language files
- **Console Errors**: Check browser developer console for validation messages

### Text Not Displaying Correctly

- **UTF-8 Encoding**: Ensure files are saved with UTF-8 encoding
- **Special Characters**: Check for characters that need escaping in JSON
- **Text Length**: Verify translations don't break UI layout
- **Missing Translations**: Confirm all values are non-empty strings

### Language Selection Not Persisting

- **Configuration Save**: Ensure configuration modal saves successfully
- **File Availability**: Check if language file still exists in directory
- **Language Code Match**: Verify filename matches language code (without .json)
- **Directory Changes**: Confirm custom language directory hasn't moved

### Changes Not Visible

- **Reload Languages**: Reopen configuration modal to refresh language list
- **Console Messages**: Check for error messages during language loading
- **File Corruption**: Verify language file wasn't corrupted during editing
- **Clear Cache**: Try refreshing the application if changes don't appear

## Best Practices

### For Translators

- **Consistency**: Use consistent terminology throughout translations
- **Context Awareness**: Consider UI space constraints for longer languages
- **Cultural Adaptation**: Adapt text to cultural norms, not just literal translation
- **Testing**: Test translations in the actual application interface

### For Language File Management

- **Backup Files**: Keep backup copies of custom language files
- **Version Control**: Consider using git for tracking language file changes
- **Sharing**: Share language files with the BerichtGen community
- **Documentation**: Document any cultural or contextual translation decisions

### For Developers

- **Key Naming**: Use descriptive, hierarchical key names for new translations
- **Validation**: Always update validation function when adding new keys
- **Testing**: Test with multiple languages during development
- **Fallbacks**: Ensure graceful degradation when translations are missing

## Community and Support

- **GitHub Issues**: Report bugs or request new language features
- **Documentation**: This guide and the README provide comprehensive coverage
- **Community Languages**: Share your language files for others to use
- **Development**: Contribute to the language system on GitHub

## Migration and Updates

When updating BerichtGen:

- **Language Compatibility**: New versions may add translation keys
- **Migration**: Update custom language files with new required keys
- **Template Updates**: Check for updated template.json with new releases
- **Validation**: Re-validate custom languages after updates
