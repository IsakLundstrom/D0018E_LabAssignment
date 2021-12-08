var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var sessions = require("express-session");
// Create routers
var indexRouter = require("./routes/index");
var registrationRouter = require("./routes/registration"); // SE HÄR
var loginRouter = require("./routes/login");
var productRouter = require("./routes/product");
var settingsRouter = require("./routes/settings");
var cartRouter = require("./routes/cart");
var ordersRouter = require("./routes/orders");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const oneDay = 1000 * 60 * 60 * 24;
//Session cooike for login
app.use(
  sessions({
    secret: "Eddie123",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//Create routes
app.use("/", indexRouter);
app.use("/registration", registrationRouter); // SE HÄR
app.use("/login", loginRouter);
app.use("/product", productRouter);
app.use("/settings", settingsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);

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
