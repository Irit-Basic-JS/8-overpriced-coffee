import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
const rootDir = process.cwd();
const port = 3000;
const app = express();
const users = {};
const history = {};
const coffees = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999,
  },
  {
    name: "еКспрессо",
    image: "/static/img/espresso.jpg",
    price: 9999,
  },
];

app.use("/static", express.static("static"));
app.use(cookieParser());
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine("hbs",
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
items: coffees,
title: "Меню",
});
});

app.get("/buy/:name", (req, res) => {
  const user = req.cookies.userName;
  const { selectedItems } = users[user];
  if (!selectedItems) {
    users[user].selectedItems = [];
  }
  let newCoffee = coffees.find(coffee=> coffee.name === req.params.name);
  users[user].selectedItems.push(newCoffee);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const user = req.cookies.userName;
  const total = users[user].selectedItems.reduce(
      (sum, coffee) => (sum += Number(coffee.price)), 0);

  res.render("cart", {
    layout: "default",
    items: users[user].selectedItems,
    total: total,
    title: "Корзина",
  });
});

app.post("/cart", (req, res) => { const user = req.cookies.userName;
  if (!history[user]){
    history[user] = [];
  }
  users[user].selectedItems.forEach(element => {
    history[user].push({name: element.name, price: element.price, image: element.image});
  });
  users[user].selectedItems = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  const { username } = req.query;

  if (username) {
    users[username] = { selectedItems: [] };
    res.cookie("userName", username);
    res.redirect("/menu");
  } else {
    res.cookie("userName", "Аноним");
    res.render("login", {
      layout: "default",
      name: req.cookies.userName || "Аноним",
      title: "Личный кабинет",
    });
  }
});

app.get("/history", (req, res) => {
  const user = req.cookies.userName;
  res.render("history", {
    layout: "default",
    items: history[user],
    title: "История заказов",
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));