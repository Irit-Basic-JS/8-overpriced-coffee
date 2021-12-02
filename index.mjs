import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let cartContents = [];
let history = []

const products = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 777,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 666
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 333
  },
  {
    name: "Flat white",
    image: "/static/img/flat-white.jpg",
    price: 322
  },
  {
    name: "Latte macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 146
  },
]

app.set("view engine", "hbs");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);

app.use(cookieParser());
app.use("/static", express.static("static"))

app.get("/", (_, res) => {
  res.redirect("/menu")
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    items: products,
    theme: getTheme(req),
    title: "Меню",
  });
});

app.get("/buy/:name", (req, res) => {
  const username = getUsername(req);
  if (cartContents[username] === undefined) cartContents[username] = [];
  cartContents[username].push(products.find(product => product.name === req.params.name));
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const username = getUsername(req);
  if (cartContents[username] === undefined) cartContents[username] = [];
  res.render("cart", {
    layout: "default",
    cartContents: cartContents[username],
    sum: cartContents[username].reduce((sum, item) => sum + item.price, 0),
    title: "Корзина",
    theme: getTheme(req),
  });
});

app.post("/cart", (req, res) => {
  const username = getUsername(req);
  if (history[username] === undefined) history[username] = [];
  if (cartContents[username].length > 0) {
    history[username].push({
      number: history[username].length + 1,
      items: cartContents[username],
      totalPrice: cartContents[username].reduce((sum, item) => sum + item.price, 0),
    });
    cartContents[username] = []
  }
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  const username = req.query.username || getUsername(req);
  res.cookie("username", username).render("login", {
    layout: "default",
    username: username,
    theme: getTheme(req),
    title: "Личный кабинет",
  })
});

app.get("/history", (req, res) => {
  const username = getUsername(req);
  if (history[username] === undefined) history[username] = [];
  console.log(history[username]);
  res.render("history", {
    layout: "default",
    history: history[username],
    theme: getTheme(req),
    title: "История",
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function getTheme(req) {
  return req.cookies.theme || "light";
}

function getUsername(req) {
  return req.cookies.username || "Безымянный"
}