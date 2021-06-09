import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const products = [
  {
    name: "Americano",
    image: "/static/img/americano.jpg",
    price: 999,
  },
  {
    name: "Cappuccino",
    image: "/static/img/cappuccino.jpg",
    price: 999
  },
  {
    name: "Espresso",
    image: "/static/img/espresso.jpg",
    price: 999,
  },
  {
    name: "Latte",
    image: "/static/img/latte.jpg",
    price: 999,
  },
  {
    name: "Flat-white",
    image: "/static/img/flat-white.jpg",
    price: 999,
  },
  {
    name: "Latte-macchiato",
    image: "/static/img/latte-macchiato.jpg",
    price: 999,
  },
];
const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser())
app.use('/static', express.static('static'))

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
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu')
});

app.get("/menu", (req, res) => {
  res.render("menu", {
    layout: "default",
    title: 'Меню',
    isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
    items: products,
  });
});

app.get("/buy/:name", (req, res) => {
  const cart = req.cookies.cart || [];
  const newCart = [
    ...cart,
    req.params.name,
  ];
  res.cookie('cart', newCart);
  res.redirect('/');
});

app.get("/cart", (req, res) => {
  const _cart = req.cookies.cart || [];
  const cart = _cart.map(el => products.find(product => product.name === el));
  res.render('cart', {
    layout: 'default',
    title: 'Корзина',
    isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
    fullPrice: cart.reduce((accum, curVal) => curVal.price + accum, 0),
    items: cart,
  });
});

app.post("/cart", (req, res) => {
  const cart = req.cookies.cart;
  if (cart && cart.length > 0) {
    const history = req.cookies.history || [];
    const newHistory = [
      ...history,
      {
        number: history.length + 1,
        cart: cart.map(e => {
          return {
            name: e,
            price: products.find(el => el.name === e).price,
          }
        }),
      },
    ];
    res.cookie('history', newHistory);
    res.cookie('cart', []);
    res.redirect('/');
  }
});

app.get("/login", (req, res) => {
  const username = req.query.username || req.cookies.username || 'Аноним';
  res.cookie('username', username);
  res.render('login', {
    layout: 'default',
    title: 'Личный кабинет',
    isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
    username: username,
  });
});

app.get("/history", (req, res) => {
  const rHistory = req.cookies.history && req.cookies.history.reverse() || [];
  res.render('history', {
    layout: 'default',
    title: 'История',
    isDarkTheme: (req.cookies.dark_theme === 'true' ?? false) ? 'checked' : '',
    history: rHistory,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
