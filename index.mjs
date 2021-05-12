import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let itemMap = {
  "americano": {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  "cappuccino": { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  "espresso": { name: "Espresso", image: "/static/img/espresso.jpg", price: 905},
  "latte": { name: "Latte", image: "/static/img/latte.jpg", price: 904},
  "latte-macchiato": { name: "Latte-Macchiato", image: "/static/img/latte-macchiato.jpg", price: 903},
  "flat-white": { name: "Flat-White", image: "/static/img/flat-white.jpg", price: 903}
};

let cartItems = [];

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
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 905},
      { name: "Latte", image: "/static/img/latte.jpg", price: 904},
      { name: "Latte-Macchiato", image: "/static/img/latte-macchiato.jpg", price: 903},
      { name: "Flat-White", image: "/static/img/flat-white.jpg", price: 903}
    ],
  });
});

app.get("/buy/:name", (req, res) => {
  let name = req.params.name.toLowerCase();
  cartItems.push(itemMap[name]);
  console.log(itemMap[name]);
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  //res.sendFile(path.join(rootDir, "/static/html/cart.html"));
  let sum = 0;

  for (let item of cartItems) {
    sum += item.price;
  }

  res.render("cart", {
    layout: "default",
    items: cartItems,
    total: sum,
  })
});

app.post("/cart", (req, res) => {
  cartItems = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.use('/static', express.static('static'));

app.listen(port, () => console.log(`App listening on port ${port}`));
