
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

app.disableHardwareAcceleration(); // Disable GPU acceleration


//------------------------------------------------------------------------------------------------------
// ROS 2 Stuff
const rclnodejs = require('rclnodejs');
let publisher = null
async function initROS() {
  await rclnodejs.init();

  // Reference custom messages
  //const MyMessage = rclnodejs.require('wheelchair_sensor_msgs/msg/Light');

  // Create node
  const node = new rclnodejs.Node('electron_node');

  // Create topic
  const topic = 'electron_light';

  // Create publisher
  //const publisher = node.createPublisher(MyMessage, topic); // Custom message publisher
  publisher = node.createPublisher('std_msgs/msg/String', topic); // Basic string publisher
}
//------------------------------------------------------------------------------------------------------

// Create window function
function createWindow() {
  // First create the window variable using BrowserWindow
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    frame: true,
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

  //------------------------------------------------------------------------------------------------------
  // ROS 2 Stuff
  publisher.publish(mode); // For string publisher
  console.log(`---> Published from Electron app: ${mode}`);

  // if(mode == steady) {
  //   // uint8 STEADY=1
  //   const message = { state: 1 };
  //   publisher.publish(message);
  //   console.log(`Published: ${message.state}`);
  // } 
  // else if (mode == flashing) {
  //   // uint8 FLASH=2
  //   const message = { state: 1 };
  //   publisher.publish(message);
  //   console.log(`Published: ${message.state}`);
  // } 
  // else {
  //   // uint8 OFF=0
  //   const message = { state: 1 };
  //   publisher.publish(message);
  //   console.log(`Published: ${message.state}`);
  // }
  //------------------------------------------------------------------------------------------------------

});

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
