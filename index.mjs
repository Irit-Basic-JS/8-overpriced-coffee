import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const listCoffee = [
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
  {   name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999
  },
  {   name: "Latte",
    image: "/static/img/latte.jpg",
    price: 999
  },
]

let listBuyCoffee = [];


app.use(cookieParser());
app.use("/static", express.static("static"));

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
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect("/menu");
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: listCoffee,
    title: "Меню"
  });
});

app.get("/buy/:name", (req, res) => {
  res.redirect("/menu");
  listBuyCoffee.push(listCoffee.find(coffee => req.params.name === coffee.name));
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    items: listBuyCoffee,
    title: "Корзина",
    sumPrice: listBuyCoffee.reduce((count, next) => (count + next.price), 0),
  });
});

app.post("/cart", (req, res) => {
  listBuyCoffee = [];
  res.render("cart", {
    layout: "default",
    items: listBuyCoffee,
    sumPrice: listBuyCoffee.reduce((count, next) => (count + next.price), 0),
  })
});

app.get("/login", (req, res) => {
  let username;
  if(req.query.username) {
    username = req.query.username;
    res.cookie("username", username);
  }
  else if(req.cookies && req.cookies.username) {
    username = req.cookies.username;
  }
  res.render("login", {
    layout: "default",
    username: username || "Аноним",
    title: "Личный кабинет"
  })
});

app.listen(port, () => console.log(`App listening on port ${port}`));
