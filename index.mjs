import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

class Item {
    name;
    image;
    price;

    constructor(name, image, price) {
        this.name = name;
        this.image = image;
        this.price = price;
    }
}

class Cart {
    items;

    constructor(items = []) {
        this.items = items;
    }

    get sum() {
        return this.items
            .map(item => item.price)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }

    getCopy() {
        return new Cart(this.items.slice());
    }

    reset() {
        this.items = [];
    }
}

class UserData {
    name;
    history;
    #cart;

    constructor(name = 'Аноним') {
        this.name = name;
        this.history = [];
    }

    get cart() {
        if (!this.#cart) {
            this.#cart = new Cart();
        }

        return this.#cart;
    }
}

const items = [
    new Item('Americano', '/static/img/americano.jpg', 999),
    new Item('Cappuccino', '/static/img/cappuccino.jpg', 899),
    new Item('Espresso', '/static/img/espresso.jpg', 299),
    new Item('Flat white', '/static/img/flat-white.jpg', 599),
    new Item('Latte', '/static/img/latte.jpg', 399),
    new Item('Latte Macchiato', '/static/img/latte-macchiato.jpg', 699)
];

const users = [];
let currentUser = new UserData();

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

app.use('/static', express.static('static'));
app.use(cookieParser());

app.get("/", (_, res) => {
    res.redirect('/menu');
});

app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        title: 'Overpriced Coffee',
        items,
    });
});

app.get("/buy/:name", (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    currentUser.cart.items.push(item);
    res.redirect('/menu');
});

app.get("/cart", (req, res) => {
    res.render('cart', {
        layout: 'default',
        title: 'Cart',
        items: currentUser.cart.items,
        sum: currentUser.cart.sum
    })
});

app.post("/cart", (req, res) => {
    const copyCart = currentUser.cart.getCopy();
    currentUser.history.unshift(copyCart);
    currentUser.cart.reset();
    res.redirect('/menu');
});

app.get("/login", (req, res) => {
    const username = req.query.username || req.cookies.username;
    currentUser = getCurrentUser(username);

    res.cookie('username', username);
    res.render('login', {
        layout: 'default',
        title: 'Login',
        username,
    })
});

app.get('/history', (req, res) => {
    res.render('history', {
        layout: 'default',
        title: 'History',
        carts: currentUser.history
    })
})

app.listen(port, () => console.log(`App listening on port ${port}`));

function getCurrentUser(username) {
    let user = users.find(user => user.name === username);
    if (!user) {
        user = new UserData(username);
        users.push(user);
    }

    return user;
}
