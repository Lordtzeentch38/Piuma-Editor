
"use strict";

const isDesktop = !!(window.electronAPI && window.electronAPI.isElectron);
const GITHUB_REPO_URL = "https://github.com/Lordtzeentch38/Piuma-Editor";

/* ---------- STATO GLOBALE DELL'APP ---------- */
const K_DOCS = "piuma.documents.v2";
const K_ACTIVE_ID = "piuma.activeDocId.v2";
const K_THEME = "piuma.theme.v2";
const K_GOAL = "piuma.goalWords.v2";
const K_LANG = "piuma.lang.v2";

let state = {
  docs: [],
  activeDocId: null,
  theme: "paper",
  goalWords: 500,
  lang: "en", // default: en
  mode: "split", // write | split | read
  isZen: false,
  saveTimer: null,
  isSyncingScroll: false,
  currentNativeFilePath: null
};

/* ---------- DIZIONARIO MULTILINGUA (i18n) ---------- */
const I18N = {
  en: {
    langBtn: "EN",
    langTip: "Language: English (Click for Italiano)",
    brandTip: "Visit Piuma GitHub Repository",
    docTitlePlaceholder: "Document title...",
    docTitleTip: "Document title · Click to edit or rename",
    editorPlaceholder: "Start writing your Markdown document here...",
    modeWrite: "Write",
    modeWriteTip: "Write Editor Only",
    modeSplit: "Split",
    modeSplitTip: "Editor & Preview Side by Side",
    modeRead: "Read",
    modeReadTip: "Read Preview Only",
    saveDiskTip: "Save to Disk (Ctrl+S)",
    findToggleTip: "Find and Replace (Ctrl+F)",
    tocToggleTip: "Table of Contents (TOC)",
    zenToggleTip: "Zen Focus Mode (F11)",
    themeMenuTip: "Change Color Theme",
    exportMenuTip: "Export / Share Document",
    openLocalTip: "Open local file from disk (.md)",
    helpModalTip: "User Manual & Quick Guide",
    aboutModalTip: "About, Author & License",
    toggleSidebarTip: "Show/Hide Documents",
    newDocTip: "Create New File",
    searchDocsPlaceholder: "Search documents...",
    sidebarTitle: "My Documents",
    importTokenBtn: "Import from Link / Token",
    backupJsonBtn: "Backup JSON",
    restoreBackupBtn: "Restore",
    restoreBackupTip: "Restore documents from JSON file",
    exportAllTip: "Export all documents as JSON",

    // Dropdown Exports
    actShareUrl: "<strong>Copy Share Link / Token</strong>",
    actImportToken: "Import from Token / Link",
    actDownloadMd: "Save As (.md)",
    actDownloadHtml: "Download Standalone HTML",
    actPrintPdf: "Print / Save to PDF",
    actCopyMd: "Copy Markdown",
    actCopyRichText: "Copy as Rich Text (Word/Docs)",

    // Themes
    themePaper: "📜 Paper & Ink",
    themeDark: "🌌 Night / Obsidian",
    themeMint: "🌿 Aurora Mint",
    themeSepia: "📖 Sepia Books",

    // Formatting Toolbar Tooltips
    h1Tip: "Heading 1 (H1)",
    h2Tip: "Heading 2 (H2)",
    h3Tip: "Heading 3 (H3)",
    boldTip: "Bold Text (Ctrl+B)",
    italicTip: "Italic Text (Ctrl+I)",
    strikeTip: "Strikethrough Text (~~text~~)",
    markTip: "Highlighted Text (==text==)",
    quoteTip: "Blockquote (> quote)",
    codeTip: "Inline Code (`code`)",
    codeblockTip: "Multi-line Code Block",
    mathTip: "KaTeX Math Formula ($formula$)",
    mermaidTip: "Mermaid Flowchart Diagram",
    linkTip: "Insert Link (Ctrl+K)",
    imageTip: "Insert Image",
    tableTip: "Markdown Table",
    ulTip: "Bullet List (- item)",
    olTip: "Numbered List (1. item)",
    taskTip: "Interactive Checklist (- [ ] item)",
    calloutNoteTip: "Note Callout Box",
    calloutTipTip: "Tip Callout Box",
    calloutWarningTip: "Warning Callout Box",

    // Find & Replace
    findPlaceholder: "Find...",
    replacePlaceholder: "Replace with...",
    replaceBtn: "Replace",
    replaceAllBtn: "All",
    replaceBtnTip: "Replace current match",
    replaceAllBtnTip: "Replace all matches",
    prevMatchTip: "Previous (Shift+F3)",
    nextMatchTip: "Next (F3)",
    closeFrTip: "Close bar",
    replaceCount: (c, t) => `${c} of ${t}`,

    // TOC
    tocTitle: "Table of Contents",
    tocEmpty: "No headings found.",
    tocCloseTip: "Close TOC",

    // Statusbar
    saved: "Saved",
    saving: "Saving...",
    wordsCount: (w) => `${w.toLocaleString("en-US")} ${w === 1 ? "word" : "words"}`,
    charsCount: (c) => `${c.toLocaleString("en-US")} characters`,
    readTime: (m) => m ? `≈ ${m} min read` : "—",
    targetGoal: (w, g, pct) => `Target: ${w}/${g} (${pct}%)`,
    setGoalPrompt: "Set your target word count for this session:",
    setGoalToast: (g) => `Target updated to ${g} words`,
    setGoalTip: "Click to set word goal",

    // Modals
    importModalTitle: "Import from Link or Token",
    importModalDesc: "Paste a <code>piuma://...</code> link, a web URL <code>https://...#doc=...</code>, or a <code>PIUMA:...</code> token here to open the shared document.",
    importModalPlaceholder: "Paste link or token here...",
    importModalCancel: "Cancel",
    importModalConfirm: "Import Document",

    aboutModalTitle: "Piuma Pro · About",
    aboutAppName: "Piuma Pro · Markdown Editor",
    aboutAppVer: "Version 2.0.0 (Web & Desktop)",
    aboutAuthor: "Author:",
    aboutPurposeTitle: "What is Piuma for?",
    aboutPurposeDesc: "Piuma is a distraction-free, modern and lightweight Markdown editor. It was designed to deliver a pure and seamless writing experience for notes, technical documentation, articles, and scientific texts, integrating native support for KaTeX math formulas, Mermaid diagrams, interactive checklists, syntax highlighting, and serverless sharing.",
    aboutLicenseTitle: "License & Terms of Use:",
    aboutLicenseDesc: "This software is free and open to use, copy, distribute, and modify for personal or commercial purposes.<br><strong>Mandatory condition:</strong> you must always cite the original author (<strong style='color:var(--text-hi)'>Russo Alessandro</strong>) and include the link to the <a href='https://github.com/Lordtzeentch38/Piuma-Editor' target='_blank' rel='noopener' style='font-weight:700'>original source on GitHub</a>.",
    aboutGotIt: "Got it",

    helpModalTitle: "User Manual & Quick Guide",
    helpShortcutsTitle: "⌨️ Keyboard Shortcuts",
    helpSyntaxTitle: "✍️ Markdown Syntax & Special Features",
    helpSharingTitle: "🔗 Sharing & Desktop / Web Modes",
    helpCloseBtn: "Close Guide",
    zenToast: "Zen mode active · Press Esc to exit",

    // Toasts, alerts & actions
    docLoadedToast: "Document loaded",
    docCreatedToast: "New document created ✓",
    docDeletedToast: "Document deleted",
    docDuplicatedToast: "Document duplicated ✓",
    deleteConfirm: "Are you sure you want to delete this document?",
    cannotDeleteOnlyDoc: "You cannot delete the only remaining document.",
    shareLinkCopiedDesktop: "Desktop link piuma:// copied! 🔗",
    shareLinkCopiedWeb: "Compressed link copied to clipboard! 🔗",
    fileSavedToast: "File saved to disk ✓",
    fileSavedSuccessToast: "File saved successfully ✓",
    htmlExportedToast: "Standalone HTML generated ✓",
    mdCopiedToast: "Markdown copied to clipboard ✓",
    richTextCopiedToast: "Rich Text copied! Ready for Word / Google Docs ✓",
    imagePastedToast: "Image pasted ✓",
    imageInsertedToast: "Image inserted ✓",
    replaceCompleteToast: "Replacement completed ✓",
    backupExportedToast: "JSON backup exported ✓",
    backupRestoredToast: "Backup restored successfully ✓",
    backupErrorAlert: "Error in JSON backup file.",
    invalidTokenAlert: "Invalid Token or Link. Please ensure you pasted the correct string.",
    duplicateTip: "Duplicate",
    deleteTip: "Delete",
    copyBtnLabel: "Copy",
    copiedBtnLabel: "Copied!",
    emptyDocMsg: "The document is empty."
  },
  it: {
    langBtn: "IT",
    langTip: "Lingua: Italiano (Clicca per English)",
    brandTip: "Visita il Repository GitHub di Piuma",
    docTitlePlaceholder: "Titolo documento...",
    docTitleTip: "Titolo del documento · Clicca per modificare o rinominare",
    editorPlaceholder: "Inizia a scrivere qui il tuo documento Markdown...",
    modeWrite: "Scrivi",
    modeWriteTip: "Solo Editor di Scrittura",
    modeSplit: "Affiancato",
    modeSplitTip: "Editor e Anteprima Affiancati",
    modeRead: "Leggi",
    modeReadTip: "Solo Anteprima di Lettura",
    saveDiskTip: "Salva su Disco (Ctrl+S)",
    findToggleTip: "Trova e Sostituisci (Ctrl+F)",
    tocToggleTip: "Indice Documento (TOC)",
    zenToggleTip: "Modalità Focus Zen (F11)",
    themeMenuTip: "Cambia Tema di Colori",
    exportMenuTip: "Esporta / Condividi Documento",
    openLocalTip: "Apri file locale da disco (.md)",
    helpModalTip: "Manuale d'Uso & Guida Rapida",
    aboutModalTip: "Informazioni, Autore & Licenza",
    toggleSidebarTip: "Mostra/Nascondi Documenti",
    newDocTip: "Crea Nuovo File",
    searchDocsPlaceholder: "Cerca tra i documenti...",
    sidebarTitle: "I Miei Documenti",
    importTokenBtn: "Importa da Link / Token",
    backupJsonBtn: "Backup JSON",
    restoreBackupBtn: "Ripristina",
    restoreBackupTip: "Ripristina documenti da file JSON",
    exportAllTip: "Esporta tutti i documenti in formato JSON",

    // Dropdown Esportazioni
    actShareUrl: "<strong>Copia Link / Token Condivisione</strong>",
    actImportToken: "Importa da Token / Link",
    actDownloadMd: "Salva con nome (.md)",
    actDownloadHtml: "Scarica HTML Standalone",
    actPrintPdf: "Stampa / Salva in PDF",
    actCopyMd: "Copia Markdown",
    actCopyRichText: "Copia come Rich Text (Word/Docs)",

    // Temi
    themePaper: "📜 Carta & Inchiostro",
    themeDark: "🌌 Notte / Obsidian",
    themeMint: "🌿 Aurora Mint",
    themeSepia: "📖 Sepia Libri",

    // Tooltip Barra Formattazione
    h1Tip: "Titolo Principale (H1)",
    h2Tip: "Sottotitolo (H2)",
    h3Tip: "Intestazione Minore (H3)",
    boldTip: "Testo in Grassetto (Ctrl+B)",
    italicTip: "Testo in Corsivo (Ctrl+I)",
    strikeTip: "Testo Barrato (~~testo~~)",
    markTip: "Testo Evidenziato (==testo==)",
    quoteTip: "Citazione a Blocco (> citazione)",
    codeTip: "Codice Inline (`codice`)",
    codeblockTip: "Blocco di Codice Multiriga",
    mathTip: "Formula Matematica KaTeX ($formula$)",
    mermaidTip: "Diagramma di Flusso Mermaid",
    linkTip: "Inserisci Link (Ctrl+K)",
    imageTip: "Inserisci Immagine",
    tableTip: "Tabella Markdown",
    ulTip: "Elenco Puntato (- elemento)",
    olTip: "Elenco Numerato (1. elemento)",
    taskTip: "Checklist Interattiva (- [ ] elemento)",
    calloutNoteTip: "Callout Box Nota",
    calloutTipTip: "Callout Box Suggerimento",
    calloutWarningTip: "Callout Box Avviso",

    // Trova e Sostituisci
    findPlaceholder: "Trova...",
    replacePlaceholder: "Sostituisci con...",
    replaceBtn: "Sostituisci",
    replaceAllBtn: "Tutto",
    replaceBtnTip: "Sostituisci occorrenza attuale",
    replaceAllBtnTip: "Sostituisci tutte le occorrenze",
    prevMatchTip: "Precedente (Shift+F3)",
    nextMatchTip: "Successivo (F3)",
    closeFrTip: "Chiudi barra",
    replaceCount: (c, t) => `${c} di ${t}`,

    // TOC
    tocTitle: "Indice Documento",
    tocEmpty: "Nessuna intestazione trovata.",
    tocCloseTip: "Chiudi indice",

    // Barra di Stato
    saved: "Salvato",
    saving: "Salvataggio...",
    wordsCount: (w) => `${w.toLocaleString("it-IT")} ${w === 1 ? "parola" : "parole"}`,
    charsCount: (c) => `${c.toLocaleString("it-IT")} caratteri`,
    readTime: (m) => m ? `≈ ${m} min lettura` : "—",
    targetGoal: (w, g, pct) => `Target: ${w}/${g} (${pct}%)`,
    setGoalPrompt: "Imposta il tuo obiettivo di parole per questa sessione:",
    setGoalToast: (g) => `Obiettivo aggiornato a ${g} parole`,
    setGoalTip: "Clicca per impostare obiettivo parole",

    // Modali
    importModalTitle: "Importa da Link o Token",
    importModalDesc: "Incolla qui un link <code>piuma://...</code>, un URL web <code>https://...#doc=...</code> oppure un token <code>PIUMA:...</code> per aprire il documento condiviso.",
    importModalPlaceholder: "Incolla link o token...",
    importModalCancel: "Annulla",
    importModalConfirm: "Importa Documento",

    aboutModalTitle: "Piuma Pro · Informazioni",
    aboutAppName: "Piuma Pro · Markdown Editor",
    aboutAppVer: "Versione 2.0.0 (Web & Desktop)",
    aboutAuthor: "Autore:",
    aboutPurposeTitle: "A cosa serve Piuma?",
    aboutPurposeDesc: "Piuma è un editor Markdown professionale, leggero e privo di distrazioni. È stato progettato per offrire un'esperienza di scrittura pura e fluida per appunti, documentazione tecnica, articoli e testi scientifici, integrando supporto nativo a formule KaTeX, diagrammi Mermaid, checklist interattive, syntax highlighting e condivisione serverless.",
    aboutLicenseTitle: "Licenza d'Uso & Condizioni:",
    aboutLicenseDesc: "Questo software è gratuito e liberamente utilizzabile, copiabile, distribuibile e modificabile per scopi personali o commerciali.<br><strong>Condizione obbligatoria:</strong> è necessario citare sempre il nome dell'autore originario (<strong style='color:var(--text-hi)'>Russo Alessandro</strong>) e inserire il link alla <a href='https://github.com/Lordtzeentch38/Piuma-Editor' target='_blank' rel='noopener' style='font-weight:700'>fonte originale su GitHub</a>.",
    aboutGotIt: "Ho capito",

    helpModalTitle: "Manuale d'Uso & Guida Rapida",
    helpShortcutsTitle: "⌨️ Scorciatoie da Tastiera",
    helpSyntaxTitle: "✍️ Sintassi Markdown & Funzionalità Speciali",
    helpSharingTitle: "🔗 Condivisione & Modalità Desktop / Web",
    helpCloseBtn: "Chiudi Manuale",
    zenToast: "Modalità Zen attiva · Premi Esc per uscire",

    // Toasts, avvisi & azioni
    docLoadedToast: "Documento caricato",
    docCreatedToast: "Nuovo documento creato ✓",
    docDeletedToast: "Documento eliminato",
    docDuplicatedToast: "Documento duplicato ✓",
    deleteConfirm: "Sei sicuro di voler eliminare questo documento?",
    cannotDeleteOnlyDoc: "Non puoi eliminare l'unico documento rimasto.",
    shareLinkCopiedDesktop: "Link Desktop piuma:// copiato! 🔗",
    shareLinkCopiedWeb: "Link compresso copiato negli appunti! 🔗",
    fileSavedToast: "File salvato su disco ✓",
    fileSavedSuccessToast: "File salvato con successo ✓",
    htmlExportedToast: "HTML Standalone generato ✓",
    mdCopiedToast: "Markdown copiato negli appunti ✓",
    richTextCopiedToast: "Rich Text copiato! Pronto per Word / Google Docs ✓",
    imagePastedToast: "Immagine incollata ✓",
    imageInsertedToast: "Immagine inserita ✓",
    replaceCompleteToast: "Sostituzione completata ✓",
    backupExportedToast: "Backup JSON esportato ✓",
    backupRestoredToast: "Backup ripristinato con successo ✓",
    backupErrorAlert: "Errore nel file di backup JSON.",
    invalidTokenAlert: "Token o Link non valido. Assicurati di aver incollato la stringa corretta.",
    duplicateTip: "Duplica",
    deleteTip: "Elimina",
    copyBtnLabel: "Copia",
    copiedBtnLabel: "Copiato!",
    emptyDocMsg: "Il documento è vuoto."
  }
};

