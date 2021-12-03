import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let cart = [];
let historyOfOrders = []

const menu = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 199,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 219
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 119
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 299
  },
  {
    name: "Flat white",
    image: "/static/img/flat-white.jpg",
    price: 349
  },
  {
    name: "Latte macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 249
  },
]

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

app.use("/static", express.static("static"))
app.use(cookieParser());

app.get("/", (_, res) => {
  res.redirect("/menu")
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    items: menu,
    theme: req.cookies.theme || "light",
    title: "Меню",
  });
});

app.get("/buy/:name", (req, res) => {
  const username = req.cookies.username || "Аноним";
  if (cart[username] === undefined) cart[username] = [];
  cart[username].push(menu.find(product => product.name === req.params.name));
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const username = req.cookies.username || "Аноним";
  
  if (cart[username] === undefined) cart[username] = [];
  res.render("cart", {
    layout: "default",
    cartContents: cart[username],
    sum: cart[username].reduce((sum, item) => sum + item.price, 0),
    title: "Корзина",
    theme: req.cookies.theme || "light",
  });
});

app.post("/cart", (req, res) => {
  const username = req.cookies.username || "Аноним";
  if (historyOfOrders[username] === undefined) historyOfOrders[username] = [];
  if (cart[username].length > 0) {
    historyOfOrders[username].push({
      number: historyOfOrders[username].length + 1,
      items: cart[username],
      totalPrice: cart[username].reduce((sum, item) => sum + item.price, 0),
    });
    cart[username] = []
  }
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  const username = req.query.username || req.cookies.username || "Аноним";
  res.cookie("username", username).render("login", {
    layout: "default",
    username: username,
    theme: req.cookies.theme || "light",
    title: "Личный кабинет",
  })
});

app.get("/history", (req, res) => {
  const username = req.cookies.username || "Аноним";
  if (historyOfOrders[username] === undefined) historyOfOrders[username] = [];
  console.log(historyOfOrders[username]);
  res.render("history", {
    layout: "default",
    history: historyOfOrders[username],
    theme: req.cookies.theme || "light",
    title: "История заказов",
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));