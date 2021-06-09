import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import { count } from "console";

const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use(cookieParser())
app.use('/static', express.static('static'));
const coffees = [
  { name: "Americano", image: "/static/img/americano.jpg", price: 999},
  { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999},
  { name: "Espresso", image: "/static/img/espresso.jpg", price:999},
  { name: "Flat-white", image: "/static/img/flat-white.jpg", price:999},
  { name: "Latte-macchiato", image: "/static/img/latte-macchiato.jpg", price:999},
  { name: "Latte", image: "/static/img/latte.jpg", price:999}
]
let carts = {};
let history = {};
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
    items: coffees,
    title: "Меню",
  });
});

app.get("/buy/:name", (req, res) => {
  const userName = req.cookies.name;
  let newCoffee = coffees.find(coffee=> coffee.name === req.params.name);
  carts[userName].push(newCoffee);
  res.redirect("/menu");
});

app.get("/cart", (req, res) => {
  const userName = req.cookies.name;
  res.render("cart",{
    layout: "default",
    totalPrice: carts[userName].reduce((sum, coffee) => sum + coffee.price, 0),
    items: carts[userName],
    title: "Корзина",
  });
});

app.post("/cart", (req, res) => {
  const userName = req.cookies.name;
  if (!history[userName]){
    history[userName] = [];
  }
  carts[userName].forEach(element => {
    let coffee = history[userName].find(coffee=> coffee.name === element.name)
    if (!coffee)
      history[userName].push({name: element.name, countOfCoffee: 1});
    else
      coffee.countOfCoffee += 1;
  });
  carts[userName] = [];
  console.log(history[userName]);
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  let userName;
  if (req.query.username){
    userName = req.query.username;
    res.cookie("name",userName);
  } 
  else if (req.cookies.name)
    userName = req.cookies.name;

  if(userName && !carts[userName])
    carts[userName] = [];

  res.render("login",{
    layout: "default",
    username: userName || "Аноним",
    title: "Личный кабинет",
  });
});

app.get("/history", (req, res) => {
  const userName = req.cookies.name;
  res.render("history",{
    layout: "default",
    title: "История покупок",
    items: history[userName]
  });
})

app.listen(port, () => console.log(`App listening on port ${port}`));
