# Piuma Pro · Markdown Editor 🪶

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?logo=google-chrome&logoColor=white)](https://lordtzeentch38.github.io/Piuma-Editor/)
[![Tauri 2.0](https://img.shields.io/badge/Desktop-Tauri%202.0%20(~2MB)-blue?logo=tauri&logoColor=white)](https://github.com/Lordtzeentch38/Piuma-Editor)
[![Electron](https://img.shields.io/badge/Desktop-Electron-47848F?logo=electron&logoColor=white)](https://github.com/Lordtzeentch38/Piuma-Editor)
[![License: Custom Attribution](https://img.shields.io/badge/License-Attribution%20Required-orange.svg)](#-license--terms-of-use)
[![Author: Russo Alessandro](https://img.shields.io/badge/Author-Russo%20Alessandro-blue.svg)](https://github.com/Lordtzeentch38)
[![Language: EN / IT](https://img.shields.io/badge/Language-English%20%7C%20Italiano-purple.svg)](https://lordtzeentch38.github.io/Piuma-Editor/)

> 🚀 **Try Piuma Online**: **[lordtzeentch38.github.io/Piuma-Editor](https://lordtzeentch38.github.io/Piuma-Editor/)**

**Piuma Pro** is a modern, lightweight, distraction-free Markdown editor designed for writers, developers, students, and researchers. It provides a pure, seamless writing workflow for technical documentation, articles, and math/scientific notes with real-time rendering.

Available as:
1. 🌐 **Web Application**: Zero-install web app running directly in any modern browser.
2. 🚀 **Tauri Desktop Application**: Ultra-lightweight native Windows executable (~1.8 MB installer, ~8 MB standalone).
3. ⚡ **Electron Desktop Application**: Full-featured standalone desktop application with native OS integration.

---

## 🌐 Live Web Demo

You can try Piuma right now in your web browser with no setup required:  
👉 **[https://lordtzeentch38.github.io/Piuma-Editor/](https://lordtzeentch38.github.io/Piuma-Editor/)**

---

## ✨ Key Features

- 🌐 **Full Bilingual Support (EN / IT)**: Instantly switch the entire interface, tooltips, modals, shortcuts, and documentation between English (default) and Italian with one click.
- 📐 **KaTeX Mathematical Formulas**: Native support for inline math (`$E=mc^2$`) and multiline display equations (`$$\int_{a}^{b} f(x)dx$$`).
- 📊 **Mermaid Flowcharts & Diagrams**: Render interactive flowcharts, sequence diagrams, and class charts on the fly using `mermaid` code blocks.
- 🔀 **3 Responsive View Modes**:
  - **Write**: Full-width editor (100%) for maximum writing focus.
  - **Split**: Synchronized side-by-side Editor & Preview with draggable resizer.
  - **Read**: Full-width rendered reading view with wide tables and formatting.
- 🧘 **Zen Focus Mode (`F11`)**: Hides all sidebars, toolbars, and menus for a distraction-free experience.
- 🔍 **Find & Replace (`Ctrl+F`)**: Real-time search with match counters, focus retention, and synchronized auto-scrolling to matches.
- 📋 **Interactive Checklists**: Clickable task lists (`- [ ]` / `- [x]`) directly inside the live preview.
- 🎨 **4 Curated Themes**:
  - 📜 *Paper & Ink* (Classic Light)
  - 🌌 *Night / Obsidian* (Modern Dark)
  - 🌿 *Aurora Mint* (Soft Green)
  - 📖 *Sepia Books* (Warm Reading)
- 🔗 **Serverless Document Sharing**: Share notes instantly via compressed URL hashes (`#doc=...`) or `PIUMA:...` tokens without needing any server or database.
- 💾 **Multiple Export Options**: Save as standard Markdown (`.md`), download standalone self-contained HTML files, print/export to PDF with professional book-grade margins, or copy formatted Rich Text directly to Word / Google Docs.

---

## 🛠️ Compilation & Desktop Packaging

Piuma can be compiled into a native Windows executable (`.exe`) using **either Tauri or Electron**. Both options are fully supported and coexist seamlessly in the repository.

### Comparison

| Feature | Tauri 2.0 (Recommended) 🚀 | Electron ⚡ |
| :--- | :---: | :---: |
| **Installer Size** | **~1.77 MB** | ~85 MB |
| **Standalone .exe Size** | **~8.16 MB** | ~140 MB (unpacked) |
| **RAM Usage** | **~25 - 40 MB** | ~150 - 200 MB |
| **Backend Engine** | Rust + Windows WebView2 | Node.js + Embedded Chromium |
| **Requirements** | Rust & MSVC Build Tools | Node.js |

---

### Option 1: Compiling with Tauri 2.0 (Ultra-Lightweight ~2 MB) ⭐️

#### Prerequisites:
- [Rust](https://rustup.rs/) (Installed via `rustup-init.exe`)
- Microsoft C++ Build Tools (with "Desktop development with C++")

#### Commands:
```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm run tauri:dev

# 3. Build release executable (.exe and .msi installer)
npm run tauri:build
```
> The output binaries will be generated in `src-tauri/target/release/` (or `dist_tauri/`):
> - Standalone `.exe`: `src-tauri/target/release/app.exe` (or `dist_tauri/Piuma.exe`)
> - NSIS Setup Installer: `src-tauri/target/release/bundle/nsis/Piuma_2.0.0_x64-setup.exe`
> - MSI Installer: `src-tauri/target/release/bundle/msi/Piuma_2.0.0_x64_en-US.msi`

---

### Option 2: Compiling with Electron

#### Prerequisites:
- [Node.js](https://nodejs.org/) (v18+)

#### Commands:
```bash
# 1. Install dependencies
npm install

# 2. Run in development mode
npm start

# 3. Build standalone Windows installer and portable .exe
npm run build:win
```
> The output binaries will be generated in `dist/`:
> - NSIS Installer: `dist/Piuma Markdown Editor Setup 2.0.0.exe`
> - Portable `.exe`: `dist/Piuma Markdown Editor 2.0.0.exe`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **Ctrl + S** | Save document to disk / local storage |
| **Ctrl + O** | Open local `.md` file from computer |
| **Ctrl + F** | Open Find & Replace bar |
| **F11 / Esc** | Toggle Zen Fullscreen Focus Mode |
| **Ctrl + B** | Bold text |
| **Ctrl + I** | Italic text |
| **Ctrl + K** | Insert Markdown link |
| **Tab / Shift+Tab** | Indent / Outdent lines |

---

## 📄 License & Terms of Use

This software is free and open to use, copy, distribute, and modify for both personal and commercial purposes.

**Mandatory Condition**: Any individual or entity using, modifying, or redistributing this software or its source code must always preserve the original author credit (**Russo Alessandro**) and provide a direct link to the [original GitHub repository](https://github.com/Lordtzeentch38/Piuma-Editor).

---

*Crafted with care by [Russo Alessandro (@Lordtzeentch38)](https://github.com/Lordtzeentch38)* 🪶
