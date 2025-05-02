const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

app.disableHardwareAcceleration(); // Disable GPU acceleration

//--------------------------------------------------------------------------------------------------
// ROS 2 Setup Stuff
const rclnodejs = require('rclnodejs');
let node = null;
let publisher_light, publisher_brake, publisher_lidar, publisher_selfdrive;

async function initROS() {
  await rclnodejs.init();

  // Create node
  node = new rclnodejs.Node('electron_node');

  //--------------------------------------------------------------------------
  // Create publishers
  const message_string = 'std_msgs/msg/String';
  const message_int= 'std_msgs/msg/Int32';

  const topic_light = 'electron_light';
  publisher_light = node.createPublisher(message_string, topic_light);

  const topic_brake = 'electron_brake';
  publisher_brake = node.createPublisher(message_string, topic_brake);

  const topic_lidar = 'electron_lidar';
  publisher_lidar = node.createPublisher(message_string, topic_lidar);

  const topic_selfdrive = 'electron_selfdrive';
  publisher_selfdrive = node.createPublisher(message_int, topic_selfdrive);

  //--------------------------------------------------------------------------
  // Create subscribers
  const topic_battery = 'electron_battery';
  node.createSubscription(message_string, topic_battery, (msg) => {
    console.log(`Received from Jetson: ${msg.data}`);
    
    temp = "BATTERY_" + msg.data;
    mainWindow.webContents.send('update-display', temp);
  });

  const topic_speed = 'electron_speed';
  node.createSubscription(message_string, topic_speed, (msg) => {
    console.log(`Received from Jetson: ${msg.data}`);
    
    temp = "SPEED_" + msg.data;
    mainWindow.webContents.send('update-display', temp);
  });

  node.spin();
  console.log(`Created all publishers and subscribers. Waiting...`);

  defaultPublish();
  console.log(`Published default values. Waiting...`);
}

//--------------------------------------------------------------------------------------------------
function defaultPublish() {
  let temp = "LIGHT_OFF";
  publisher_light.publish({ data: temp });
  console.log(`---> Published from Electron app: ${temp}`);

  temp = "BRAKE_ON";
  publisher_brake.publish({ data: temp });
  console.log(`---> Published from Electron app: ${temp}`);

  temp = "LIDAR_OFF";
  publisher_lidar.publish({ data: temp });
  console.log(`---> Published from Electron app: ${temp}`);

  temp = 0;
  publisher_selfdrive.publish({ data: temp });
  console.log(`---> Published from Electron app: ${temp}`);
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
      
      // Stuff to use with preload.js separation
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  // Load HTML file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  //------------------------------------------------------------
  // Cleanup
  mainWindow.on('closed', async () => {

    // Shut down ROS node cleanly
    if (node) {
      node.destroy();
    }
    await rclnodejs.shutdown();

    mainWindow = null;
    app.quit();
  });
  //------------------------------------------------------------
}

//--------------------------------------------------------------------------------------------------
// Interaction with render process
ipcMain.on('button-action', (event, action) => {
  console.log(`Received button action: ${action}`);

  // Publish to ROS 2 & send display updates
  if(action == "LIGHT_FLASHING" || action == "LIGHT_STEADY" || action == "LIGHT_OFF") {
    publisher_light.publish({ data: action });
    console.log(`---> Published from Electron app: ${action}`);
  }

  if(action == "BRAKE_ON" || action == "BRAKE_OFF") {
    publisher_brake.publish({ data: action });
    console.log(`---> Published from Electron app: ${action}`);
  }

  if (action == "LIDAR_ON" || action == "LIDAR_OFF") {
    publisher_lidar.publish({ data: action });
    console.log(`---> Published from Electron app: ${action}`);
  }

  //-------------------------------------------------------------------------
  // Self-drive Actions
  if (action == "SELFDRIVE_FULL") {
    // Self-drive full
    const msg = { data: 2 };
    publisher_selfdrive.publish(msg);
    console.log(`---> Published from Electron app: ${msg.data}`);
  } 
  else if (action == "SELFDRIVE_JOYSTICK") {
    // Self-drive w/Joystick
    const msg = { data: 1 };
    publisher_selfdrive.publish(msg);
    console.log(`---> Published from Electron app: ${msg.data}`);
  }
  else if (action == "SELFDRIVE_OFF") {
    // Self-drive off
    const msg = { data: 0 };
    publisher_selfdrive.publish(msg);
    console.log(`---> Published from Electron app: ${msg.data}`);
  }

  //-------------------------------------------------------------------------
  //Send action name for screen update
  mainWindow.webContents.send('update-display', action); 

});

//--------------------------------------------------------------------------------------------------
// Other necessary stuff
app.whenReady().then(async () => {
  
  createWindow();
  initROS();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});