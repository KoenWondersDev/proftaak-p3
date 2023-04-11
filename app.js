const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("mysql");
require("dotenv").config();

const indexRouter = require("./routes/index");
const app = express();

const crypto = require("crypto");
const fs = require("fs");

const secretKey = "4VH2Z482S5QZ8nXKRjJrGZzqEAaHDloB";

const unencrypted = fs.readFileSync("password.txt", "utf8");

const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
let decrypted = decipher.update(unencrypted, "hex", "utf8");
decrypted += decipher.final("utf8");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// maak een route die reageert op GET-verzoeken naar /pages/contact
app.get("/pages/contact", function (req, res) {
  // render de contactpagina met de juiste Jade-template
  res.render("contact", { title: "Contact" });
});

app.get("/pages/search", function (req, res) {
  res.render("search", { title: "Search" });
});

app.get("/pages/uitkomst", function (req, res) {
  res.render("uitkomst", { title: "Results" });
});
app.get("/pages/about", function (req, res) {
  res.render("about", { title: "About" });
});
app.get("/pages/downloads", function (req, res) {
  res.render("downloads", { title: "Downloads" });
});

app.post("/pages/contact", (req, res) => {
  const text = req.body.text;
  res.render("uitkomst", { text });
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: decrypted,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

app.post("/pages/search", (req, res) => {
  const name = req.body.name;
  const sql = `SELECT * FROM products WHERE naam LIKE '%${name}%' OR categorie LIKE '%${name}%'`;

  connection.query(sql, (error, results) => {
    console.log(results);

    if (error) throw error;

    res.render("search", { results });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

app.listen(3000, function () {
  console.log("Voorbeeldapp luistert op poort 3000!");
});
