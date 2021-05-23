const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  document.cookie = `theme=${isDark ? "dark" : "light"}`;
});

if (document.cookie.match("theme=dark")) {
  root.classList.add("dark");
  themeSwitch.checked = true;
}