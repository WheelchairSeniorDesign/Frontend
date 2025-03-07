// Grab button IDs
const flashingButton = document.getElementById('flashing');
const steadyButton = document.getElementById('steady');
const offButton = document.getElementById('off');

// Add event listeners
flashingButton.addEventListener('click', () => {
  window.electronAPI.setLightMode('flashing');
});

steadyButton.addEventListener('click', () => {
  window.electronAPI.setLightMode('steady');
});

offButton.addEventListener('click', () => {
  window.electronAPI.setLightMode('off');
});

