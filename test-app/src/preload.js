// Use contextBrindge to safely expose an API to the render process
const { contextBridge, ipcRenderer } = require('electron/renderer'); 

contextBridge.exposeInMainWorld('electronAPI', {
  setLightMode: (mode) => ipcRenderer.send('set-light-mode', mode)
});