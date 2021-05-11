import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const products = [
  {
    name: "Americano",
    image: "static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "static/img/cappuccino.jpg",
    price: 999,
  },
  {
    name: "Latte",
    image: "static/img/latte.jpg",
    price: 420,
  },
  {
    name: "Espresso",
    image: "static/img/espresso.jpg",
    price: 228,
  },
]
let username = "";
let cart = [];

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use(cookieParser());
app.use('/static', express.static('static'));
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
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  cart.push(products.find(item => item.name === req.params.name));
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: cart,
    totalPrice: cart.reduce((acc,  curr) => acc +=curr.price, 0)
  });
});

app.post("/cart", (req, res) => {
  cart = [];
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username || "Аноним"
  res
    .cookie("username", username)
    .render('login', {
      layout: "default",
      username: username,
    })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
