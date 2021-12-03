import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let CustomersOrders = {};
let CustomersHistory = {};
let sum = 0;
const items = {
  "Americano": { name: "Americano", image: '/static/img/americano.jpg', price: 999 },
  "Cappuccino": { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 899 },
  "Espresso": { name: "Espresso", image: "/static/img/espresso.jpg", price: 299 },
  "Flat white": { name: "Flat white", image: "/static/img/flat-white.jpg", price: 599 },
  "Latte": { name: "Latte", image: "/static/img/latte.jpg", price: 399 },
  "Latte Macchiato": { name: "Latte Macchiato", image: "/static/img/latte-macchiato.jpg", price: 699 },
};

// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view

app.use('/static',express.static('static'));
app.use(cookieParser());

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
    title: 'OverpricedCoffe',
    items: Object.values(items) 
  });
});

app.get("/buy/:name", (req, res) => {
  let user = req.cookies.username || "Аноним";
    if (!(user in CustomersOrders)) {
      CustomersOrders[user] = [];
    }
    CustomersOrders[user].push(items[req.params.name])
    res.redirect('/menu');
});


app.get("/cart", (req, res) => {
  let user = req.cookies.username || "Аноним";
  let order=[];
  let price=0;
  if ((user in CustomersOrders)){
    order = CustomersOrders[user];
    price = CustomersOrders[user].reduce((s, current) => s + current.price, 0)
  }
  
  res.render("cart", {
    layout: "default",
    title: "Корзина",
    cart: order,
    sum: price
  });
});

app.post("/cart", (req, res) => {
  let user = req.cookies.username || "Аноним";
  if (!(user in CustomersHistory)) {
    CustomersHistory[user] = [];
  }
   CustomersOrders[user].forEach(element => {
     CustomersHistory[user].push(element);
   });
  CustomersOrders[user] = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  let username = req.query.username || req.cookies.username || "Аноним";
  res.cookie("username", username);
  res.render("login", {
      layout: "default",
      title: "Авторизация пользователя",
      username: username
  });
});

app.get("/history",(req,res)=>{
  let user = req.query.username || req.cookies.username || "Аноним";
  console.log( CustomersHistory[user]);
  res.render("history", {
    layout: "default",
    items: CustomersHistory[user],
    title: "История заказов",
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
