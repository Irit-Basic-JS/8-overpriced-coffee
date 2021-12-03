const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const defaultState = getCookie("theme") === "dark";

themeSwitch.checked = defaultState;

if (defaultState) root.classList.add("dark");

themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");
  document.cookie = root.classList.contains("dark")
    ? `${encodeURIComponent("theme")}=${encodeURIComponent("dark")}`
    : `${encodeURIComponent("theme")}=${encodeURIComponent("light")}`;
});
