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
		price: 999,
	},
	{
		name: "Espresso",
		image: "/static/img/espresso.jpg",
		price: 666,
	},
	{
		name: "Flat-white",
		image: "/static/img/flat-white.jpg",
		price: 1900,
	},
	{
		name: "latte",
		image: "/static/img/latte.jpg",
		price: 1200,
	},
	{
		name: "Latte-macchiato",
		image: "/static/img/latte-macchiato.jpg",
		price: 1200000,
	},
];

let cart = [];
const rootDir = process.cwd();
const port = 3000;
const app = express();
app.use("/static", express.static("static"));
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
	}),
);

app.get("/", (_, res) => {
	res.sendFile(path.join(rootDir, "/static/html/index.html"));
	res.redirect("/menu");
});

app.get("/menu", (_, res) => {
	res.render("menu", {
		layout: "default",
		items: products,
	});
});

app.get("/cart", (req, res) => {
	res.render("cart", {
		layout: "default",
		total: getTotalPrice(),
		items: cart,
	});
});

app.post("/cart", (req, res) => {
	cart = [];
	res.redirect("/cart");
});

app.get("/login", (req, res) => {
	res.status(501).end();
});

app.get("/buy/:name", function (req, res) {
	cart.push(products.find(x => x.name === req.params.name));
	res.redirect("/menu");
});

app.listen(port, () => console.log(`App listening on port ${port}`));


function getTotalPrice() {
	let sum = 0;
	for (const product of cart) {
		sum += product.price;
	}
	return sum;
}