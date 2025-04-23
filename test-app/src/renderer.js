const buttons = document.querySelectorAll('button.app-button');

//------------------------------------------------------------------
// Add listeners to each button
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    window.electronAppAPI.sendAction(action);
  });
});


//------------------------------------------------------------------
// Display updates
window.electronAppAPI.onDisplayUpdate(function(data) {
  const statusBox = document.getElementById('lightStatus');
  statusBox.textContent = data;
});