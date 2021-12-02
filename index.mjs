import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let usersCarts = {"Аноним":{cartProducts: [], cartPrice: 0}};

const CoffeList = {
  "Americano":{name: "Americano", image: "/static/img/americano.jpg", price: 999},
  "Cappuccino":{ name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
  "Latte-macchiato":{ name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price: 999 },
  "Espresso": { name: "Espresso", image: "/static/img/espresso.jpg", price: 999 },
  "Flat-white": { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 999 },
  "Latte": { name: "Latte", image: "/static/img/latte.jpg", price: 999 }
}
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
app.use('/static', express.static('static'));
app.use(cookieParser());
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
    title: "Меню",
    items: Object.values(CoffeList),
  });
});

app.get("/buy/:name", (req, res) => {
  let user = req.query.username || req.cookies.login || "Аноним";
  if (usersCarts[user] === undefined){
    usersCarts[user] = {cartProducts: [], cartPrice: 0};
    usersCarts[user].cartProducts = [];
  }
  let name = req.params["name"];
  usersCarts[user].cartPrice += CoffeList[name].price;
  usersCarts[user].cartProducts.push(CoffeList[name]);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  let user = req.query.username || req.cookies.login || "Аноним";
  if (usersCarts[user] === undefined){
    usersCarts[user] = {cartProducts: [], cartPrice: 0};
    usersCarts[user].cartProducts = [];
  }
  res.render("cart",{
    layout: "default",
    title: "Корзина",
    sum: usersCarts[user].cartPrice,
    cup: usersCarts[user].cartProducts,
  });
});

app.post("/cart", (req, res) => {
  let user = req.query.username || req.cookies.login || "Аноним";
  if (usersCarts[user] === undefined){
    usersCarts[user] = {cartProducts: [], cartPrice: 0};
    usersCarts[user].cartProducts = [];
  }
  usersCarts[user].cartPrice =0;
  usersCarts[user].cartProducts = [];
  res.render("cart",{
    layout: "default",
    title: "Корзина",
    sum: usersCarts[user].cartPrice,
    cup:usersCarts[user].cartProducts,
  });
});

app.get("/login", (req, res) => {
  let name = req.query.username || req.cookies.login || "Аноним";
  res.cookie("login", name);
  res.render("login",{
    layout: "default",
    title: "Профиль",
    name: name
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
