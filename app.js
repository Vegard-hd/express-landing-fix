const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
require("dotenv").config();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(cookieParser());
app.use(function (req, res, next) {
  const cookies = req.cookies;
  // let darkmode = cookies?.darkmode === "1" ? true : false;
  let darkmode;
  if (cookies.darkmode === "1") {
    darkmode = true;
  } else {
    // Check for the prefers-color-scheme header
    if (req.headers["sec-ch-prefers-color-scheme"] === "dark") {
      darkmode = true;
    } else if (req.headers["sec-ch-prefers-color-scheme"] === "light") {
      darkmode = false;
    }
  }
  if (!darkmode) darkmode = false;
  // If the user has a preference in their browser settings, use that.
  // Note: This header is not supported by all browsers yet.
  // You might want to combine this with a client-side solution for broader compatibility.
  console.log(darkmode);
  // @ts-ignore
  req.darkmode = darkmode;
  next();
});

app.use(
  compression({
    level: 8,
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Add this line to parse URL-encoded bodies

// public files and node modules
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/js",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js/")),
);
app.use(
  "/css",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css/")),
);

// router endpoint binding
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

module.exports = app;
