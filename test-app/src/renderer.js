const buttons = document.querySelectorAll('.app-button');

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

  // // Optional styling
  // const color = data.includes("ON") ? "lightgreen" :
  //               data.includes("OFF") ? "lightcoral" :
  //               "lightgray";
  // statusBox.style.backgroundColor = color;
});