const SAMPLE_DOC_IT = `# Benvenuto in Piuma Pro 🪶

**Piuma** è un editor Markdown potente ed elegante, creato da **Russo Alessandro**.
È disponibile sia come **Web App online** che come **Applicazione Desktop nativa**.

---

## ⚡ Novità & Funzionalità Principali

### 1. Formule Matematiche con KaTeX
Puoi inserire formule matematiche inline come $E = mc^2$ oppure blocchi complessi:

$$\\int_{a}^{b} f(x)dx = F(b) - F(a)$$

### 2. Diagrammi e Grafici con Mermaid
I diagrammi vengono renderizzati istantaneamente:

\`\`\`mermaid
graph TD
    A[Inizia a scrivere] --> B{Vuoi anteprima?}
    B -- Sì --> C[Usa Split View]
    B -- Focus --> D[Attiva Modalità Zen]
    C --> E[Esporta in PDF o HTML]
    D --> E
\`\`\`

### 3. Callout & Note di Evidenziazione
> [!NOTE]
> I callout ti permettono di mettere in risalto informazioni importanti nel testo.

> [!TIP]
> Premi **Ctrl+F** per cercare e sostituire, **F11** per la modalità Zen a schermo intero!

> [!WARNING]
> Ricordati di fare un backup periodico dei tuoi documenti tramite il pulsante Backup JSON nella barra laterale.

### 4. Checklist Interattive
Puoi cliccare direttamente sulle caselle nell'anteprima per completarle:
- [x] Scoprire la nuova modalità a Tutta Larghezza (Scrivi / Leggi)
- [x] Testare il cambio tema (Carta, Dark, Mint, Sepia)
- [ ] Scrivere il tuo prossimo articolo

### 5. Codice con Syntax Highlighting & Copia Rapida
\`\`\`javascript
function saluta(nome) {
  console.log(\`Ciao \${nome}, benvenuto su Piuma!\`);
}
saluta("Scrittore");
\`\`\`

### 6. Tabelle e Formattazione Avanzata
| Funzionalità | Scorciatoia | Descrizione |
| :--- | :---: | ---: |
| Grassetto | **Ctrl + B** | Rende il testo marcato |
| Corsivo | **Ctrl + I** | Enfatizza il testo |
| Link | **Ctrl + K** | Inserisce collegamento web |
| Modalità Zen | **F11** | Nasconde ogni distrazione |

---
*Buona scrittura con Piuma!* ✨
`;

const SAMPLE_DOC_EN = `# Welcome to Piuma Pro 🪶

**Piuma** is a powerful and elegant Markdown editor created by **Russo Alessandro**.
Available both as an **online Web App** and a **native Desktop App**.

---

## ⚡ Key Features & Capabilities

### 1. Mathematical Formulas with KaTeX
Insert inline math formulas like $E = mc^2$ or complex math blocks:

$$\\int_{a}^{b} f(x)dx = F(b) - F(a)$$

### 2. Diagrams and Charts with Mermaid
Diagrams are rendered instantly:

\`\`\`mermaid
graph TD
    A[Start writing] --> B{Want preview?}
    B -- Yes --> C[Use Split View]
    B -- Focus --> D[Activate Zen Mode]
    C --> E[Export to PDF or HTML]
    D --> E
\`\`\`

### 3. Callouts & Admonitions
> [!NOTE]
> Callouts let you highlight key information inside your text.

> [!TIP]
> Press **Ctrl+F** to find and replace, and **F11** for full-screen Zen focus mode!

> [!WARNING]
> Remember to create periodic backups using the Backup JSON button in the sidebar.

### 4. Interactive Checklists
Click checkboxes directly in the preview to toggle tasks:
- [x] Discover full-width mode (Write / Read)
- [x] Test color themes (Paper, Dark, Mint, Sepia)
- [ ] Write your next great article

### 5. Syntax Highlighted Code & Quick Copy
\`\`\`javascript
function greet(name) {
  console.log(\`Hello \${name}, welcome to Piuma!\`);
}
greet("Writer");
\`\`\`

### 6. Tables & Advanced Formatting
| Feature | Shortcut | Description |
| :--- | :---: | ---: |
| Bold | **Ctrl + B** | Makes text strong |
| Italic | **Ctrl + I** | Emphasizes text |
| Link | **Ctrl + K** | Inserts web link |
| Zen Mode | **F11** | Hides all distractions |

---
*Happy writing with Piuma!* ✨
`;

/* ---------- ELEMENTI DOM ---------- */
const $ = id => document.getElementById(id);
const editor = $("editor");
const preview = $("previewContent");
const lineGutter = $("lineGutter");
const paneEditor = $("paneEditor");
const panePreview = $("panePreview");
const stage = $("stage");
const docTitle = $("docTitle");
const saveStatus = $("saveStatus");
const saveDot = $("saveDot");
const sidebar = $("sidebar");
const docsList = $("docsList");
const toastEl = $("toast");
const importModal = $("importModal");
const aboutModal = $("aboutModal");
const helpModal = $("helpModal");
const tokenInput = $("tokenInput");
const filePathDisplay = $("filePathDisplay");
const brandLogo = $("brandLogo");

