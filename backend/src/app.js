const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.use("/api", routes);

// These two must stay last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;