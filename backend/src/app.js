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

// Needed for correct client IPs (rate limiting) when hosted behind a proxy.
if (env.trustProxy) app.set("trust proxy", Number(env.trustProxy));

app.use(helmet()); // adds safe security headers and hides X-Powered-By
if (env.nodeEnv === "development") app.use(morgan("dev")); // logs each request

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header means Postman, curl or server-to-server: allow it.
      // Browsers always send one, and it must be in CLIENT_URL.
      callback(null, !origin || env.clientUrls.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // browsers may cache the preflight answer for a day
  })
);

app.use("/api", apiLimiter);
app.use(express.json({ limit: "10kb" })); // reject huge request bodies

app.use("/api", routes);

// These two must stay last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
