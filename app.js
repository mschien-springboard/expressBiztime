/** BizTime express application. */

const express = require("express");
const ExpressError = require("./expressError")
const cRoutes = require("./routes/companies");
const iRoutes = require("./routes/invoices");
const inRoutes = require("./routes/industries");

const app = express();

app.use(express.json());

app.use("/companies", cRoutes);
app.use("/invoices", iRoutes);
app.use("/industries", inRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});

module.exports = app;
