const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const extraTheme = 'dark';
const defaultState = root.classList.contains(extraTheme);

themeSwitch.checked = defaultState;
localStorage.getItem('theme') === extraTheme && root.classList.toggle(extraTheme);
themeSwitch.addEventListener("click", () => {
    root.classList.toggle(extraTheme);
    localStorage.setItem('theme', root.classList.contains(extraTheme) ? extraTheme : 'default');
});
