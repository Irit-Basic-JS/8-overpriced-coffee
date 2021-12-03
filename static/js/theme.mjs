const themeSwitch = document.querySelector(".theme__switch input");
const root = document.querySelector(":root");
const defaultState = root.classList.contains("dark");
themeSwitch.checked = defaultState;

makeTheme();

themeSwitch.addEventListener("click", () => {
  if (localStorage.getItem('themeStyle')=='dark'){
    localStorage.themeStyle='light';
    makeTheme();

  }
  else if (localStorage.getItem('themeStyle')=='light'){
    localStorage.themeStyle='dark';
    makeTheme();
  }
    console.log(localStorage.getItem('themeStyle'))
});

function makeTheme(){
  if(localStorage.getItem('themeStyle')===null){
    localStorage.setItem('themeStyle','light')
  }
  else if (localStorage.getItem('themeStyle')=='dark'){
    root.classList.add('dark');
  }
  else if (localStorage.getItem('themeStyle')=='light'){
    root.classList.remove('dark');
  }
};



