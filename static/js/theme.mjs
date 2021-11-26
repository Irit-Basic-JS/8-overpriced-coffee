const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");

const defaultState = getCookie('theme') === 'dark';

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
    root.classList.toggle("dark");

    const isDark = root.classList.contains('dark');
    if (isDark)
        setCookie('theme', 'dark');
    else
        setCookie('theme', 'light');
});

function setCookie(name, value) {
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
