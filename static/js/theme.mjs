const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
let defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;

if (document.cookie.includes("darkTheme")) {
  root.classList.toggle("dark");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie = root.classList.contains("dark")
      ? encodeURIComponent("darkTheme")
      : encodeURIComponent("lightTheme");
});