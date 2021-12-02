import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let currentCart = [];
let sum = 0;


let userDataDefault = {
  theme: 'light',
  cart: [],
  sum: 0,
  name: "Аноним",
  history: [],
}

const setUserData = (req, res, data) => {
  let dataObj = Object.assign(getUserData(req), data);
  //console.log(dataObj);
  res.cookie('userData', dataObj)
}

const getUserData = (req) => {
  if (req.cookies && 'userData' in req.cookies) {
    //console.log(req.cookies.userData);
    return Object.assign({... userDataDefault}, req.cookies.userData);
  }

  return {... userDataDefault};
}

const items = {
  "Americano": { name: "Americano", image: '/static/img/americano.jpg', price: 999 },
  "Cappuccino": { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 899 },
  "Espresso": { name: "Espresso", image: "/static/img/espresso.jpg", price: 299 },
  "Flat white": { name: "Flat white", image: "/static/img/flat-white.jpg", price: 599 },
  "Latte": { name: "Latte", image: "/static/img/latte.jpg", price: 399 },
  "Latte Macchiato": { name: "Latte Macchiato", image: "/static/img/latte-macchiato.jpg", price: 699 },
};

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);

app.use('/static', express.static('static'));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect('/menu');
});

app.get("/menu", (req, res) => {
  
  let userData = getUserData(req);
  res.render("menu", {
    title: `Overpriced Coffe`,
    theme: userData.theme,
    layout: "default",
    items: Object.values(items),
  });
});

app.get("/buy/:name", (req, res) => {
  let userData = getUserData(req);

  console.log(userData.sum, typeof userData.sum);

  let item = items[req.params.name];
  userData.cart.push(item);

  userData.sum = +userData.sum;
  userData.sum += item.price;

  console.log(userData);

  setUserData(req, res, userData)
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let userData = getUserData(req);
  res.render("cart", {
    title: `Корзина (${userData.cart.length})`,
    theme: userData.theme,
    layout: "default",
    cart: userData.cart,
    sum: userData.sum,
  });
});

app.post("/cart", (req, res) => {
  let userData = getUserData(req);
  userData.history.push({sum: userData.sum, cart: userData.cart})

  userData.cart = [];
  userData.sum = 0;

  setUserData(req, res, userData)
  res.redirect("/menu");
});

app.get("/history", (req, res) => {
  let userData = getUserData(req);

  res.render("history", {
    title: `История (${userData.history.length})`,
    theme: userData.theme,
    layout: "default",
    history: userData.history,
  });
});

app.get("/login", (req, res) => {
  if ('username' in req.query) {
    let name = req.query.username;
    setUserData(req, res, {name: name})
    res.redirect('/login');
  }

  else {
    let userData = getUserData(req);
    res.render("login", {
      title: `Привет, ${userData.name}`,
      theme: userData.theme,
      layout: "default",
      name: getUserData(req).name,
    });  
  }
});

app.post('/api/switchTheme/:theme', (req, res) => {
  //
  let theme = req.params.theme;

  console.log(theme);
  setUserData(req, res, {theme: theme})

  res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
