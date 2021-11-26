import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'));
app.use(cookieParser());

let cart = {};
let history = {};

class Coffee {
    name;
    image;
    price;

    constructor(name, image, price) {
        this.name = name;
        this.image = image;
        this.price = price;
    }
}

class History {
    items;
    date;

    constructor() {
        this.items = [];
    }
}

let coffee_list = [
    new Coffee("Americano", "/static/img/americano.jpg", 123),
    new Coffee("Cappuccino", "/static/img/cappuccino.jpg", 123),
    new Coffee("Espresso", "/static/img/espresso.jpg", 123),
    new Coffee("Flat-white", "/static/img/flat-white.jpg", 123),
    new Coffee("Latte", "/static/img/latte.jpg", 123),
    new Coffee("Latte-macchiato", "/static/img/latte-macchiato.jpg", 123),
];

function getUsername(req) {
    return req.cookies['username'] || "Аноним";
}

function getTheme(req) {
    return req.cookies['theme'] || 'light';
}

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

app.get("/menu", (req, res) => {
    res.render("menu", {
        layout: "default",
        items: coffee_list,
        title: "Menu",
        theme: getTheme(req)
    });
});

app.get("/buy/:name", (req, res) => {
    if (cart[getUsername(req)] === undefined)
        cart[getUsername(req)] = [];
    cart[getUsername(req)].push(coffee_list.filter(c => c.name === req.params["name"])[0]);
    res.redirect('/menu');
});

app.get("/cart", (req, res) => {
    let items = cart[getUsername(req)] || [];
    res.render('cart', {
        layout: "default",
        items: items,
        total_price: items.map(c => c.price).reduce((a, b) => a + b, 0),
        title: 'Cart',
        theme: getTheme(req)
    });
});

app.post("/cart", (req, res) => {
    const hist = new History();
    hist.items = cart[getUsername(req)];
    hist.date = new Date(Date.now()).toLocaleString("ru-RU");

    if (history[getUsername(req)] === undefined)
        history[getUsername(req)] = [];
    history[getUsername(req)].push(hist);

    cart[getUsername(req)] = [];
    res.redirect('/menu');
});

app.get("/login", (req, res) => {
    let username = req.query['username'] || getUsername(req);
    res.cookie('username', username);
    res.render('login', {
        layout: "default",
        username: username,
        title: 'Profile',
        theme: getTheme(req)
    });
});

app.get("/history", (req, res) => {
    let hist = history[getUsername(req)] || [];
    res.render('history', {
        layout: "default",
        history: [...hist].reverse(),
        title: 'History',
        theme: getTheme(req)
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
