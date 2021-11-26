import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let sum = 0;

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
// console.log(rootDir);
// 
app.get("/", (_, res) => {
  res.redirect('/menu')
 // res.sendFile(path.join(rootDir, "/static/html/index.html"));
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: Object.values(items),
  });
});
// cart2
app.get("/buy/:name", (req, res) => {
  let item = items[req.params.name];
  cartContents.push(item);
  sum += item.price;
  res.redirect('/menu');
});

const cartContents = [];

app.get("/cart", (req, res) => {
  res.render("cart", {
    layout: "default",
    cartContents: cartContents,
    sum: sum,
  });
});


app.get("/cart2", (req,res) => {
  res.render("cart2", {
    layout: "default",
    cartContents: [],
    sum: sum,
  });
});

app.post("/cart", (req, res) => {
  res.status(501).end();
});

app.get("/login", (req, res) => {
  res.status(501).end();
});

app.listen(port, () => console.log(`App listening on port ${port}`));
