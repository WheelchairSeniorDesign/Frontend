
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

app.disableHardwareAcceleration(); // Disable GPU acceleration

// Create window function
function createWindow() {
  // First create the window variable using BrowserWindow
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    frame: true, // Hide title bar & window controls
    autoHideMenuBar: true, // Hide menu bar

    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // __dirname gives the absolute path
    }
  });

  // Load HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html')).catch(err => {
    console.error("Failed to load index.html:", err);
  });
}

// Listen for LED mode changes and update a file
ipcMain.on('set-light-mode', (event, mode) => {
  console.log(`Setting Light mode: ${mode}`);

  //FIXME: Add functionality to publish to node later
});

// When ready...
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// When closed...
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
