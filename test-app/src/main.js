const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

app.disableHardwareAcceleration(); // Disable GPU acceleration

//--------------------------------------------------------------------------------------------------
// ROS 2 Setup Stuff
const rclnodejs = require('rclnodejs');
let publisher = null

async function initROS() {
  await rclnodejs.init();

  // Create node
  const node = new rclnodejs.Node('electron_node');

  // Create topics
  const topic_light = 'electron_light';
  const topic_brake = 'electron_brake';
  const topic_lidar = 'electron_lidar';

  // Create publishers
  publisher_light = node.createPublisher('std_msgs/msg/String', topic_light);
  publisher_brake = node.createPublisher('std_msgs/msg/String', topic_brake);
  publisher_lidar = node.createPublisher('std_msgs/msg/String', topic_lidar);
}

//--------------------------------------------------------------------------------------------------
// Window functionality
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
      
      // Stuff to use with preload.js separation````````
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  // Load HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

//--------------------------------------------------------------------------------------------------
// Interaction with render process
ipcMain.on('button-action', (event, action) => {
  console.log(`Received button action: ${action}`);

  // Publish to ROS 2 & send display updates
  if(action == "LIGHT_FLASHING" || action == "LIGHT_STEADY" || action == "LIGHT_OFF") {
    publisher_light.publish(action);
    console.log(`---> Published from Electron app: ${action}`);
    
    temp = action.substring(action.indexOf('_') + 1);
    temp = "Light Status: " + temp;
    mainWindow.webContents.send('update-display', temp);
  }

  if(action == "BRAKE_ON" || action == "BRAKE_OFF") {
    publisher_brake.publish(action);
    console.log(`---> Published from Electron app: ${action}`);
  }

  if (action == "LIDAR_ON" || action == "LIDAR_OFF") {
    publisher_lidar.publish(action);
    console.log(`---> Published from Electron app: ${action}`);
  }

});

//--------------------------------------------------------------------------------------------------
// Other necessary stuff
app.whenReady().then(async () => {
  initROS(); // Initialize ROS 2 publisher

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});