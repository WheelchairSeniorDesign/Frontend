//------------------------------------------------------------------
// Light Buttons
// Grab button IDs
const flashingButton = document.getElementById('flashing');
const steadyButton = document.getElementById('steady');
const offButton = document.getElementById('off');

// Add event listeners
flashingButton.addEventListener('click', () => {
  window.electronAppAPI.setLightMode('flashing');
});

steadyButton.addEventListener('click', () => {
  window.electronAppAPI.setLightMode('steady');
});

offButton.addEventListener('click', () => {
  window.electronAppAPI.setLightMode('off');
});

//------------------------------------------------------------------
// Light Mode Frontend Update
window.electronAppAPI.lightUpdate((data) => {
  document.getElementById('lightStatus').textContent = data;
});

