const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = GetTheme();

if(defaultState) root.classList.add("dark");
else root.classList.remove("dark");

themeSwitch.checked = defaultState;
themeSwitch.addEventListener("click", () => {
  root.classList.toggle("dark");

  if (root.classList.contains("dark")) document.cookie = "theme=1";
  else document.cookie = "theme=0";
});

function GetTheme(){
  let parts = document.cookie.split('; ');
  for(let part of parts){
    if( part.indexOf('theme')!= -1){
      return +part.split('=')[1];
    }
  }
  return 0;
}
