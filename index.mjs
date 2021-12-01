import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

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

app.use('/static', express.static('static'));
app.use(cookieParser());

app.get("/", (_, res) => {
    res.redirect("/menu");
});

function Coffee(name, image, price) {
    return {
        name, image, price
    };
}

const coffeeTypes = [
    Coffee("Americano", "/static/img/americano.jpg", 999),
    Coffee("Cappuccino", "/static/img/cappuccino.jpg", 999),
    Coffee("Espresso", "/static/img/espresso.jpg", 998),
    Coffee("Flat-white", "/static/img/flat-white.jpg", 999),
    Coffee("Latte", "/static/img/latte.jpg", 999),
    Coffee("Latte-macchiato", "/static/img/latte-macchiato.jpg", 1000),
];

let cart = {};

let history = {};

function HistoryEntry(items, date) {
    return {
        items, date
    };
}

function getUsername(req) {
    return req.cookies.username || "Аноним";
}

function getTheme(req) {
    return req.cookies.theme || "light";
}

app.get("/menu", (req, res) => {
    res.render("menu", {
        layout: "default",
        title: "Меню",
        theme: getTheme(req),
        items: coffeeTypes,
    });
});

app.get("/buy/:name", (req, res) => {
    let name = getUsername(req);

    if (cart[name] === undefined)
        cart[name] = [];

    cart[name].push(coffeeTypes.filter(c => c.name == req.params["name"])[0])

    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    let name = getUsername(req);

    if (cart[name] === undefined)
        cart[name] = [];

    res.render("cart", {
        layout: "default",
        title: "Корзина",
        theme: getTheme(req),
        cart: cart[name],
        totalCost: cart[name].map(c => c.price).reduce((a, b) => a + b, 0),
    });
});

app.post("/cart", (req, res) => {
    let name = getUsername(req);

    if (history[name] === undefined)
        history[name] = [];

    let date = new Date(Date.now()).toLocaleString("ru-RU");
    history[name].push(new HistoryEntry(cart[name], date));

    cart[name] = [];

    res.render("cart", {
        layout: "default",
        title: "Корзина",
        theme: getTheme(req),
        cart: cart[name],
        totalCost: cart[name].map(c => c.price).reduce((a, b) => a + b, 0),
    });
});

app.get("/login", (req, res) => {
    let name = req.query.username || getUsername(req);

    res.cookie("username", name);

	res.render("login", {
        layout: "default",
        title: "Личный кабинет",
        theme: getTheme(req),
        name: name,
    });
});

app.get("/history", (req, res) => {
    let name = getUsername(req);

    if (history[name] === undefined)
        history[name] = [];

    history[name].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    res.render("history", {
        layout: "default",
        title: "История заказов",
        theme: getTheme(req),
        history: history[name],
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
