import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

const items = [
    {name: "Americano", image: "/static/img/americano.jpg", price: 999,},
    {name: "Cappuccino", image: "/static//img/cappuccino.jpg", price: 999},
    {name: "Latte", image: "/static//img/latte.jpg", price: 999},
    {name: "Flat white", image: "/static//img/flat-white.jpg", price: 999},
]
let cart = [];

app.use('/static', express.static('static'));
app.use(cookieParser())

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
    res.redirect("/menu");
})


app.get("/menu", (_, res) => {
    res.render("menu", {
        layout: "default",
        items: items,
    });
});

app.get("/buy/:name", (req, res) => {
    cart.push(items.find(x => x.name === req.params.name));
    res.redirect("/menu");
});

app.get("/cart", (req, res) => {
    res.render("cart", {
        layout: "default",
        total: cart.reduce((a, b) => a + b.price, 0),
        items: cart,
    });
});

app.post("/cart", (req, res) => {
    res.redirect("/cart");
});

app.get("/login", (req, res) => {
    let username = req.query['username'] || req.cookies.username || 'Аноним';
    
    if (username !== 'Аноним')
        res.cookie('username', username);

    res.render("login", {
        layout: "default",
        username: username,
    });
});


app.listen(port, () => console.log(`App listening on port ${port}`));
