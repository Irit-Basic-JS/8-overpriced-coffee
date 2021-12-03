import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let customerOrders = {}

const items = {
  "Americano": {
    name: "Americano",
    image: '/static/img/americano.jpg',
    price: 999,
  },
  "Cappuccino": { 
    name: "Cappuccino", 
    image: "/static/img/cappuccino.jpg", 
    price: 999 
  },
  "Espresso": {
    name: "Espresso",
    image: '/static/img/espresso.jpg',
    price: 111,
  },
  "Flat white": {
    name: "Flat white",
    image: '/static/img/flat-white.jpg',
    price: 222,
  },
  "Latte": {
    name: "Latte",
    image: '/static/img/latte.jpg',
    price: 333,
  },
  "Latte Macchiato": {
    name: "Latte Macchiato",
    image: '/static/img/latte-macchiato.jpg',
    price: 433,
  },
};

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

// 1
// app.use(express.static('static'))

// 2
app.use('/static', express.static('static'));
app.use(cookieParser());
// 
app.get("/", (_, res) => {
  res.redirect('/menu')
 // res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: "overpriced coffee",
    items: Object.values(items),
  });
});

app.get("/buy/:name", (req, res) => {
  let item = items[req.params.name];
  let username = req.cookies.username || "Аноним";
  if (!(username in customerOrders)) {
    customerOrders[username] = [];
  }
  customerOrders[username].push(items[req.params.name])
  //cartContents.push(item);
  //sum += item.price;
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let username = req.cookies.username || "Аноним";
  let order = [];
  let userPrice = 0;
  if(username in customerOrders) {
    order = customerOrders[username];
    userPrice = customerOrders[username].reduce((s, current) => s + current.price, 0)
  }

  res.render("cart", {
    layout: "default",
    title: 'корзина',
    cartContents: order,
    sum: userPrice,
  });
});

app.post("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    cartContents: [],
    title: "Корзина",
    sum: 0,
  });
});


app.get("/login", (req, res) => {
  const username = req.query.username || req.cookies.username || "Аноним";
  res.cookie("username", username);
  res.render("login", {
    layout: "default",
    title: "Личный кабинет",
    username: username,
  });
});


app.listen(port, () => console.log(`App listening on port ${port}`));