/* Apertura Link Esterni Universale (Web, Electron & Tauri) */
document.addEventListener("click", e => {
  const a = e.target.closest("a");
  if (!a) return;
  const href = a.getAttribute("href") || a.href;
  if (!href) return;

  if (href.startsWith("http://") || href.startsWith("https://")) {
    // Electron Desktop
    if (isDesktop && window.electronAPI && window.electronAPI.openExternal) {
      e.preventDefault();
      window.electronAPI.openExternal(href);
      return;
    }

    // Tauri Desktop
    if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
      e.preventDefault();
      try {
        if (window.__TAURI_INTERNALS__ && window.__TAURI_INTERNALS__.invoke) {
          window.__TAURI_INTERNALS__.invoke("open_external_url", { url: href });
        } else if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
          window.__TAURI__.core.invoke("open_external_url", { url: href });
        }
      } catch (err) {
        console.error("Tauri open URL error:", err);
      }
      return;
    }
  }
});

/* ==================================================================
   RENDER DEI CONTENUTI DEI MODALI (I18N DINAMICO)
   ================================================================== */
function renderAboutModalContent(lang) {
  const t = I18N[lang];
  $("aboutModalTitleText").textContent = t.aboutModalTitle;
  $("btnAboutGotIt").textContent = t.aboutGotIt;

  $("aboutModalBody").innerHTML = `
    <div style="background:var(--bg-surface-2);padding:14px 16px;border-radius:var(--radius-sm);border:1px solid var(--line)">
      <div style="font-size:15px;font-weight:700;color:var(--text-hi)">${t.aboutAppName}</div>
      <div style="font-size:12px;color:var(--accent);font-weight:600;margin-top:2px">${t.aboutAppVer}</div>
      <div style="font-size:13px;color:var(--text-mid);margin-top:8px">
        ${t.aboutAuthor} <strong style="color:var(--text-hi)">Russo Alessandro</strong> 
        (<a href="https://github.com/Lordtzeentch38" target="_blank" rel="noopener">@Lordtzeentch38</a>)
      </div>
    </div>

    <div>
      <strong style="color:var(--text-hi);font-size:13px">${t.aboutPurposeTitle}</strong>
      <p style="margin-top:4px">
        ${t.aboutPurposeDesc}
      </p>
    </div>

    <div style="background:rgba(255,107,44,0.06);border-left:4px solid var(--accent);padding:12px 14px;border-radius:0 8px 8px 0">
      <strong style="color:var(--accent-deep);font-size:12.5px">${t.aboutLicenseTitle}</strong>
      <p style="font-size:12px;color:var(--text-hi);margin-top:4px;line-height:1.5">
        ${t.aboutLicenseDesc}
      </p>
    </div>
  `;
}

function renderHelpModalContent(lang) {
  const t = I18N[lang];
  $("helpModalTitleText").textContent = t.helpModalTitle;
  $("btnHelpClose").textContent = t.helpCloseBtn;

  if (lang === "en") {
    $("helpModalBody").innerHTML = `
      <div class="help-section-title">${t.helpShortcutsTitle}</div>
      <div class="shortcut-grid">
        <div class="shortcut-item"><span>Save to disk</span><span class="kbd-key">Ctrl + S</span></div>
        <div class="shortcut-item"><span>Open file from computer</span><span class="kbd-key">Ctrl + O</span></div>
        <div class="shortcut-item"><span>Find & Replace</span><span class="kbd-key">Ctrl + F</span></div>
        <div class="shortcut-item"><span>Zen Focus Mode</span><span class="kbd-key">F11 / Esc</span></div>
        <div class="shortcut-item"><span>Bold Text</span><span class="kbd-key">Ctrl + B</span></div>
        <div class="shortcut-item"><span>Italic Text</span><span class="kbd-key">Ctrl + I</span></div>
        <div class="shortcut-item"><span>Insert Link</span><span class="kbd-key">Ctrl + K</span></div>
        <div class="shortcut-item"><span>Indent / Outdent</span><span class="kbd-key">Tab / Shift+Tab</span></div>
      </div>

      <div class="help-section-title">${t.helpSyntaxTitle}</div>
      <div style="font-size:12.5px;display:flex;flex-direction:column;gap:8px">
        <div><strong>• Headings:</strong> Use <code># Heading 1</code>, <code>## Heading 2</code>, <code>### Heading 3</code>.</div>
        <div><strong>• Formatting:</strong> <code>**bold**</code>, <code>*italic*</code>, <code>~~strikethrough~~</code>, <code>==highlight==</code>.</div>
        <div><strong>• Interactive Checklists:</strong> Write <code>- [ ] To do</code> or <code>- [x] Done</code> (clickable directly in preview).</div>
        <div><strong>• KaTeX Formulas:</strong> Inline <code>$E = mc^2$</code> or block <code>$$\\int_{a}^{b} f(x)dx$$</code>.</div>
        <div><strong>• Mermaid Diagrams:</strong> Code block with language <code>mermaid</code> (e.g. <code>graph TD A--&gt;B</code>).</div>
        <div><strong>• GitHub Callouts:</strong> Use <code>&gt; [!NOTE]</code>, <code>&gt; [!TIP]</code>, <code>&gt; [!WARNING]</code>, <code>&gt; [!IMPORTANT]</code>.</div>
        <div><strong>• Images & Screenshots:</strong> Paste images from clipboard (<code>Ctrl+V</code>) or drag & drop files directly into editor.</div>
      </div>

      <div class="help-section-title">${t.helpSharingTitle}</div>
      <div style="font-size:12.5px;display:flex;flex-direction:column;gap:6px">
        <div><strong>• Native Desktop:</strong> Save and overwrite <code>.md</code> files directly on disk, with system <code>piuma://</code> link handling.</div>
        <div><strong>• Web App:</strong> Runs anywhere zero-install and allows instant sharing via compressed URL <code>https://...#doc=...</code>.</div>
        <div><strong>• Import from Token:</strong> Use the "Import from Link / Token" button to load any shared document in milliseconds.</div>
      </div>
    `;
  } else {
    $("helpModalBody").innerHTML = `
      <div class="help-section-title">${t.helpShortcutsTitle}</div>
      <div class="shortcut-grid">
        <div class="shortcut-item"><span>Salva su disco</span><span class="kbd-key">Ctrl + S</span></div>
        <div class="shortcut-item"><span>Apri file da computer</span><span class="kbd-key">Ctrl + O</span></div>
        <div class="shortcut-item"><span>Trova e Sostituisci</span><span class="kbd-key">Ctrl + F</span></div>
        <div class="shortcut-item"><span>Modalità Zen (Focus)</span><span class="kbd-key">F11 / Esc</span></div>
        <div class="shortcut-item"><span>Testo Grassetto</span><span class="kbd-key">Ctrl + B</span></div>
        <div class="shortcut-item"><span>Testo Corsivo</span><span class="kbd-key">Ctrl + I</span></div>
        <div class="shortcut-item"><span>Inserisci Collegamento</span><span class="kbd-key">Ctrl + K</span></div>
        <div class="shortcut-item"><span>Indenta / Deindenta</span><span class="kbd-key">Tab / Shift+Tab</span></div>
      </div>

      <div class="help-section-title">${t.helpSyntaxTitle}</div>
      <div style="font-size:12.5px;display:flex;flex-direction:column;gap:8px">
        <div><strong>• Intestazioni:</strong> Usa <code># Titolo 1</code>, <code>## Titolo 2</code>, <code>### Titolo 3</code>.</div>
        <div><strong>• Formattazione:</strong> <code>**grassetto**</code>, <code>*corsivo*</code>, <code>~~barrato~~</code>, <code>==evidenziato==</code>.</div>
        <div><strong>• Checklist Interattive:</strong> Scrivi <code>- [ ] Da fare</code> o <code>- [x] Completato</code> (cliccabili direttamente nell'anteprima).</div>
        <div><strong>• Formule KaTeX:</strong> Inline <code>$E = mc^2$</code> oppure a blocco <code>$$\\int_{a}^{b} f(x)dx$$</code>.</div>
        <div><strong>• Diagrammi Mermaid:</strong> Inserisci un blocco di codice con linguaggio <code>mermaid</code> (es. <code>graph TD A--&gt;B</code>).</div>
        <div><strong>• Callout GitHub:</strong> Usa <code>&gt; [!NOTE]</code>, <code>&gt; [!TIP]</code>, <code>&gt; [!WARNING]</code>, <code>&gt; [!IMPORTANT]</code>.</div>
        <div><strong>• Immagini e Screenshot:</strong> Puoi incollare immagini dagli appunti (<code>Ctrl+V</code>) o trascinarle direttamente nell'editor.</div>
      </div>

      <div class="help-section-title">${t.helpSharingTitle}</div>
      <div style="font-size:12.5px;display:flex;flex-direction:column;gap:6px">
        <div><strong>• Desktop Nativo:</strong> Permette di salvare e sovrascrivere direttamente i file <code>.md</code> su disco e apre i collegamenti <code>piuma://</code> di sistema.</div>
        <div><strong>• Web App:</strong> Funziona ovunque senza installazione e permette di condividere documenti tramite URL compresso <code>https://...#doc=...</code>.</div>
        <div><strong>• Importa da Token:</strong> Usa il pulsante "Importa da Link / Token" per incollare e caricare istantaneamente qualsiasi documento condiviso.</div>
      </div>
    `;
  }
}

function renderImportModalContent(lang) {
  const t = I18N[lang];
  $("importModalTitleText").textContent = t.importModalTitle;
  $("importModalDesc").innerHTML = t.importModalDesc;
  $("tokenInput").placeholder = t.importModalPlaceholder;
  $("btnImportCancel").textContent = t.importModalCancel;
  $("btnConfirmImport").textContent = t.importModalConfirm;
}

/* ==================================================================
   APPLICA LINGUA ALL'INTERA APPLICAZIONE (UI & TOOLTIPS & DOCS)
   ================================================================== */
