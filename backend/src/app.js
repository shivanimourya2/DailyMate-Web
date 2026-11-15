const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const { apiLimiter } = require("./middleware/rateLimiter");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const app = express();

if (env.trustProxy) app.set("trust proxy", Number(env.trustProxy));

app.use(helmet()); // adds safe security headers and hides X-Powered-By
if (env.nodeEnv === "development") app.use(morgan("dev")); // logs each request

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || env.clientUrls.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, 
  })
);

app.use("/api", apiLimiter);
app.use(express.json({ limit: "10kb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;