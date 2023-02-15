var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

const mod = require("./module").module;
// view engine setup
app.set("views", mod.path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(mod.logger("dev"));
app.use(mod.express.json());
app.use(mod.express.urlencoded({ extended: false }));
app.use(mod.cookieParser());
app.use(mod.express.static(mod.path.join(__dirname, "public")));
app.use(
  mod.cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(
  mod.cookieSession({
    name: "sess", //name of the cookie containing access token in the //browser
    secret: "asdfgh",
    httpOnly: true,
  })
);
app.use("/oauth", indexRouter);
// error handler
app.use(function (err, req, res, next) {
  res.status(err.status).send();
});
app.listen(mod.config.APP_PORT, function () {
  console.log("app listening on port" + mod.config.APP_PORT);
});

module.exports = app;
