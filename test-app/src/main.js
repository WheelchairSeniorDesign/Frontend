const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

app.disableHardwareAcceleration(); // Disable GPU acceleration

//------------------------------------------------------------------------------------------------------
// ROS 2 Stuff
const rclnodejs = require('rclnodejs');
let publisher = null

async function initROS() {
  await rclnodejs.init();

  // Create node
  const node = new rclnodejs.Node('electron_node');

  // Create topic
  const topic = 'electron_light';

  // Create publisher
  publisher = node.createPublisher('std_msgs/msg/String', topic); // Basic string publisher
}
//------------------------------------------------------------------------------------------------------

// Create window function
let mainWindow;
function createWindow() {
  // First create the window variable using BrowserWindow
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    frame: true,
    autoHideMenuBar: true, // Hide menu bar

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // __dirname gives the absolute path
      
      // Stuff to use with preload.js separation
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  // Load HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// Listen for LED mode changes and update a file
ipcMain.on('set-light-mode', (event, mode) => {
  console.log(`Setting Light mode: ${mode}`);

  //----------------------------------------------------------
  // ROS 2 Stuff
  publisher.publish(mode); // For string publisher
  console.log(`---> Published from Electron app: ${mode}`);
  
  // Update Frontend display
  temp = "Light Status: " + mode.toUpperCase();
  mainWindow.webContents.send('update-light-display', temp);
  //----------------------------------------------------------

});

//--------------------------------------------------------------------------
// When ready...
app.whenReady().then(async () => {
  initROS(); // Initialize ROS 2 publisher

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  
});

// When closed...
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});