# Piuma Pro · Markdown Editor 🪶

[![License: Custom Attribution](https://img.shields.io/badge/License-Attribution%20Required-orange.svg)](#licenza)
[![Author: Russo Alessandro](https://img.shields.io/badge/Author-Russo%20Alessandro-blue.svg)](https://github.com/Lordtzeentch38)

**Piuma Pro** è un moderno editor Markdown fluido, potente e privo di distrazioni. È progettato per scrittori, sviluppatori, scienziati e studenti per redigere appunti, formule scientifiche e documentazione tecnica con rendering istantaneo.

Disponibile sia come **Web App online** (funzionante direttamente nel browser) che come **Applicazione Desktop offline nativa** con Electron.

---

## ✨ Funzionalità Principali

- 📐 **Formule Matematiche KaTeX**: supporto completo a formule inline (`$E=mc^2$`) e blocchi multilinea (`$$\int f(x)dx$$`).
- 📊 **Diagrammi e Flussi Mermaid**: genera diagrammi e grafici di flusso in tempo reale da blocchi di codice `mermaid`.
- 🔀 **3 Modalità di Visualizzazione**:
  - **Scrivi**: Editor a tutta larghezza (100%) per la massima concentrazione.
  - **Affiancato**: Editor e Anteprima 50/50 con barra divisoria ridimensionabile.
  - **Leggi**: Anteprima a tutta larghezza con formattazione e tabelle estese.
- 🧘 **Modalità Focus Zen (`F11`)**: nasconde ogni barra e menu per una scrittura senza alcuna distrazione.
- 🔍 **Trova e Sostituisci (`Ctrl+F`)**: ricerca in tempo reale con contatore occorrenze e sostituzione singola o multipla.
- 📋 **Checklist Interattive**: caselle di controllo (`- [ ]` / `- [x]`) cliccabili direttamente dall'anteprima.
- 🎨 **4 Temi Eleganti**:
  - 📜 *Carta & Inchiostro* (Classico)
  - 🌌 *Notte / Obsidian* (Dark Mode)
  - 🌿 *Aurora Mint*
  - 📖 *Sepia Libri*
- 🔗 **Condivisione Serverless via Link o Token**: comprimi l'intero documento nell'URL (`#doc=...`) o genera token `PIUMA:...` per condividere testi senza bisogno di server o database.
- 💾 **Esportazioni Multiple**: Salva come Markdown (`.md`), scarica come HTML Standalone, stampa in PDF o copia formattato per Word/Docs.

---

## 🚀 Utilizzo

### 1. Versione Web Online (Browser)
Basta aprire il file `index.html` (o visitare GitHub Pages) con qualsiasi browser moderno. Non richiede installazione.

### 2. Versione Desktop (Electron)
Per avviare l'applicazione desktop nativa:

```bash
# Installa le dipendenze
npm install

# Avvia l'applicazione desktop
npm start

# Crea l'eseguibile installer per Windows (.exe)
npm run build:win
```

---

## ⌨️ Scorciatoie da Tastiera

| Tasti | Azione |
| :--- | :--- |
| **Ctrl + S** | Salva documento su disco / locale |
| **Ctrl + O** | Apri file `.md` da computer |
| **Ctrl + F** | Trova e Sostituisci |
| **F11 / Esc** | Attiva/Disattiva Modalità Zen |
| **Ctrl + B** | Grassetto |
| **Ctrl + I** | Corsivo |
| **Ctrl + K** | Inserisci Collegamento |
| **Tab / Shift+Tab** | Indenta / Deindenta riga |

---

## 📄 Licenza d'Uso

Questo software è libero e gratuito per uso personale e commerciale.

**Condizione Obbligatoria**: Chiunque utilizzi, copi, distribuisca o modifichi questo software deve citare sempre l'autore originario (**Russo Alessandro**) e inserire il link alla [fonte originale su GitHub](https://github.com/Lordtzeentch38/Piuma-Editor).

---

*Realizzato con cura da [Russo Alessandro (@Lordtzeentch38)](https://github.com/Lordtzeentch38)* 🪶
