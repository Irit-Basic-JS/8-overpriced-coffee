import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();
const coffee = [
	{
		name: "americano",
		image: "/static/img/americano.jpg",
		price: 60,
	},
	{
		name: "cappuccino",
		image: "/static/img/cappuccino.jpg",
		price: 90,
	},
	{
		name: "espresso",
		image: "/static/img/espresso.jpg",
		price: 75,
	},
	{
		name: "flat-white",
		image: "/static/img/flat-white.jpg",
		price: 80,
	},
  {
		name: "latte-macchiato",
		image: "/static/img/latte-macchiato.jpg",
		price: 100,
	},
	{
		name: "latte",
		image: "/static/img/latte.jpg",
		price: 85,
	}	
];
const users = {};

app.use("/static", express.static("static"));
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

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: coffee,
    title: "Menu"
  });
});

app.get("/buy/:name", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) {
		res.redirect("/login");
		return;
	}
	user.cart.push(coffee.find(x => x.name === req.params.name));
	res.redirect("/menu");
});

function getCurrentUser(res) {
	const name = res.cookies.name;
	if (name in users) {
		return users[name];
	}
	return null;
}

app.get("/cart", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) {
		res.redirect("/login");
		return;
	}
  res.render("cart", {
		layout: "default",
		total: getTotal(user.cart || []),
		items: user.cart || [],
		title: "Cart",
	});
});

function getTotal(user_cart) {
	let sum = 0;
	for (const product of user_cart) {
		sum += product.price;
	}
	return sum;
}

app.post("/cart", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) {
		res.redirect("/login");
		return;
	}
	user.history.push({
		cart: user.cart,
		id: user.id++
	});
	user.cart = [];
	res.redirect("/cart");
});

app.get("/login", (req, res) => {
  if (req.query.username) {
		if (!(req.query.username in users)) {
			const user = {
				name: req.query.username,
				cart: [],
        history: [],
				id: 1
			};
			users[user.name] = user;
		}
		res.cookie("name", req.query.username);
	}
	res.render("login", {
		layout: "default",
		username: req.cookies.name || "username",
    title: "Login",
	});
});

app.get("/history", function (req, res) {
	const user = getCurrentUser(req);
	if (!user) {
		res.redirect("/login");
		return;
	}
	res.render("history", {
		layout: "default",
		title: "History",
		items: user.history,
	});
});

app.listen(port, () => console.log(`App listening on port ${port}`));
