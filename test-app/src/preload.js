// Use contextBrindge to safely expose an API to the render process
const { contextBridge, ipcRenderer } = require('electron/renderer'); 

// Custom API named "electronAppAPI"
// This allows the preload script to be loaded into the main process (main.js),
// while using the custom API in the render processes (renderer.js)
contextBridge.exposeInMainWorld('electronAppAPI', {
  // General purpose button
  sendAction: (action) => ipcRenderer.send('button-action', action),

  onDisplayUpdate: (callback) => ipcRenderer.on('update-display', (_, msg) => callback(msg)),

  sendPassword: (password) => ipcRenderer.send('send-password', password)
});