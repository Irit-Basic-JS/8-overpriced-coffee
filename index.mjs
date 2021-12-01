import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let userCarts = {};

const coffeeItems = {
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

app.get("/", (_, res) => {
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: Object.values(coffeeItems),
    title: "Menu"
  });
});

app.get("/buy/:name", (req, res) => {
  const username = req.cookies.username;
  if (!(username in userCarts)) {
    userCarts[username] = [];
  }
  userCarts[username].push(coffeeItems[req.params.name]);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  const user = req.cookies.username;
  const cart = userCarts[user] || [];
  const sum = cart.map(e => e.price).reduce((sum, price) => sum + price, 0);
  res.render("cart", {
    layout: "default",
    cart: cart,
    sum: sum,
    title: "Cart"
  });
});

app.post("/cart", (req, res) => {
  userCarts[req.cookies.username] = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  const username = req.query.username || req.cookies.username || "Аноним";
  res.cookie("username", username);
  res.render("login", {
    layout: "default",
    username: username,
    title: "Login"
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
