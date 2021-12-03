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
let cartContents = [];
const items = {
  "Americano":{name: "Americano", image: '/static/img/americano.jpg',price: 999,
  },
  "Cappuccino":{name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 
  },
  "Espresso":{name: "Espresso", image: '/static/img/espresso.jpg', price: 111,
  },
  "Flat white":{name: "Flat white", image: '/static/img/flat-white.jpg', price: 222,
  },
  "Latte":{name: "Latte", image: '/static/img/latte.jpg', price: 333,
  },
  "Latte Macchiato":{name: "Latte Macchiato", image: '/static/img/latte-macchiato.jpg', price: 433,
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


// 1. //
app.use('/static', express.static('static'));

// 2. //
app.get("/", (_, res) => {
  res.redirect('/menu')
});

// 3. //
app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    title: 'OverpricedCoffe',
    items: Object.values(items) 
  });
});

// 5. //
app.get("/buy/:name", (req, res) => {
  let item = items[req.params.name];
  cartContents.push(item);
  sum += item.price;
  res.redirect('/menu');
});



// 4. //
app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    cartContents: cartContents,
    sum: sum,
  });
});

// 6. //
app.post("/cart", (req, res) => {
  let user = "Аноним";
  if (!(user in CustomersHistory)) {
    CustomersHistory[user] = [];
  }/*
   CustomersOrders[user].forEach(element => {
     CustomersHistory[user].push(element);
   });*/
  CustomersOrders[user] = [];
  CustomersHistory = cartContents.slice(0);
  cartContents = [];
  sum = 0
  res.redirect("/menu");
});

app.use(cookieParser());
// 7. //
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
