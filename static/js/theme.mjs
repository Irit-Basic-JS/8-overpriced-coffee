const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
let defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;

if (document.cookie.includes("isDark")) {
  root.classList.toggle("dark");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  if (root.classList.contains("dark")){
    document.cookie = encodeURIComponent("isDark");
  } else{
    document.cookie = encodeURIComponent("isLight");
  };
});