function applyLanguage(lang, isInitial = false) {
  state.lang = lang || "en";
  localStorage.setItem(K_LANG, state.lang);
  document.documentElement.setAttribute("lang", state.lang);
  const t = I18N[state.lang];

  // 1. Bottone lingua
  if ($("langLabel")) $("langLabel").textContent = t.langBtn;
  if ($("btnLangToggle")) $("btnLangToggle").setAttribute("data-tip", t.langTip);

  // 2. Topbar & Brand
  brandLogo.setAttribute("data-tip", t.brandTip);
  docTitle.placeholder = t.docTitlePlaceholder;
  docTitle.setAttribute("data-tip", t.docTitleTip);
  editor.placeholder = t.editorPlaceholder;

  // 3. Modalità Visualizzazione
  $("btnModeWrite").querySelector("span").textContent = t.modeWrite;
  $("btnModeWrite").setAttribute("data-tip", t.modeWriteTip);
  $("btnModeSplit").querySelector("span").textContent = t.modeSplit;
  $("btnModeSplit").setAttribute("data-tip", t.modeSplitTip);
  $("btnModeRead").querySelector("span").textContent = t.modeRead;
  $("btnModeRead").setAttribute("data-tip", t.modeReadTip);

  // 4. Azioni Topbar
  $("btnSaveDisk").setAttribute("data-tip", t.saveDiskTip);
  $("btnFindToggle").setAttribute("data-tip", t.findToggleTip);
  $("btnTocToggle").setAttribute("data-tip", t.tocToggleTip);
  $("btnZenToggle").setAttribute("data-tip", t.zenToggleTip);
  $("btnThemeMenu").setAttribute("data-tip", t.themeMenuTip);
  $("btnExportMenuToggle").setAttribute("data-tip", t.exportMenuTip);
  $("btnOpenLocal").setAttribute("data-tip", t.openLocalTip);
  $("btnHelpModal").setAttribute("data-tip", t.helpModalTip);
  $("btnAboutModal").setAttribute("data-tip", t.aboutModalTip);
  $("btnToggleSidebar").setAttribute("data-tip", t.toggleSidebarTip);

  // 5. Sidebar
  const sbTitleEl = document.querySelector(".sb-title");
  if (sbTitleEl) {
    sbTitleEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> ${t.sidebarTitle}`;
  }
  $("btnNewDoc").setAttribute("data-tip", t.newDocTip);
  $("searchDocs").placeholder = t.searchDocsPlaceholder;
  $("btnImportTokenModal").innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.43"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.32-1.33"/></svg> ${t.importTokenBtn}`;
  $("btnExportAll").innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t.backupJsonBtn}`;
  $("btnExportAll").setAttribute("data-tip", t.exportAllTip);
  $("btnImportBackup").innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ${t.restoreBackupBtn}`;
  $("btnImportBackup").setAttribute("data-tip", t.restoreBackupTip);

  // 6. Menu Esportazioni
  $("actShareUrl").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.43"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.32-1.33"/></svg> ${t.actShareUrl}`;
  $("actImportToken").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg> ${t.actImportToken}`;
  $("actDownloadMd").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t.actDownloadMd}`;
  $("actDownloadHtml").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> ${t.actDownloadHtml}`;
  $("actPrintPdf").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> ${t.actPrintPdf}`;
  $("actCopyMd").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> ${t.actCopyMd}`;
  $("actCopyRichText").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${t.actCopyRichText}`;

  // 7. Menu Temi
  document.querySelector('[data-set-theme="paper"]').textContent = t.themePaper;
  document.querySelector('[data-set-theme="dark"]').textContent = t.themeDark;
  document.querySelector('[data-set-theme="mint"]').textContent = t.themeMint;
  document.querySelector('[data-set-theme="sepia"]').textContent = t.themeSepia;

  // 8. Toolbar Formattazione Tooltips
  const setTbTip = (act, tip) => {
    const el = document.querySelector(`[data-act="${act}"]`);
    if (el) el.setAttribute("data-tip", tip);
  };
  setTbTip("h1", t.h1Tip);
  setTbTip("h2", t.h2Tip);
  setTbTip("h3", t.h3Tip);
  setTbTip("bold", t.boldTip);
  setTbTip("italic", t.italicTip);
  setTbTip("strike", t.strikeTip);
  setTbTip("mark", t.markTip);
  setTbTip("quote", t.quoteTip);
  setTbTip("code", t.codeTip);
  setTbTip("codeblock", t.codeblockTip);
  setTbTip("math", t.mathTip);
  setTbTip("mermaid", t.mermaidTip);
  setTbTip("link", t.linkTip);
  setTbTip("image", t.imageTip);
  setTbTip("table", t.tableTip);
  setTbTip("ul", t.ulTip);
  setTbTip("ol", t.olTip);
  setTbTip("task", t.taskTip);
  setTbTip("callout-note", t.calloutNoteTip);
  setTbTip("callout-tip", t.calloutTipTip);
  setTbTip("callout-warning", t.calloutWarningTip);

  // 9. Trova e Sostituisci
  $("frFindInput").placeholder = t.findPlaceholder;
  $("frReplaceInput").placeholder = t.replacePlaceholder;
  $("frReplaceBtn").textContent = t.replaceBtn;
  $("frReplaceBtn").setAttribute("data-tip", t.replaceBtnTip);
  $("frReplaceAllBtn").textContent = t.replaceAllBtn;
  $("frReplaceAllBtn").setAttribute("data-tip", t.replaceAllBtnTip);
  $("frPrevBtn").setAttribute("data-tip", t.prevMatchTip);
  $("frNextBtn").setAttribute("data-tip", t.nextMatchTip);
  $("frCloseBtn").setAttribute("data-tip", t.closeFrTip);

  // 10. TOC & Goal
  const tocSpan = document.querySelector(".toc-header span");
  if (tocSpan) tocSpan.textContent = t.tocTitle;
  $("tocCloseBtn").setAttribute("data-tip", t.tocCloseTip);
  $("btnSetGoal").setAttribute("data-tip", t.setGoalTip);

  // 11. Modali
  renderAboutModalContent(state.lang);
  renderHelpModalContent(state.lang);
  renderImportModalContent(state.lang);

  // 12. Traduzione Documento di Benvenuto (se presente)
  let welcomeUpdated = false;
  state.docs.forEach(d => {
    if (d.isWelcomeDoc || d.id === "doc_welcome" || d.title === "Benvenuto in Piuma Pro" || d.title === "Welcome to Piuma Pro" || d.content === SAMPLE_DOC_IT || d.content === SAMPLE_DOC_EN) {
      d.isWelcomeDoc = true;
      d.title = state.lang === "it" ? "Benvenuto in Piuma Pro" : "Welcome to Piuma Pro";
      d.content = state.lang === "it" ? SAMPLE_DOC_IT : SAMPLE_DOC_EN;
      welcomeUpdated = true;
    }
  });

  if (welcomeUpdated) {
    saveStorage();
    const activeDoc = getActiveDoc();
    if (activeDoc && activeDoc.isWelcomeDoc) {
      editor.value = activeDoc.content;
      docTitle.value = activeDoc.title;
    }
  }

  // 13. Rilancio statistiche e liste
  updateStats();
  renderDocsList($("searchDocs").value);
  renderTOC();
  renderPreview();
}

/* ==================================================================
   GESTIONE DOCUMENTI (MULTI-FILE STORAGE)
   ================================================================== */
function generateId() {
  return "doc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
}

function loadStorage() {
  try {
    const rawDocs = localStorage.getItem(K_DOCS) || localStorage.getItem("piuma.documents");
    state.docs = rawDocs ? JSON.parse(rawDocs) : [];
    if (!Array.isArray(state.docs)) state.docs = [];
    state.activeDocId = localStorage.getItem(K_ACTIVE_ID) || localStorage.getItem("piuma.activeDocId");
    state.theme = localStorage.getItem(K_THEME) || "paper";
    state.goalWords = parseInt(localStorage.getItem(K_GOAL) || "500", 10);
    state.lang = localStorage.getItem(K_LANG) || "en";
  } catch (e) {
    console.warn("Storage parse error, resetting state:", e);
    state.docs = [];
  }

  // Sanitizzazione documenti per evitare crash
  state.docs = state.docs.filter(d => d && typeof d === "object").map(d => ({
    id: d.id || generateId(),
    title: typeof d.title === "string" && d.title.trim() ? d.title : (state.lang === "en" ? "Untitled document" : "Documento senza titolo"),
    content: typeof d.content === "string" ? d.content : "",
    isWelcomeDoc: !!d.isWelcomeDoc || d.id === "doc_welcome" || (typeof d.title === "string" && d.title.includes("Piuma Pro")),
    updatedAt: typeof d.updatedAt === "number" ? d.updatedAt : Date.now(),
    filePath: d.filePath || null
  }));

  if (state.docs.length === 0) {
    const isIt = state.lang === "it";
    const initialDoc = {
      id: "doc_welcome",
      title: isIt ? "Benvenuto in Piuma Pro 🪶" : "Welcome to Piuma Pro 🪶",
      content: isIt ? SAMPLE_DOC_IT : SAMPLE_DOC_EN,
      isWelcomeDoc: true,
      updatedAt: Date.now(),
      filePath: null
    };
    state.docs = [initialDoc];
    state.activeDocId = initialDoc.id;
    saveStorage();
  } else if (!state.docs.find(d => d.id === state.activeDocId)) {
    state.activeDocId = state.docs[0].id;
  }
}

function saveStorage() {
  try {
    localStorage.setItem(K_DOCS, JSON.stringify(state.docs));
    localStorage.setItem(K_ACTIVE_ID, state.activeDocId);
    localStorage.setItem(K_THEME, state.theme);
    localStorage.setItem(K_GOAL, state.goalWords.toString());
    localStorage.setItem(K_LANG, state.lang);
  } catch (e) {
    console.error("Errore salvataggio storage:", e);
  }
}

function getActiveDoc() {
  return state.docs.find(d => d.id === state.activeDocId) || state.docs[0];
}

function switchDocument(id) {
  saveCurrentDocImmediately();
  state.activeDocId = id;
  saveStorage();
  loadActiveDocIntoUI();
  renderDocsList();
  const t = I18N[state.lang];
  showToast(t.docLoadedToast);
}

function createNewDocument(title = null, content = "", filePath = null) {
  saveCurrentDocImmediately();
  const t = I18N[state.lang];
  const docTitleText = title || (state.lang === "en" ? "New document" : "Nuovo documento");
  const newDoc = {
    id: generateId(),
    title: docTitleText,
    content: content || "# " + docTitleText + "\n\n" + (state.lang === "en" ? "Start writing here..." : "Inizia a scrivere qui..."),
    isWelcomeDoc: false,
    updatedAt: Date.now(),
    filePath: filePath
  };
  state.docs.unshift(newDoc);
  state.activeDocId = newDoc.id;
  state.currentNativeFilePath = filePath;
  saveStorage();
  loadActiveDocIntoUI();
  renderDocsList();
  editor.focus();
  showToast(t.docCreatedToast);
}

function deleteDocument(id, e) {
  if (e) e.stopPropagation();
  const t = I18N[state.lang];
  if (state.docs.length <= 1) {
    alert(t.cannotDeleteOnlyDoc);
    return;
  }
  if (!confirm(t.deleteConfirm)) return;
  state.docs = state.docs.filter(d => d.id !== id);
  if (state.activeDocId === id) {
    state.activeDocId = state.docs[0].id;
  }
  saveStorage();
  loadActiveDocIntoUI();
  renderDocsList();
  showToast(t.docDeletedToast);
}

function duplicateDocument(id, e) {
  if (e) e.stopPropagation();
  const target = state.docs.find(d => d.id === id);
  if (!target) return;
  const t = I18N[state.lang];
  const dup = {
    id: generateId(),
    title: target.title + (state.lang === "en" ? " (Copy)" : " (Copia)"),
    content: target.content,
    isWelcomeDoc: false,
    updatedAt: Date.now(),
    filePath: null
  };
  state.docs.unshift(dup);
  state.activeDocId = dup.id;
  saveStorage();
  loadActiveDocIntoUI();
  renderDocsList();
  showToast(t.docDuplicatedToast);
}

function renderDocsList(filter = "") {
  const q = (filter || "").toLowerCase().trim();
  const filtered = (state.docs || []).filter(d => {
    if (!d) return false;
    const title = (d.title || "").toLowerCase();
    const content = (d.content || "").toLowerCase();
    return title.includes(q) || content.includes(q);
  });
  const t = I18N[state.lang];
  const dateLocale = state.lang === "en" ? "en-US" : "it-IT";

  if (!docsList) return;

  if (filtered.length === 0 && state.docs.length > 0) {
    docsList.innerHTML = `<div style="padding:16px 12px;font-size:12px;color:var(--text-low);text-align:center;font-style:italic;">${state.lang === "en" ? "No matching documents" : "Nessun documento trovato"}</div>`;
    return;
  }

  docsList.innerHTML = filtered.map(d => {
    const isActive = d.id === state.activeDocId;
    const words = ((d.content || "").match(/\S+/g) || []).length;
    const dDate = new Date(d.updatedAt || Date.now()).toLocaleDateString(dateLocale, { day: "numeric", month: "short" });
    const wordsLabel = t.wordsCount(words);
    const titleText = d.title || (state.lang === "en" ? "Untitled" : "Senza titolo");
    return `
      <div class="doc-item ${isActive ? "active" : ""}" onclick="switchDocument('${d.id}')">
        <div class="doc-item-info">
          <span class="doc-item-title">${escapeHtml(titleText)}</span>
          <span class="doc-item-meta">${dDate} · ${wordsLabel} ${d.filePath ? "💾" : ""}</span>
        </div>
        <div class="doc-item-actions">
          <button class="doc-btn" data-tip="${t.duplicateTip}" onclick="duplicateDocument('${d.id}', event)">📋</button>
          <button class="doc-btn" data-tip="${t.deleteTip}" onclick="deleteDocument('${d.id}', event)">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
}

