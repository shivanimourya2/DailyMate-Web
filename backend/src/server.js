const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB(); // connect to the database first...
    app.listen(env.port, () => {
      // ...then start accepting requests
      console.log(`DailyMate server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    console.error("Check MONGO_URI, your Atlas username/password and Network Access (IP).");
    process.exit(1);
  }
};

startServer();