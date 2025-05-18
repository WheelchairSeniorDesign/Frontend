const buttons = document.querySelectorAll('button.app-button');

//----------------------------------------------------------------------------------------
// Add listeners to each button
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    window.electronAppAPI.sendAction(action);
  });
});

//----------------------------------------------------------------------------------------
// Display updates
window.electronAppAPI.onDisplayUpdate(function(action) {
  
  if(action == "LIGHT_FLASHING" || action == "LIGHT_STEADY" || action == "LIGHT_OFF") {
    const statusBox = document.getElementById('lightStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if(action == "BRAKE_ON" || action == "BRAKE_OFF") {
    const statusBox = document.getElementById('brakeStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if (action == "LIDAR_ON" || action == "LIDAR_OFF") {
    const statusBox = document.getElementById('lidarStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if (action == "SELFDRIVE_FULL" || action == "SELFDRIVE_JOYSTICK" || action == "SELFDRIVE_OFF") {
    const statusBox = document.getElementById('selfdriveStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if(action.startsWith('BATTERY_')) {
    const statusBox = document.getElementById('batteryStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if(action.startsWith('SPEED_')) {
    const statusBox = document.getElementById('speedStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }

  if(action.startsWith('ROOM_')) {
    const statusBox = document.getElementById('roomStatus');
    temp = action.substring(action.indexOf('_') + 1);
    statusBox.textContent = temp;
  }
});