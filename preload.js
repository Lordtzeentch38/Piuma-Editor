const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  
  // Dialoghi e salvataggio file nativo
  openFileDialog: () => ipcRenderer.invoke("dialog:openFile"),
  saveFileDialog: (content, defaultName) => ipcRenderer.invoke("dialog:saveFile", { content, defaultName }),
  saveFileDirect: (filePath, content) => ipcRenderer.invoke("file:saveDirect", { filePath, content }),

  // Apertura link esterni nel browser di sistema
  openExternal: (url) => shell.openExternal(url),

  // Ricezione link di protocollo (piuma://) e file aperti dal sistema
  onProtocolOpen: (callback) => {
    ipcRenderer.on("protocol:open-url", (event, url) => callback(url));
  },
  onFileOpenFromOS: (callback) => {
    ipcRenderer.on("file:open-from-os", (event, fileData) => callback(fileData));
  }
});
