import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

let coffeeDir = {
    "Americano": {name: "Americano", image: "/static/img/americano.jpg", price: 150},
    "Cappuccino": {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 250},
    "Espresso": {name: "Espresso", image: "/static/img/espresso.jpg", price: 100},
    "Flat White": {name: "Flat White", image: "/static/img/flat-white.jpg", price: 270},
    "Latte": {name: "Latte", image: "/static/img/latte.jpg", price: 270},
    "Latte Macchiato": {name: "Latte Macchiato", image: "/static/img/latte-macchiato.jpg", price: 300}
}

let carts = {}
let histories = {}

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'))
app.use(cookieParser());

app.set("view engine", "hbs");
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
        title: "Меню",
        layout: "default",
        items: Object.values(coffeeDir)
    });
});

app.get("/buy/:name", (req, res) => {
    let username = req.cookies.username || "Аноним";
    if (!(username in carts)) {
        carts[username] = [];
    }
    carts[username].push(coffeeDir[req.params.name])
    res.redirect('/menu');
});

app.get("/cart", (req, res) => {
    let username = req.cookies.username || "Аноним";
    res.render("cart", {
        layout: "default",
        title: "Корзина",
        items: carts[username] || [],
        sum: (carts[username] || []).reduce((s, current) => s + current.price, 0)
    });
});

let idCounter = 0;
app.post("/cart", (req, res) => {
    let username = req.cookies.username || "Аноним";
    if (carts[username]) {
        if (!(username in histories)) {
            histories[username] = [];
        }
        histories[username].push({
            id: ++idCounter,
            time: new Date().toLocaleString("ru"),
            items: carts[username].map(i => {
                return {name: i.name}
            }),
            sum: carts[username].reduce((s, current) => s + current.price, 0)
        });
        carts[username].splice(0);
    }
    res.redirect("/menu");
});

app.get("/login", (req, res) => {
    let username = req.query.username || req.cookies.username || "Аноним";
    res.cookie("username", username);
    res.render("login", {
        layout: "default",
        title: "Авторизация",
        username: username
    });
});

app.get("/history", (req, res) => {
    let username = req.cookies.username || "Аноним";
    res.render("history", {
        layout: "default",
        title: "История заказов",
        orders: histories[username] || []
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
