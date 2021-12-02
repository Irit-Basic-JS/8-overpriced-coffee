const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  if (root.classList.contains("dark")) setCookie("theme", "dark")
  else setCookie("theme", "")
  document.cookie = `dark_theme=${themeSwitch.checked}`;
});

function setCookie(key, value) {
  document.cookie = `${key}=${value}`
}
