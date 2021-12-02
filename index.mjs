import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
let cart = {};
let history = {};
const coffeeTypes = [
  {
    name: "Американо",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Капуччино",
    image: "/static/img/cappuccino.jpg",
    price: 1000000,
  },
  {
    name: "Эспрессо",
    image: "/static/img/espresso.jpg",
    price: 822,
  },
  {
    name: "Флэт уайт",
    image: "/static/img/flat-white.jpg",
    price: 4299,
  },
  {
    name: "Латте",
    image: "/static/img/latte.jpg",
    price: 9990,
  },
  {
    name: "Латте моккачино",
    image: "/static/img/latte-macchiato.jpg",
    price: 1337,
  }
]

function Order(items, date) {
  return {
      items, date
  };
}

app.use('/static', express.static('static'));
app.use(cookieParser());

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

app.get("/menu", (req, res) => {
    res.render("menu", {
        layout: "default",
        title: "Меню",
        theme: req.cookies.theme || "light",
        items: coffeeTypes
    });
});

app.get("/buy/:name", (req, res) => {
    let name = req.cookies.username || "Anonymus";

    if (cart[name] === undefined)
        cart[name] = [];

    cart[name].push(coffeeTypes.filter(x => x.name == req.params["name"])[0])

    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    let name = req.cookies.username || "Anonymus";

    if (cart[name] === undefined)
        cart[name] = [];

    res.render("cart", {
        layout: "default",
        title: "Корзина",
        theme: req.cookies.theme || "light",
        cart: cart[name],
        total: cart[name].map(x => x.price).reduce((a, b) => a + b, 0)
    });
});

app.post("/cart", (req, res) => {
    let name = req.cookies.username || "Anonymus";

    if (history[name] === undefined)
        history[name] = [];

    let date = new Date(Date.now()).toLocaleString("ru-RU");
    history[name].push(new Order(cart[name], date));

    cart[name] = [];

    res.render("cart", {
        layout: "default",
        title: "Корзина",
        theme: req.cookies.theme || "light",
        cart: cart[name],
        total: cart[name].map(x => x.price).reduce((a, b) => a + b, 0)
    });
});

app.get("/login", (req, res) => {
    let name = req.query.username || req.cookies.username || "Аноним";

    res.cookie("username", name);

	res.render("login", {
        layout: "default",
        title: "Личный кабинет",
        theme: req.cookies.theme || "light",
        name: name
    });
});

app.get("/history", (req, res) => {
    let name = req.cookies.username || "Аноним";

    if (history[name] === undefined)
        history[name] = [];

    history[name].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    res.render("history", {
        layout: "default",
        title: "Заказы",
        theme: req.cookies.theme || "light",
        history: history[name]
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));