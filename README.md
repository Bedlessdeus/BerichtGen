# BerichtGen - Report Book Generator

<div align="center">
  <h3>🔧 A modern, multilingual training report book generator built with Tauri and Svelte</h3>
  
  ![Tauri](https://img.shields.io/badge/Tauri-2.0+-blue?style=flat-square&logo=tauri)
  ![Svelte](https://img.shields.io/badge/Svelte-5+-orange?style=flat-square&logo=svelte)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
  ![Rust](https://img.shields.io/badge/Rust-Latest-orange?style=flat-square&logo=rust)
</div>

## 📋 Overview

BerichtGen is a comprehensive desktop application designed to help trainees and apprentices create, manage, and generate professional training report books (Berichtsheft in German). Built with modern web technologies and packaged as a native desktop app using Tauri, it provides a seamless experience for documenting training activities and generating PDF reports.

## ✨ Key Features

### 🗓️ **Week-Based Report Management**
- Navigate through training weeks with calendar week view
- Add daily entries for Monday through Friday
- Track different activity areas (Department, School, Seminar, Holiday)
- Rich text notes for detailed activity documentation

### 📄 **Professional PDF Generation**
- Customizable headers with trainee and company information
- Professional layout suitable for official documentation
- Preview before saving or printing

### 🌍 **Advanced Multilingual Support**
- **Built-in Languages**: English and German
- **Static Languages**: French, Spanish, and Italian included
- **Custom Language Support**: Load your own language files from any directory
- **Real-time Language Switching**: Instant UI updates
- **Complete Translation Coverage**: Every text element is translatable

### ⚙️ **Flexible Configuration**
- Trainee and company information management
- Custom output directory selection
- Training start date configuration
- Language preference settings
- Custom language directory support

### 🔧 **Modern Technology Stack**
- **Frontend**: Svelte 5 with TypeScript
- **Backend**: Rust with Tauri 2.0+
- **Styling**: Tailwind CSS with dark/light mode support
- **File System**: Secure native file operations
- **State Management**: Reactive Svelte stores

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable version)
- **Bun** (package manager) or **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bedlessdeus/BerichtGen.git
   cd BerichtGen
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Run in development mode**
   ```bash
   bun run tauri dev
   # or
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   bun run tauri build
   # or
   npm run tauri build
   ```

## 📖 Usage Guide

### First-Time Setup

1. **Launch BerichtGen** and click the configuration button (⚙️)
2. **Fill in your information**:
   - Trainee name
   - Department name
   - Company name
   - Training start date
   - Output directory for generated reports
3. **Select your language** from the dropdown
4. **Save configuration**

### Creating Report Entries

1. **Navigate to the desired week** using the Previous/Next Week buttons
2. **Click on any weekday** to add or edit an entry
3. **Fill in the details**:
   - Date (auto-populated)
   - Activity area (Department, School, Seminar, or Holiday)
   - Detailed notes about activities performed
4. **Save the entry**

### Generating Reports

1. **Navigate to the week** you want to generate a report for
2. **Click "PDF Preview"** to see how the report will look
3. **Click "Save"** to generate the final PDF
4. **Find your report** in the configured output directory

## 🌍 Language System

### Using Built-in Languages

BerichtGen comes with built-in support for:
- **English** (Default)
- **German** (Deutsch)

### Adding Custom Languages

1. **Create a language directory** anywhere on your computer
2. **Copy the template file** from `static/languages/template.json`
3. **Translate all text strings** to your target language
4. **Save as `[language-code].json`** (e.g., `pt.json` for Portuguese)
5. **In BerichtGen settings**, select your custom language directory
6. **Choose your language** from the dropdown

### Example Language File Structure

```json
{
    "program_title": "BerichtGen - Report Book Generator",
    "config_title_configuration": "Configuration",
    "day_input_label_date": "Date:",
    "pdf_gen_title": "Report Book"
}
```

*Note: This is a shortened example. The complete file requires all 65 translation keys.*

For a complete list of translation keys, see the [Language System Documentation](./docs/LANGUAGE_SYSTEM.md).

## 🏗️ Project Structure

```
BerichtGen/
├── src/
│   ├── lib/
│   │   ├── ConfigModal.svelte      # Configuration interface
│   │   ├── DayEntry.svelte         # Daily entry editor
│   │   ├── PDFGen.svelte           # PDF preview and generation
│   │   ├── lang.ts                 # Language system
│   │   ├── store.ts                # Application state management
│   │   ├── types.ts                # TypeScript type definitions
│   │   └── util.ts                 # Utility functions
│   ├── routes/
|   |   ├── +layout.ts
│   │   └── +page.svelte            # Main application interface
│   └── app.css                     # Global styles
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                  # Rust backend logic
│   │   └── main.rs                 # Application entry point
│   ├── Cargo.toml                  # Rust dependencies
│   └── tauri.conf.json             # Tauri configuration
├── static/
│   └── languages/                  # Language files
│       ├── template.json           # Template for new languages
│       ├── fr.json                 # French translations
│       ├── es.json                 # Spanish translations
│       └── it.json                 # Italian translations
└── docs/
    └── LANGUAGE_SYSTEM.md          # Complete language system documentation
```

## 🔧 Development

### Available Scripts

- `bun run dev` - Start Vite development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run tauri dev` - Run Tauri development mode
- `bun run tauri build` - Build Tauri application

### Tech Stack Details

- **Frontend Framework**: Svelte 5 with TypeScript
- **Build Tool**: Vite with SvelteKit
- **Styling**: Tailwind CSS
- **Desktop Framework**: Tauri 2.0+
- **Backend Language**: Rust
- **Package Manager**: Bun (npm compatible)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Languages

1. Fork the repository
2. Create a new language file in `static/languages/`
3. Translate all keys from the template
4. Update the documentation
5. Submit a pull request

### Bug Reports & Feature Requests

Please use the GitHub Issues tab to report bugs or request features.

### Development Setup

1. Fork and clone the repository
2. Follow the installation steps above
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/) for cross-platform desktop applications
- UI powered by [Svelte](https://svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- PDF generation capabilities provided by the Rust ecosystem
- Multilingual support inspired by the need for accessible training documentation

## 📞 Support

- **Documentation**: Check the `docs/` directory for detailed guides
- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Use GitHub Discussions for questions and community support

---

<div align="center">
  <p><strong>BerichtGen</strong> - Making training documentation simple and professional</p>
  <p>Built with ❤️ by the community</p>
</div>