function loadActiveDocIntoUI() {
  const doc = getActiveDoc();
  if (!doc) return;
  editor.value = doc.content || "";
  docTitle.value = doc.title || "";
  state.currentNativeFilePath = doc.filePath || null;
  filePathDisplay.textContent = doc.filePath ? doc.filePath : "";
  updateStats();
  updateGutter();
  renderPreview();
  renderTOC();
}

function saveCurrentDocImmediately() {
  const doc = getActiveDoc();
  const t = I18N[state.lang];
  if (doc) {
    doc.title = docTitle.value.trim() || (state.lang === "en" ? "Untitled document" : "Documento senza titolo");
    doc.content = editor.value;
    doc.updatedAt = Date.now();
    doc.filePath = state.currentNativeFilePath;
    saveStorage();
    const timeLocale = state.lang === "en" ? "en-US" : "it-IT";
    const timeStr = new Date().toLocaleTimeString(timeLocale, { hour:"2-digit", minute:"2-digit" });
    saveStatus.textContent = t.saved + " · " + timeStr;
    saveDot.classList.remove("saving");

    if (isDesktop && state.currentNativeFilePath) {
      window.electronAPI.saveFileDirect(state.currentNativeFilePath, editor.value);
    }
  }
}

function triggerAutoSave() {
  const t = I18N[state.lang];
  saveStatus.textContent = t.saving;
  saveDot.classList.add("saving");
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => {
    saveCurrentDocImmediately();
    renderDocsList($("searchDocs").value);
  }, 600);
}

/* ==================================================================
   PARSER MARKDOWN POTENZIATO
   ================================================================== */
function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdownCustom(src) {
  const t = I18N[state.lang];
  if (!src) return `<p style='color:var(--sheet-subtext);font-style:italic;'>${t.emptyDocMsg}</p>`;
  src = src.replace(/\r\n?/g, "\n");

  const codeBlocks = [];
  const mathBlocks = [];

  // 1. Math block: $$ ... $$
  src = src.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math: math.trim(), display: true });
    return `\u0005MATH_${idx}\u0005`;
  });

  // 2. Inline Math: $ ... $
  src = src.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (m, prefix, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math: math.trim(), display: false });
    return `${prefix}\u0005MATH_${idx}\u0005`;
  });

  // 3. Fenced Code Blocks (```lang ... ```)
  src = src.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (m, lang, code) => {
    const idx = codeBlocks.length;
    const cleanLang = (lang || "text").trim().toLowerCase();
    codeBlocks.push({ lang: cleanLang, code: code });
    return `\u0001CODE_${idx}\u0001`;
  });

  function parseInline(text) {
    if (!text) return "";
    text = escapeHtml(text);

    // Ripristina math inline placeholders
    text = text.replace(/\u0005MATH_(\d+)\u0005/g, (m, idx) => {
      const mb = mathBlocks[idx];
      if (!mb) return "";
      try {
        return window.katex ? window.katex.renderToString(mb.math, { displayMode: mb.display, throwOnError: false }) : `<code>${escapeHtml(mb.math)}</code>`;
      } catch (e) {
        return escapeHtml(mb.math);
      }
    });

    // Inline Code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Immagini
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

    // Link
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Grassetto, Corsivo, Barrato, Evidenziatore
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/_([^_]+)_/g, "<em>$1</em>");
    text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    text = text.replace(/==([^=]+)==/g, "<mark>$1</mark>");

    return text;
  }

  const lines = src.split("\n");
  const out = [];
  let i = 0;
  let taskCounter = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blocco Codice / Mermaid / Math Placeholder
    const codeMatch = line.match(/^\u0001CODE_(\d+)\u0001$/);
    if (codeMatch) {
      const block = codeBlocks[parseInt(codeMatch[1], 10)];
      if (block) {
        if (block.lang === "mermaid") {
          out.push(`<div class="mermaid">${escapeHtml(block.code)}</div>`);
        } else {
          let cleanLang = (block.lang || "text").trim().toLowerCase();
          let langKey = cleanLang;
          if (langKey === "js") langKey = "javascript";
          else if (langKey === "ts") langKey = "typescript";
          else if (langKey === "py") langKey = "python";
          else if (langKey === "html" || langKey === "xml") langKey = "markup";
          else if (langKey === "md") langKey = "markdown";
          else if (langKey === "sh" || langKey === "bash") langKey = "bash";
          else if (langKey === "css") langKey = "css";
          else if (langKey === "json") langKey = "json";
          
          let highlighted = escapeHtml(block.code);
          if (window.Prism && Prism.languages && Prism.languages[langKey]) {
            try {
              highlighted = Prism.highlight(block.code, Prism.languages[langKey], langKey);
            } catch (err) {}
          }

          out.push(`
            <div class="code-block-wrapper">
              <div class="code-block-header">
                <span>${escapeHtml(cleanLang || "code")}</span>
                <button class="copy-code-btn" onclick="copyCodeBlock(this)">${t.copyBtnLabel}</button>
              </div>
              <pre><code class="language-${escapeHtml(langKey)}">${highlighted}</code></pre>
            </div>
          `);
        }
      }
      i++;
      continue;
    }

    const mathMatch = line.match(/^\u0005MATH_(\d+)\u0005$/);
    if (mathMatch) {
      const mb = mathBlocks[parseInt(mathMatch[1], 10)];
      if (mb) {
        try {
          const rendered = window.katex ? window.katex.renderToString(mb.math, { displayMode: mb.display, throwOnError: false }) : `<pre><code>${escapeHtml(mb.math)}</code></pre>`;
          out.push(`<div class="math-block">${rendered}</div>`);
        } catch (e) {
          out.push(`<div class="math-block"><code>${escapeHtml(mb.math)}</code></div>`);
        }
      }
      i++;
      continue;
    }

    // Linee vuote
    if (!line.trim()) {
      i++;
      continue;
    }

    // GitHub Callouts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION])
    const calloutMatch = line.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/i);
    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase();
      const calloutLines = [];
      if (calloutMatch[2].trim()) calloutLines.push(calloutMatch[2].trim());
      i++;
      while (i < lines.length && lines[i].startsWith(">")) {
        calloutLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const icons = {
        note: "ℹ️", tip: "💡", warning: "⚠️", important: "❗", caution: "🛑"
      };
      const title = type.toUpperCase();
      out.push(`
        <div class="callout callout-${type}">
          <div class="callout-title">${icons[type] || "📌"} ${title}</div>
          <div class="callout-content">${parseInline(calloutLines.join("\n")).replace(/\n/g, "<br>")}</div>
        </div>
      `);
      continue;
    }

    // Quote standard
    if (line.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${parseInline(quoteLines.join("\n")).replace(/\n/g, "<br>")}</blockquote>`);
      continue;
    }

    // Orizzontale HR
    if (/^(---|___|\*\*\*)$/.test(line.trim())) {
      out.push("<hr>");
      i++;
      continue;
    }

    // Headings H1 - H6
    const headMatch = line.match(/^(\#{1,6})\s+(.+)$/);
    if (headMatch) {
      const level = headMatch[1].length;
      const text = headMatch[2].trim();
      const id = "h-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h${level} id="${id}">${parseInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Tabelle Markdown (| ... | ... |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = r => r.slice(1, -1).split("|").map(c => c.trim());
        const headerCols = parseRow(tableLines[0]);
        let bodyRows = tableLines.slice(2);
        
        let thead = "<tr>" + headerCols.map(c => `<th>${parseInline(c)}</th>`).join("") + "</tr>";
        let tbody = bodyRows.map(rowStr => {
          const cols = parseRow(rowStr);
          return "<tr>" + cols.map(c => `<td>${parseInline(c)}</td>`).join("") + "</tr>";
        }).join("");

        out.push(`<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`);
        continue;
      }
    }

    // Liste Ordinate, Non Ordinate & Checklist
    const isTask = /^\s*[-*+]\s+\[[ xX]\]\s+/.test(line);
    const isBullet = /^\s*[-*+]\s+/.test(line);
    const isOrdered = /^\s*\d+[.)]\s+/.test(line);

    if (isBullet || isOrdered) {
      const listItems = [];
      while (i < lines.length && (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]))) {
        const itemLine = lines[i];
        const taskMatch = itemLine.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/);
        
        if (taskMatch) {
          const isChecked = taskMatch[1].toLowerCase() === "x";
          const currTaskIdx = taskCounter++;
          listItems.push(`
            <li class="task-item ${isChecked ? "checked" : ""}">
              <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleTaskCheckbox(${currTaskIdx})">
              <span>${parseInline(taskMatch[2])}</span>
            </li>
          `);
        } else {
          const itemText = itemLine.replace(/^\s*([-*+]|\d+[.)])\s+/, "");
          listItems.push(`<li>${parseInline(itemText)}</li>`);
        }
        i++;
      }
      out.push(isOrdered ? `<ol>${listItems.join("")}</ol>` : `<ul>${listItems.join("")}</ul>`);
      continue;
    }

    // Paragrafo
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|[-*+]|\d+[.)]|---|\u0001CODE|\u0005MATH)/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${parseInline(para.join("\n")).replace(/\n/g, "<br>")}</p>`);
  }

  // Sostituisci math placeholders rimasti
  let finalHtml = out.join("\n");
  finalHtml = finalHtml.replace(/\u0005MATH_(\d+)\u0005/g, (m, idx) => {
    const mb = mathBlocks[idx];
    if (!mb) return "";
    try {
      return window.katex ? window.katex.renderToString(mb.math, { displayMode: mb.display, throwOnError: false }) : `<code>${escapeHtml(mb.math)}</code>`;
    } catch (e) {
      return escapeHtml(mb.math);
    }
  });

  return finalHtml;
}

// Toggle Checklist interattiva dall'anteprima
window.toggleTaskCheckbox = function(taskIdx) {
  let count = 0;
  editor.value = editor.value.replace(/^(\s*[-*+]\s+\[)([ xX])(\]\s+.*)$/gm, (match, prefix, check, suffix) => {
    if (count === taskIdx) {
      const newCheck = check.toLowerCase() === "x" ? " " : "x";
      count++;
      return `${prefix}${newCheck}${suffix}`;
    }
    count++;
    return match;
  });
  handleEditorInput();
};

function renderPreview() {
  if (state.mode === "write") return;
  preview.innerHTML = renderMarkdownCustom(editor.value);

  // Inizializza Syntax Highlighting con Prism
  if (window.Prism) {
    try {
      Prism.highlightAllUnder(preview);
    } catch (e) {}
  }

  // Inizializza Diagrammi Mermaid
  if (window.mermaid) {
    try {
      mermaid.init(undefined, preview.querySelectorAll(".mermaid"));
    } catch (e) {}
  }
}

