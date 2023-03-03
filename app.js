require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongoConnect = require("connect-mongo");
const session = require("express-session");
const Category = require("./models/category");
var MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

const app = express();

// mongodb configuration
connectDB();
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
const dbUrl = process.env.MONGO_URI || "mongodb://localhost/bags-ecommerce";
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);

// global variables across routes
app.use(async (req, res, next) => {
  try {
    // res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    // res.locals.currentUser = req.user;
    const categories = await Category.find({}).sort({ title: 1 }).exec();
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});


//routes config
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
// const usersRouter = require("./routes/user");
// const pagesRouter = require("./routes/pages");
app.use("/products", productsRouter);
// app.use("/user", usersRouter);
// app.use("/pages", pagesRouter);
app.use("/", indexRouter);

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

var port = process.env.APP_PORT || 3030;
app.set("port", port);
app.listen(port, () => {
  console.log("Server running at port " + port);
});

module.exports = app;
