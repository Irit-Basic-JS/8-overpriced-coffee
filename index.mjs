import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let username = "";
let basketContent = [];

const products = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 999
  },
  {
    name: "Flat white",
    image: "/static/img/flat-white.jpg",
    price: 999
  },
  {
    name: "Latte macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 999
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

app.use(cookieParser());
app.use("/static", express.static("static"))

app.get("/", (_, res) => {
  res.redirect("/menu")
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  basketContent.push(products.find(item => item.name === req.params.name));
  res.redirect("/menu")
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    basketContent: basketContent,
    sum: basketContent.reduce((sum, item) => sum += item.price, 0),
  });
});

app.post("/cart", (req, res) => {
  basketContent = [];
  res.redirect("/cart");
});

app.get("/login", (req, res) => {
  username = req.query.username || req.cookies.username || "Безымянный";
  res
      .cookie("username", username)
      .render("login", {
        layout: "default",
        username: username,
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