// Copia codice blocco
window.copyCodeBlock = function(btn) {
  const wrapper = btn.closest(".code-block-wrapper");
  const codeEl = wrapper ? wrapper.querySelector("pre code") : null;
  const code = codeEl ? codeEl.innerText : (btn.nextElementSibling ? btn.nextElementSibling.innerText : "");
  const t = I18N[state.lang];
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = t.copiedBtnLabel;
    setTimeout(() => btn.textContent = t.copyBtnLabel, 1500);
  });
};

/* ==================================================================
   GUTTER NUMERI DI RIGA & STATISTICHE
   ================================================================== */
function updateGutter() {
  const lineCount = editor.value.split("\n").length;
  let gutterHtml = "";
  for (let i = 1; i <= lineCount; i++) {
    gutterHtml += `<div class="gutter-line">${i}</div>`;
  }
  lineGutter.innerHTML = gutterHtml;
}

function updateStats() {
  const t = I18N[state.lang];
  const val = editor.value;
  const words = (val.match(/\S+/g) || []).length;
  const chars = val.length;
  const mins = words ? Math.max(1, Math.round(words / 200)) : 0;

  $("statWords").textContent = t.wordsCount(words);
  $("statChars").textContent = t.charsCount(chars);
  $("statReadTime").textContent = t.readTime(mins);

  // Caret Position
  const upto = val.slice(0, editor.selectionStart).split("\n");
  const line = upto.length;
  const col = upto[upto.length - 1].length + 1;
  $("caretInfo").textContent = `Ln ${line}, Col ${col}`;

  // Goal Progress
  const pct = Math.min(100, Math.round((words / state.goalWords) * 100));
  $("goalProgress").style.width = pct + "%";
  $("goalLabel").textContent = t.targetGoal(words, state.goalWords, pct);
}

/* ==================================================================
   TABLE OF CONTENTS (OUTLINE)
   ================================================================== */
function renderTOC() {
  const t = I18N[state.lang];
  const headings = [];
  const lines = editor.value.split("\n");
  lines.forEach((line, lineNum) => {
    const m = line.match(/^(\#{1,4})\s+(.+)$/);
    if (m) {
      const lvl = m[1].length;
      const text = m[2].replace(/[*_~`]/g, "");
      const id = "h-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ lvl, text, id, lineNum });
    }
  });

  const tocList = $("tocList");
  if (headings.length === 0) {
    tocList.innerHTML = `<span style='font-size:12px;color:var(--text-low);font-style:italic;'>${t.tocEmpty}</span>`;
    return;
  }

  tocList.innerHTML = headings.map(h => `
    <div class="toc-item h${h.lvl}" onclick="scrollToHeading('${h.id}', ${h.lineNum})">
      ${escapeHtml(h.text)}
    </div>
  `).join("");
}

window.scrollToHeading = function(id, lineNum) {
  if (state.mode === "write") {
    const lines = editor.value.split("\n");
    let charPos = 0;
    for (let l = 0; l < lineNum; l++) charPos += lines[l].length + 1;
    editor.focus();
    editor.setSelectionRange(charPos, charPos);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/* ==================================================================
   SCROLL SINCRONIZZATO (SPLIT VIEW)
   ================================================================== */
editor.addEventListener("scroll", () => {
  lineGutter.scrollTop = editor.scrollTop;
  if (state.mode !== "split" || state.isSyncingScroll) return;
  state.isSyncingScroll = true;
  const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
  panePreview.scrollTop = ratio * (panePreview.scrollHeight - panePreview.clientHeight);
  setTimeout(() => state.isSyncingScroll = false, 50);
});

panePreview.addEventListener("scroll", () => {
  if (state.mode !== "split" || state.isSyncingScroll) return;
  state.isSyncingScroll = true;
  const ratio = panePreview.scrollTop / (panePreview.scrollHeight - panePreview.clientHeight || 1);
  editor.scrollTop = ratio * (editor.scrollHeight - editor.clientHeight);
  lineGutter.scrollTop = editor.scrollTop;
  setTimeout(() => state.isSyncingScroll = false, 50);
});

/* ==================================================================
   SMART EDITING & TOOLBAR ACTIONS
   ================================================================== */
function insertFormatting(before, after = "", defaultText = "testo") {
  editor.focus();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.substring(start, end);
  const replacement = selected ? (before + selected + after) : (before + defaultText + after);

  document.execCommand("insertText", false, replacement);
  
  if (!selected) {
    editor.setSelectionRange(start + before.length, start + before.length + defaultText.length);
  }
  handleEditorInput();
}

function insertLinePrefix(prefix) {
  editor.focus();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;
  const lineStart = val.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = val.indexOf("\n", end);
  const effectiveLineEnd = lineEnd === -1 ? val.length : lineEnd;

  const lines = val.substring(lineStart, effectiveLineEnd).split("\n");
  const modified = lines.map(l => l.startsWith(prefix) ? l.slice(prefix.length) : prefix + l).join("\n");

  editor.setSelectionRange(lineStart, effectiveLineEnd);
  document.execCommand("insertText", false, modified);
  handleEditorInput();
}

const toolbarActions = {
  h1: () => insertLinePrefix("# "),
  h2: () => insertLinePrefix("## "),
  h3: () => insertLinePrefix("### "),
  bold: () => insertFormatting("**", "**", "grassetto"),
  italic: () => insertFormatting("*", "*", "corsivo"),
  strike: () => insertFormatting("~~", "~~", "barrato"),
  mark: () => insertFormatting("==", "==", "evidenziato"),
  quote: () => insertLinePrefix("> "),
  code: () => insertFormatting("`", "`", "codice"),
  codeblock: () => insertFormatting("```javascript\n", "\n```", "// il tuo codice"),
  math: () => insertFormatting("$$ ", " $$", "E = mc^2"),
  mermaid: () => insertFormatting("```mermaid\ngraph TD\n    A[Inizio] --> B[Fine]\n```\n"),
  link: () => insertFormatting("[", "](https://example.com)", "titolo del link"),
  image: () => insertFormatting("![", "](https://picsum.photos/600/400)", "descrizione immagine"),
  table: () => insertFormatting("\n| Intestazione 1 | Intestazione 2 |\n| --- | --- |\n| Valore 1 | Valore 2 |\n\n"),
  ul: () => insertLinePrefix("- "),
  ol: () => insertLinePrefix("1. "),
  task: () => insertLinePrefix("- [ ] "),
  "callout-note": () => insertFormatting("> [!NOTE]\n> ", "", "Scrivi qui la tua nota..."),
  "callout-tip": () => insertFormatting("> [!TIP]\n> ", "", "Scrivi qui il tuo suggerimento..."),
  "callout-warning": () => insertFormatting("> [!WARNING]\n> ", "", "Scrivi qui il tuo avviso...")
};

document.querySelectorAll("[data-act]").forEach(btn => {
  btn.addEventListener("click", () => {
    const act = btn.getAttribute("data-act");
    if (toolbarActions[act]) toolbarActions[act]();
  });
});

/* Smart Key Events: Auto-list, Bracket wrapping, Tab indent */
editor.addEventListener("keydown", e => {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;

  // Tab & Shift+Tab
  if (e.key === "Tab") {
    e.preventDefault();
    if (start !== end) {
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = val.indexOf("\n", end) === -1 ? val.length : val.indexOf("\n", end);
      const lines = val.substring(lineStart, lineEnd).split("\n");
      const mod = e.shiftKey
        ? lines.map(l => l.startsWith("  ") ? l.slice(2) : l).join("\n")
        : lines.map(l => "  " + l).join("\n");
      editor.setSelectionRange(lineStart, lineEnd);
      document.execCommand("insertText", false, mod);
    } else {
      document.execCommand("insertText", false, "  ");
    }
    handleEditorInput();
    return;
  }

  // Enter in lists (Smart auto-continue)
  if (e.key === "Enter" && !e.shiftKey) {
    const lineStart = val.lastIndexOf("\n", start - 1) + 1;
    const currentLine = val.substring(lineStart, start);

    // Checklist
    const taskMatch = currentLine.match(/^(\s*[-*+]\s+\[[ xX]\]\s+)(.*)$/);
    if (taskMatch) {
      e.preventDefault();
      if (taskMatch[2].trim() === "") {
        editor.setSelectionRange(lineStart, start);
        document.execCommand("insertText", false, "");
      } else {
        document.execCommand("insertText", false, "\n- [ ] ");
      }
      handleEditorInput();
      return;
    }

    // Bullet list
    const bulletMatch = currentLine.match(/^(\s*[-*+]\s+)(.*)$/);
    if (bulletMatch) {
      e.preventDefault();
      if (bulletMatch[2].trim() === "") {
        editor.setSelectionRange(lineStart, start);
        document.execCommand("insertText", false, "");
      } else {
        document.execCommand("insertText", false, "\n" + bulletMatch[1]);
      }
      handleEditorInput();
      return;
    }

    // Numbered list
    const numMatch = currentLine.match(/^(\s*)(\d+)([.)]\s+)(.*)$/);
    if (numMatch) {
      e.preventDefault();
      if (numMatch[4].trim() === "") {
        editor.setSelectionRange(lineStart, start);
        document.execCommand("insertText", false, "");
      } else {
        const nextNum = parseInt(numMatch[2], 10) + 1;
        document.execCommand("insertText", false, `\n${numMatch[1]}${nextNum}${numMatch[3]}`);
      }
      handleEditorInput();
      return;
    }
  }

  // Auto-pair brackets & quotes
  const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`', '*': '*' };
  if (pairs[e.key]) {
    if (start !== end) {
      e.preventDefault();
      const selected = val.substring(start, end);
      document.execCommand("insertText", false, e.key + selected + pairs[e.key]);
      editor.setSelectionRange(start + 1, end + 1);
      handleEditorInput();
    }
  }
});

/* Drag & Drop e Incolla Immagini */
editor.addEventListener("paste", e => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  const t = I18N[state.lang];
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      e.preventDefault();
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = evt => {
        insertFormatting(`![${state.lang === "en" ? "Pasted image" : "Immagine incollata"}](`, `)`, evt.target.result);
        showToast(t.imagePastedToast);
      };
      reader.readAsDataURL(blob);
    }
  }
});

editor.addEventListener("dragover", e => e.preventDefault());
editor.addEventListener("drop", e => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const t = I18N[state.lang];
  if (files && files[0] && files[0].type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = evt => {
      insertFormatting(`![${files[0].name}](`, `)`, evt.target.result);
      showToast(t.imageInsertedToast);
    };
    reader.readAsDataURL(files[0]);
  }
});

function handleEditorInput() {
  updateGutter();
  updateStats();
  renderPreview();
  renderTOC();
  triggerAutoSave();
}

editor.addEventListener("input", handleEditorInput);
docTitle.addEventListener("input", () => {
  const doc = getActiveDoc();
  if (doc) doc.title = docTitle.value;
  triggerAutoSave();
});

["keyup", "click", "select", "focus"].forEach(ev => editor.addEventListener(ev, updateStats));

/* ==================================================================
   TROVA E SOSTITUISCI (FIND & REPLACE) CON AUTO-SCROLL & HIGHLIGHT
   ================================================================== */
const frBar = $("findReplaceBar");
const frFindInput = $("frFindInput");
const frReplaceInput = $("frReplaceInput");
const frCount = $("frCount");
let frMatches = [];
let frCurrentIdx = -1;

function findOccurrences(isTyping) {
  const q = frFindInput.value;
  const t = I18N[state.lang];
  frMatches = [];
  frCurrentIdx = -1;
  if (!q) {
    frCount.textContent = t.replaceCount(0, 0);
    return;
  }

  const val = editor.value.toLowerCase();
  const query = q.toLowerCase();
  let pos = val.indexOf(query);
  while (pos !== -1) {
    frMatches.push(pos);
    pos = val.indexOf(query, pos + query.length);
  }

  if (frMatches.length > 0) {
    frCurrentIdx = 0;
    highlightCurrentMatch(!isTyping);
  } else {
    frCount.textContent = t.replaceCount(0, 0);
  }
}

function highlightCurrentMatch(shouldFocusEditor) {
  if (frCurrentIdx < 0 || frCurrentIdx >= frMatches.length) return;
  const start = frMatches[frCurrentIdx];
  const end = start + frFindInput.value.length;
  const t = I18N[state.lang];

  // 1. Evidenzia selezione nell'editor
  if (shouldFocusEditor) {
    editor.focus();
  }
  editor.setSelectionRange(start, end);
  frCount.textContent = t.replaceCount(frCurrentIdx + 1, frMatches.length);

  // 2. Scroll fluido dell'Editor fino all'occorrenza
  const textUpToMatch = editor.value.substring(0, start);
  const lineNum = textUpToMatch.split("\n").length - 1;
  const totalLines = editor.value.split("\n").length || 1;
  const avgLineHeight = editor.scrollHeight / totalLines;
  const targetTop = Math.max(0, (lineNum * avgLineHeight) - (editor.clientHeight / 3));
  editor.scrollTo({ top: targetTop, behavior: "smooth" });

  // 3. Scroll fluido sincronizzato dell'Anteprima di Lettura
  if (state.mode === "split" || state.mode === "read") {
    const ratio = targetTop / (editor.scrollHeight - editor.clientHeight || 1);
    panePreview.scrollTo({
      top: ratio * (panePreview.scrollHeight - panePreview.clientHeight || 1),
      behavior: "smooth"
    });
  }
}

frFindInput.addEventListener("input", function() { findOccurrences(true); });

frFindInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    if (frMatches.length === 0) return;
    if (e.shiftKey) {
      frCurrentIdx = (frCurrentIdx - 1 + frMatches.length) % frMatches.length;
    } else {
      frCurrentIdx = (frCurrentIdx + 1) % frMatches.length;
    }
    highlightCurrentMatch(true);
    frFindInput.focus();
  }
});

