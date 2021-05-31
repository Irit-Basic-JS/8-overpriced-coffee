import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let cart = [];

let coffee = [
  {name: "Americano", image: "/static/img/americano.jpg", price: 999,},
  {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999},
  {name: "Espresso", image: "/static/img/espresso.jpg", price: 999},
  {name: "Flat-White", image: "/static/img/flat-white.jpg", price: 999},
  {name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg",price: 999,},
  {name: "Latte", image: "/static/img/latte.jpg", price: 999},
];

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
  res.redirect("/menu");
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee,
  });
});

app.get("/buy/:name", (req, res) => {
  cart.push(coffee.find(item => item.name === req.params.name));
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    sum: cart.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0),
    items: cart,})
});

app.post("/cart", (req, res) => {
  cart = [];
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));

app.use("/static", express.static("static"));
