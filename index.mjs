import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const beverages = {
  "Americano": { name: "Americano", image: '/static/img/americano.jpg', price: 999 },
  "Cappuccino": { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 899 },
  "Espresso": { name: "Espresso", image: "/static/img/espresso.jpg", price: 299 },
  "Flat white": { name: "Flat white", image: "/static/img/flat-white.jpg", price: 599 },
  "Latte": { name: "Latte", image: "/static/img/latte.jpg", price: 399 },
  "Latte Macchiato": { name: "Latte Macchiato", image: "/static/img/latte-macchiato.jpg", price: 699 },
};
let cart = [];
let total = 0;

app.use("/static", express.static("static"));
app.use(cookieParser());

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

app.get("/", (_, res) => {
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: Object.values(beverages)
  });
});

app.get("/buy/:name", (req, res) => {
  let beverage = beverages[req.params.name];
  cart.push(beverage);
  total += beverage.price;
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    cart: cart,
    sum: total,
  });
});

app.post("/cart", (req, res) => {
  cart = [];
  total = 0;
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  let username;
  if (req.query.username) {
    username = req.query.username;
    res.cookie("username", username);
  }
  else if (req.cookies && req.cookies.username) {
    username = req.cookies.username;
  }
  res.render("login", {
    layout: "default",
    username: username || "Аноним",
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