$("frNextBtn").addEventListener("click", function() {
  if (frMatches.length === 0) return;
  frCurrentIdx = (frCurrentIdx + 1) % frMatches.length;
  highlightCurrentMatch(true);
});

$("frPrevBtn").addEventListener("click", function() {
  if (frMatches.length === 0) return;
  frCurrentIdx = (frCurrentIdx - 1 + frMatches.length) % frMatches.length;
  highlightCurrentMatch(true);
});

$("frReplaceBtn").addEventListener("click", function() {
  if (frCurrentIdx < 0 || frMatches.length === 0) return;
  const start = frMatches[frCurrentIdx];
  const end = start + frFindInput.value.length;
  editor.setSelectionRange(start, end);
  document.execCommand("insertText", false, frReplaceInput.value);
  handleEditorInput();
  findOccurrences(true);
});

$("frReplaceAllBtn").addEventListener("click", function() {
  if (!frFindInput.value) return;
  const escapedQuery = frFindInput.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "gi");
  editor.value = editor.value.replace(regex, frReplaceInput.value);
  handleEditorInput();
  findOccurrences(true);
  const t = I18N[state.lang];
  showToast(t.replaceCompleteToast);
});

$("frCloseBtn").addEventListener("click", function() { frBar.classList.remove("show"); });
$("btnFindToggle").addEventListener("click", function() {
  frBar.classList.toggle("show");
  if (frBar.classList.contains("show")) {
    frFindInput.focus();
    frFindInput.select();
    if (frFindInput.value) {
      findOccurrences(true);
    }
  }
});

/* ==================================================================
   MODALITÀ DI VISUALIZZAZIONE & ZEN MODE CON TRANSIZIONI FLUIDE
   ================================================================== */
function setViewMode(mode) {
  if (!mode) mode = "split";
  state.mode = mode;
  stage.className = `stage mode-${mode}`;
  const viewModesEl = $("viewModes");
  if (viewModesEl) viewModesEl.setAttribute("data-current-mode", mode);

  document.querySelectorAll(".view-modes .mode-btn").forEach(b => {
    const isActive = b.dataset.mode === mode;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  if (mode === "read" || mode === "split") {
    renderPreview();
  }
  if (mode === "write") {
    editor.focus();
  }
}

document.querySelectorAll(".view-modes .mode-btn").forEach(b => {
  b.addEventListener("click", function() {
    setViewMode(b.dataset.mode);
  });
});

function toggleZenMode() {
  state.isZen = !state.isZen;
  document.body.classList.toggle("zen-mode", state.isZen);
  if (state.isZen) {
    const t = I18N[state.lang];
    showToast(t.zenToast);
  }
}

$("btnZenToggle").addEventListener("click", toggleZenMode);
$("btnExitZen").addEventListener("click", toggleZenMode);

/* ==================================================================
   GESTIONE TEMI
   ================================================================== */
function applyTheme(t) {
  state.theme = t || "paper";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem(K_THEME, state.theme);
  document.querySelectorAll("[data-set-theme]").forEach(b => {
    b.classList.toggle("active", b.dataset.setTheme === state.theme);
  });
}

document.querySelectorAll("[data-set-theme]").forEach(b => {
  b.addEventListener("click", function() {
    applyTheme(b.dataset.setTheme);
    $("themeDropdown").classList.remove("show");
  });
});

$("btnThemeMenu").addEventListener("click", function(e) {
  e.stopPropagation();
  $("themeDropdown").classList.toggle("show");
});

/* ==================================================================
   ESPORTAZIONI, CONDIVISIONE & TOKEN
   ================================================================== */
$("btnExportMenuToggle").addEventListener("click", e => {
  e.stopPropagation();
  $("exportDropdown").classList.toggle("show");
});

function slugify(text) {
  return (text || "documento").trim().toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "documento";
}

// Genera Token o Link di Condivisione
function generateShareData() {
  const docData = {
    title: docTitle.value.trim() || (state.lang === "en" ? "Piuma Document" : "Documento Piuma"),
    content: editor.value
  };

  const rawCompressed = window.LZString ? LZString.compressToEncodedURIComponent(JSON.stringify(docData)) : "";
  const token = "PIUMA:" + rawCompressed;

  let shareLink = "";
  if (isDesktop) {
    shareLink = `piuma://open#doc=${rawCompressed}`;
  } else if (window.location.protocol.startsWith("http")) {
    shareLink = `${window.location.origin}${window.location.pathname}#doc=${rawCompressed}`;
  } else {
    shareLink = token;
  }

  return { token, shareLink };
}

$("actShareUrl").addEventListener("click", () => {
  const { token, shareLink } = generateShareData();
  const t = I18N[state.lang];

  navigator.clipboard.writeText(shareLink).then(() => {
    showToast(isDesktop ? t.shareLinkCopiedDesktop : t.shareLinkCopiedWeb);
  }).catch(() => {
    prompt(state.lang === "en" ? "Copy this share link:" : "Copia questo link di condivisione:", shareLink);
  });
  $("exportDropdown").classList.remove("show");
});

// 1. Salva con nome / Salva su disco nativo
async function handleSaveToDisk() {
  const t = I18N[state.lang];
  if (isDesktop) {
    if (state.currentNativeFilePath) {
      const res = await window.electronAPI.saveFileDirect(state.currentNativeFilePath, editor.value);
      if (res.success) {
        showToast(t.fileSavedToast);
        saveCurrentDocImmediately();
      }
    } else {
      const res = await window.electronAPI.saveFileDialog(editor.value, docTitle.value);
      if (!res.canceled && res.filePath) {
        state.currentNativeFilePath = res.filePath;
        filePathDisplay.textContent = res.filePath;
        const doc = getActiveDoc();
        if (doc) doc.filePath = res.filePath;
        saveCurrentDocImmediately();
        showToast(t.fileSavedSuccessToast);
      }
    }
  } else {
    const filename = slugify(docTitle.value) + ".md";
    const blob = new Blob([editor.value], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
    showToast((state.lang === "en" ? "File downloaded: " : "File scaricato: ") + filename);
  }
}

$("btnSaveDisk").addEventListener("click", handleSaveToDisk);
$("actDownloadMd").addEventListener("click", () => {
  const t = I18N[state.lang];
  if (isDesktop) {
    window.electronAPI.saveFileDialog(editor.value, docTitle.value).then(res => {
      if (!res.canceled && res.filePath) {
        state.currentNativeFilePath = res.filePath;
        filePathDisplay.textContent = res.filePath;
        saveCurrentDocImmediately();
        showToast(t.fileSavedSuccessToast);
      }
    });
  } else {
    const filename = slugify(docTitle.value) + ".md";
    const blob = new Blob([editor.value], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
    showToast((state.lang === "en" ? "File downloaded: " : "File scaricato: ") + filename);
  }
});

// 2. Scarica HTML Standalone
$("actDownloadHtml").addEventListener("click", () => {
  const t = I18N[state.lang];
  const filename = slugify(docTitle.value) + ".html";
  const content = renderMarkdownCustom(editor.value);
  const standaloneHtml = '<!DOCTYPE html>\n<html lang="' + state.lang + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + escapeHtml(docTitle.value) + '</title>\n<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">\n<style>\nbody { font-family: Space Grotesk, system-ui, sans-serif; line-height: 1.8; color: #1F3034; background: #F7F8F4; margin: 0; padding: 40px 20px; }\n.container { max-width: 820px; margin: 0 auto; background: #fff; padding: 48px 56px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }\nh1, h2, h3 { font-family: Fraunces, serif; }\nh1 { font-size: 2.2rem; border-bottom: 2px solid #e0e6de; padding-bottom: 0.3em; }\ncode { font-family: JetBrains Mono, monospace; background: #ecefe8; padding: 2px 6px; border-radius: 4px; color: #d9531e; }\npre { background: #0d1618; color: #e6f0ed; padding: 18px; border-radius: 10px; overflow-x: auto; font-family: JetBrains Mono, monospace; }\nblockquote { border-left: 4px solid #FF6B2C; background: rgba(255,107,44,0.08); padding: 12px 18px; margin: 20px 0; border-radius: 0 8px 8px 0; }\ntable { width: 100%; border-collapse: collapse; margin: 20px 0; }\nth, td { border: 1px solid #dfe5dc; padding: 10px 14px; text-align: left; }\nth { background: #f0f4ee; }\n.callout { padding: 14px 18px; border-radius: 10px; margin: 20px 0; border-left: 5px solid; }\n.callout.note { border-color: #3b82f6; background: #eff6ff; }\n.callout.tip { border-color: #10b981; background: #ecfdf5; }\n.callout.warning { border-color: #f59e0b; background: #fffbeb; }\n</style>\n</head>\n<body>\n<div class="container">\n' + content + '\n</div>\n</body>\n</html>';

  const blob = new Blob([standaloneHtml], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
  showToast(t.htmlExportedToast);
});

// 3. Stampa / PDF
$("actPrintPdf").addEventListener("click", () => {
  renderPreview();
  $("exportDropdown").classList.remove("show");
  setTimeout(() => {
    window.print();
  }, 100);
});

// 4. Copia Markdown
$("actCopyMd").addEventListener("click", () => {
  const t = I18N[state.lang];
  navigator.clipboard.writeText(editor.value).then(() => showToast(t.mdCopiedToast));
});

// 5. Copia Rich Text
$("actCopyRichText").addEventListener("click", () => {
  const t = I18N[state.lang];
  const html = renderMarkdownCustom(editor.value);
  const blob = new Blob([html], { type: "text/html" });
  const textBlob = new Blob([editor.value], { type: "text/plain" });
  const data = [new ClipboardItem({ "text/html": blob, "text/plain": textBlob })];

  navigator.clipboard.write(data).then(() => {
    showToast(t.richTextCopiedToast);
  }).catch(() => {
    navigator.clipboard.writeText(html);
    showToast("HTML " + (state.lang === "en" ? "copied ✓" : "copiato ✓"));
  });
});

/* ==================================================================
   DECODIFICA TOKEN / LINK CONDIVISO
   ================================================================== */
function decodeSharePayload(raw) {
  if (!raw) return null;
  raw = raw.trim();

  let cleanPayload = raw;
  if (cleanPayload.includes("#doc=")) {
    cleanPayload = cleanPayload.split("#doc=")[1];
  } else if (cleanPayload.startsWith("PIUMA:")) {
    cleanPayload = cleanPayload.slice(6);
  } else if (cleanPayload.startsWith("piuma://")) {
    cleanPayload = cleanPayload.replace(/^piuma:\/\/[^#]*#doc=/, "");
  }

  try {
    let jsonStr = "";
    if (window.LZString) {
      jsonStr = LZString.decompressFromEncodedURIComponent(cleanPayload);
    }
    if (!jsonStr) {
      jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(cleanPayload))));
    }
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.warn("Errore decodifica payload:", e);
  }
  return null;
}

function importDocFromUrlOrToken(raw) {
  const parsed = decodeSharePayload(raw);
  const t = I18N[state.lang];
  if (parsed && (parsed.content !== undefined || parsed.title !== undefined)) {
    const sharedDoc = {
      id: generateId(),
      title: (parsed.title || (state.lang === "en" ? "Shared Document" : "Documento Condiviso")) + " 🔗",
      content: parsed.content || "",
      isWelcomeDoc: false,
      updatedAt: Date.now(),
      filePath: null
    };
    state.docs.unshift(sharedDoc);
    state.activeDocId = sharedDoc.id;
    state.currentNativeFilePath = null;
    saveStorage();
    loadActiveDocIntoUI();
    renderDocsList();
    showToast(state.lang === "en" ? "Document imported successfully! 🪶" : "Documento importato con successo! 🪶");
    return true;
  }
  return false;
}

/* ==================================================================
   GESTIONE MODALI (IMPORT, ABOUT, HELP)
   ================================================================== */
function closeAllModals() {
  importModal.classList.remove("show");
  aboutModal.classList.remove("show");
  helpModal.classList.remove("show");
}

function openImportModal() {
  closeAllModals();
  tokenInput.value = "";
  importModal.classList.add("show");
  tokenInput.focus();
}

function openAboutModal() {
  closeAllModals();
  renderAboutModalContent(state.lang);
  aboutModal.classList.add("show");
}

function openHelpModal() {
  closeAllModals();
  renderHelpModalContent(state.lang);
  helpModal.classList.add("show");
}

$("btnImportTokenModal").addEventListener("click", openImportModal);
$("actImportToken").addEventListener("click", () => {
  openImportModal();
  $("exportDropdown").classList.remove("show");
});

$("btnAboutModal").addEventListener("click", openAboutModal);
$("btnHelpModal").addEventListener("click", openHelpModal);

$("btnConfirmImport").addEventListener("click", () => {
  const val = tokenInput.value.trim();
  const t = I18N[state.lang];
  if (!val) return;
  const ok = importDocFromUrlOrToken(val);
  if (ok) {
    closeAllModals();
  } else {
    alert(t.invalidTokenAlert);
  }
});

// Chiusura modali cliccando sull'overlay
document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeAllModals();
  });
});

