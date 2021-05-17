const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

themeSwitch.checked = defaultState;

if (document.cookie.includes("theme=dark")) {
  root.classList.add("dark");
  themeSwitch.checked = true;
}
else {
  root.classList.remove("dark");
  themeSwitch.checked = false;
}

themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  themeSwitch.checked = root.classList.contains("dark");
  document.cookie = themeSwitch.checked
      ? encodeURIComponent("theme") + "=" + encodeURIComponent("dark")
      : encodeURIComponent("theme") + "=" + encodeURIComponent("light");
});
