import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(express.static("static"));

const coffee_list = [
  {
    name: "Americano",
    image: "/img/americano.jpg",
    price: 999,
  },
  { 
    name: "Cappuccino",
    image: "/img/cappuccino.jpg",
    price: 999 
  },
  {
    name: "Espresso",
    image: "/img/espresso.jpg",
    price: 999
  },
  { 
    name: "Latte", 
    image: "/img/latte.jpg",
    price: 999
  },
];
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
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect("/menu").end();
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee_list,
  });
});

let order_list = [];

app.get("/buy/:name", (req, res) => {
  let new_coffee = { ...(coffee_list.find(item => item.name === req.params.name)) };
  order_list.push(new_coffee);
  res.redirect("/menu").end();
});

app.get("/cart", (_, res) => {
  res.render("cart", {
    layout: "default",
    sum: order_list.reduce((sum, coffee) => sum + coffee.price, 0),
    items: order_list,
  });
});

app.post("/cart", (req, res) => {
  order_list = [];
  res.redirect("/menu");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(rootDir, "/static/html/login.html"));
});

app.listen(port, () => console.log(`App listening on port ${port}`));