/* ==================================================================
   FILE SYSTEM LOCALE & DESKTOP IPC
   ================================================================== */
async function handleOpenLocalFile() {
  if (isDesktop) {
    const res = await window.electronAPI.openFileDialog();
    if (!res.canceled && res.content !== undefined) {
      createNewDocument(res.fileName || (state.lang === "en" ? "Opened File" : "File Aperto"), res.content, res.filePath);
    }
  } else {
    $("localMdFileInput").click();
  }
}

$("btnOpenLocal").addEventListener("click", handleOpenLocalFile);
$("localMdFileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const title = file.name.replace(/\.(md|markdown|txt)$/i, "");
    createNewDocument(title, evt.target.result);
  };
  reader.readAsText(file);
});

$("btnExportAll").addEventListener("click", () => {
  const dataStr = JSON.stringify(state.docs, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `piuma_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  const t = I18N[state.lang];
  showToast(t.backupExportedToast);
});

$("btnImportBackup").addEventListener("click", () => $("backupFileInput").click());
$("backupFileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  const t = I18N[state.lang];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported) && imported.length > 0) {
        state.docs = imported;
        state.activeDocId = imported[0].id;
        saveStorage();
        loadActiveDocIntoUI();
        renderDocsList();
        showToast(t.backupRestoredToast);
      }
    } catch (err) {
      alert(t.backupErrorAlert);
    }
  };
  reader.readAsText(file);
});

/* ==================================================================
   TOC OUTLINE, SIDEBAR TOGGLES & GLOBAL TOOLTIPS
   ================================================================== */
$("btnTocToggle").addEventListener("click", () => $("tocPanel").classList.toggle("show"));
$("tocCloseBtn").addEventListener("click", () => $("tocPanel").classList.remove("show"));
$("btnToggleSidebar").addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  window.scrollTo(0, 0);
  document.body.scrollLeft = 0;
  document.documentElement.scrollLeft = 0;
  if ($("appMain")) $("appMain").scrollLeft = 0;
});
$("btnNewDoc").addEventListener("click", () => createNewDocument());

/* Global Tooltip Engine (con rilevamento automatico dei bordi dello schermo) */
const globalTooltip = document.createElement("div");
globalTooltip.className = "global-tooltip";
document.body.appendChild(globalTooltip);

document.addEventListener("mouseover", e => {
  const target = e.target.closest("[data-tip]");
  if (target && target.getAttribute("data-tip")) {
    if (document.activeElement === target && target.tagName === "INPUT") return;
    globalTooltip.textContent = target.getAttribute("data-tip");
    globalTooltip.classList.add("show");

    const rect = target.getBoundingClientRect();
    const tipWidth = globalTooltip.offsetWidth;
    const padding = 12;

    let left = rect.left + rect.width / 2;

    // Evita che il tooltip esca dal bordo destro dello schermo
    if (left + tipWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - padding - tipWidth / 2;
    }
    // Evita che il tooltip esca dal bordo sinistro
    if (left - tipWidth / 2 < padding) {
      left = padding + tipWidth / 2;
    }

    globalTooltip.style.top = (rect.bottom + 8) + "px";
    globalTooltip.style.left = left + "px";
  }
});
document.addEventListener("mouseout", e => {
  if (e.target.closest("[data-tip]")) {
    globalTooltip.classList.remove("show");
  }
});
document.addEventListener("focusin", e => {
  if (e.target.hasAttribute && e.target.hasAttribute("data-tip")) {
    globalTooltip.classList.remove("show");
  }
});
document.addEventListener("mousedown", () => globalTooltip.classList.remove("show"));
window.addEventListener("scroll", () => globalTooltip.classList.remove("show"), true);

$("searchDocs").addEventListener("input", e => renderDocsList(e.target.value));

/* Impostazione Obiettivo Parole */
$("btnSetGoal").addEventListener("click", () => {
  const t = I18N[state.lang];
  const input = prompt(t.setGoalPrompt, state.goalWords);
  if (input && !isNaN(input)) {
    state.goalWords = Math.max(50, parseInt(input, 10));
    saveStorage();
    updateStats();
    showToast(t.setGoalToast(state.goalWords));
  }
});

/* Evento Switch Lingua IT / EN */
if ($("btnLangToggle")) {
  $("btnLangToggle").addEventListener("click", () => {
    const nextLang = state.lang === "en" ? "it" : "en";
    applyLanguage(nextLang);
    showToast(nextLang === "en" ? "Language switched to English 🇬🇧" : "Lingua impostata su Italiano 🇮🇹");
  });
}

/* ==================================================================
   SCORCIATOIE DA TASTIERA GLOBALI
   ================================================================== */
document.addEventListener("keydown", e => {
  const mod = e.ctrlKey || e.metaKey;
  const t = I18N[state.lang];

  if (mod && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (isDesktop && state.currentNativeFilePath) {
      handleSaveToDisk();
    } else {
      saveCurrentDocImmediately();
      showToast(t.fileSavedToast);
    }
  } else if (mod && e.key.toLowerCase() === "o") {
    e.preventDefault();
    handleOpenLocalFile();
  } else if (mod && e.key.toLowerCase() === "f") {
    e.preventDefault();
    frBar.classList.add("show");
    frFindInput.focus();
    frFindInput.select();
  } else if (mod && e.key.toLowerCase() === "b") {
    e.preventDefault();
    toolbarActions.bold();
  } else if (mod && e.key.toLowerCase() === "i") {
    e.preventDefault();
    toolbarActions.italic();
  } else if (mod && e.key.toLowerCase() === "k") {
    e.preventDefault();
    toolbarActions.link();
  } else if (e.key === "F11") {
    e.preventDefault();
    toggleZenMode();
  } else if (e.key === "Escape") {
    if (state.isZen) toggleZenMode();
    frBar.classList.remove("show");
    $("tocPanel").classList.remove("show");
    closeAllModals();
    document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.remove("show"));
  }
});

/* Chiusura menu cliccando fuori */
document.addEventListener("click", e => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.remove("show"));
  }
});

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* ==================================================================
   INIZIALIZZAZIONE & EVENTI ELECTRON
   ================================================================== */
(function init() {
  // 1. Reset campo ricerca
  if ($("searchDocs")) $("searchDocs").value = "";

  // 2. Carica documenti e preferenze da localStorage
  loadStorage();

  // 3. Inizializza subito l'UI con il documento attivo
  loadActiveDocIntoUI();

  // 4. Controlla ambiente Desktop / Web
  if (isDesktop) {
    $("envBadge").textContent = "Desktop";
    $("envBadge").title = "Piuma Desktop Nativo (Electron)";

    window.electronAPI.onProtocolOpen(url => {
      importDocFromUrlOrToken(url);
    });

    window.electronAPI.onFileOpenFromOS(fileData => {
      createNewDocument(fileData.fileName, fileData.content, fileData.filePath);
    });
  } else {
    $("envBadge").textContent = "Web";
    $("envBadge").title = "Piuma Web App Online";

    if (window.location.hash) {
      const ok = importDocFromUrlOrToken(window.location.hash);
      if (ok) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }

  // 5. Applica tema e lingua (con UI già popolata)
  applyTheme(state.theme);
  applyLanguage(state.lang, true);

  // 6. Renderizza lista documenti e imposta modalità
  renderDocsList();
  setViewMode("split");

  // 7. Salvataggio di sicurezza prima della chiusura/refresh
  window.addEventListener("beforeunload", saveCurrentDocImmediately);
  window.addEventListener("pagehide", saveCurrentDocImmediately);
})();
