const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");

let currentState = +root.classList.contains("dark");

const states = [
  'light',
  'dark',
]

themeSwitch.checked = currentState;
themeSwitch.addEventListener("click", () => {
  
  currentState++;
  currentState %= states.length;

  let data = {theme: states[currentState]};
  console.log(JSON.stringify(data));

  fetch(`/api/switchTheme/${states[currentState]}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
  }).then(res => {
    root.classList.toggle("dark");
  })
});
