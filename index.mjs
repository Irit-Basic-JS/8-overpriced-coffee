import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

let buy = {};
const drinks = [
    {name: "Americano", image: "/static/img/americano.jpg", price: 150},
    {name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 200},
    {name: "Espresso", image: "/static/img/espresso.jpg", price: 250},
    {name: "Latte", image: "/static/img/latte.jpg", price: 250},
    {name: "Flat white", image: "/static/img/flat-white.jpg", price: 300},
    {name: "Latte macchiato", image: "/static/img/latte-macchiato.jpg", price: 200},
    {name: "Cum Cup", image: "https://www.yousaidit.co.uk/wp-content/uploads/2018/09/MUG-0039.jpg", price: 300},
]

app.use(cookieParser());

app.use("/static", express.static("static"));//1
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

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: drinks,
        title: "Меню"
    });
});

app.get("/buy/:name", (req, res) => {
    buy[req.cookies.name].push(drinks.find(drink => drink.name === req.params.name));
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    const user = req.cookies.name;
    const total = buy[user] ? buy[user].reduce((prev, curr) => prev + curr.price, 0) : 0;
    res.render("cart", {
        layout: "default",
        items: buy[user],
        total: total,
        title: "Заказ"
    });
});

app.post("/cart", (req, res) => {
    buy[req.cookies.name] = [];
    res.redirect("/cart");
});

app.get("/login", (req, res) => {
    let name;
    if (req.query.username) {
        name = req.query.username;
        res.cookie("name", name);
    }
    else if (req.cookies && req.cookies.name) {
        name = req.cookies.name;
    }
    if (!buy[name])
        buy[name] = [];
    res.render("login", {
        layout: "default",
        name: name || "Анонимус",
        title: "Вход"
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
