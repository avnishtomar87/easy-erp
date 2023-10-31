const express = require("express");
const app = express();
require("dotenv").config();
const { PORT, API_PREFIX } = require("./helpers/constant");
const port = PORT || 3001;
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
var favicon = require("serve-favicon");
const globalErrorHandler = require("./controllers/error.controller");
const { AppError } = require("./utils/appError");
const { loadRouter } = require("./routes")
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const { rateLimit } = require("express-rate-limit");
const compression = require("compression");

// 1) MIDDLEWARES
//For secure HTTP headers
app.use(helmet());
//data sanitize
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

//for limiting api call from same IP address
const Limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests in an hour , please try after an hour",
});
app.use(`/api`, Limiter);

app.use(compression());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Routes
// 3) ROUTES
app.use(API_PREFIX, loadRouter());

//handled no route url error
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
