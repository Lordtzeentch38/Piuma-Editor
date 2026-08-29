const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs").promises;

let mainWindow = null;
let pendingUrlOrFile = null;

// Registra protocollo personalizzato piuma://
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("piuma", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("piuma");
}

// Forza istanza singola
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Cerca se è stato passato un URL piuma:// o un percorso file nei parametri
      const targetArg = commandLine.find(arg => arg.startsWith("piuma://") || arg.endsWith(".md") || arg.endsWith(".markdown") || arg.endsWith(".txt"));
      if (targetArg) {
        handleIncomingArgument(targetArg);
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();

    // Controlla se l'app è stata avviata con un file o URL
    const initialArg = process.argv.find(arg => arg.startsWith("piuma://") || (arg.endsWith(".md") && !arg.includes("node_modules")));
    if (initialArg) {
      pendingUrlOrFile = initialArg;
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 780,
    minHeight: 560,
    backgroundColor: "#0B1517",
    title: "Piuma · Editor Markdown",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (pendingUrlOrFile) {
      handleIncomingArgument(pendingUrlOrFile);
      pendingUrlOrFile = null;
    }
  });

  // Apri i link esterni (http/https non piuma) nel browser predefinito di sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Gestione argomenti URL o File in arrivo
async function handleIncomingArgument(arg) {
  if (!mainWindow || !mainWindow.webContents) return;

  if (arg.startsWith("piuma://")) {
    mainWindow.webContents.send("protocol:open-url", arg);
  } else {
    try {
      const content = await fs.readFile(arg, "utf8");
      const fileName = path.basename(arg, path.extname(arg));
      mainWindow.webContents.send("file:open-from-os", {
        filePath: arg,
        fileName: fileName,
        content: content
      });
    } catch (err) {
      console.error("Errore lettura file avviato con l'app:", err);
    }
  }
}

// IPC Handlers per il dialogo nativo con il File System
ipcMain.handle("dialog:openFile", async () => {
  if (!mainWindow) return { canceled: true };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Apri documento Markdown",
    properties: ["openFile"],
    filters: [
      { name: "Documenti Markdown", extensions: ["md", "markdown", "txt"] },
      { name: "Tutti i file", extensions: ["*"] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const filePath = result.filePaths[0];
  try {
    const content = await fs.readFile(filePath, "utf8");
    const fileName = path.basename(filePath, path.extname(filePath));
    return {
      canceled: false,
      filePath: filePath,
      fileName: fileName,
      content: content
    };
  } catch (err) {
    dialog.showErrorBox("Errore di lettura", `Impossibile aprire il file:\n${err.message}`);
    return { canceled: true, error: err.message };
  }
});

ipcMain.handle("dialog:saveFile", async (event, { content, defaultName }) => {
  if (!mainWindow) return { canceled: true };
  const safeDefault = (defaultName || "documento").replace(/[^\w\s-]/gi, "") + ".md";
  const result = await dialog.showSaveDialog(mainWindow, {
    title: "Salva documento Markdown",
    defaultPath: safeDefault,
    filters: [
      { name: "Documento Markdown (*.md)", extensions: ["md"] },
      { name: "File di Testo (*.txt)", extensions: ["txt"] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  try {
    await fs.writeFile(result.filePath, content, "utf8");
    return { canceled: false, filePath: result.filePath };
  } catch (err) {
    dialog.showErrorBox("Errore di salvataggio", `Impossibile salvare il file:\n${err.message}`);
    return { canceled: true, error: err.message };
  }
});

ipcMain.handle("file:saveDirect", async (event, { filePath, content }) => {
  if (!filePath) return { success: false, error: "Percorso non specificato" };
  try {
    await fs.writeFile(filePath, content, "utf8");
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Chiusura pulita su tutte le piattaforme
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
