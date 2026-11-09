const app = require("./app");
const env = require("./config/env");

app.listen(env.port, () => {
  console.log(`DailyMate server running on port ${env.port} (${env.nodeEnv})`);
});