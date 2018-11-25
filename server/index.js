const express = require("express");
const path = require("path");
const opn = require("opn");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const logger = require("morgan");
const cors = require("cors");
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
// const auth = require("./routes/auth");
const router = require("./routes");

const { log, chalkSuccess } = require("../chalkpresets");

const PORT = process.env.PORT || 3000;

const app = express();

// Apply middleware
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(compression("gzip"));
app.use(
  logger("combined", {
    skip(req, res) {
      return res.statusCode < 400;
    },
  }),
);
app.use(cors());
app.use(express.static(path.join(__dirname, "../dist/")));
app.use(busboy());
app.use(busboyBodyParser({ limit: "50mb" }));
app.use("/", router);

// development error handler
// will print stack trace
if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

if (process.env.NODE_ENV === "production") {
  app.listen(PORT, () => {
    log(chalkSuccess(`Port ${PORT} is lit fam 🔥 🔥 🔥`));
    opn(`http://localhost:${PORT}`);
  });
} else {
  console.log(process.env.NODE_ENV);
  app.listen(PORT, () => {
    log(chalkSuccess(`Wanderer running on port ${PORT}`));
  });
}

// app.listen(PORT, () => {
//   log(chalkSuccess(`Port ${PORT} is lit fam 🔥 🔥 🔥`));
// });

// production variant for reverse proxy
// app.listen(PORT, '0.0.0.0', (err) => {
//   log(chalkSuccess(`Port ${PORT} is lit fam 🔥 🔥 🔥`));
// });
