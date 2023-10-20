module.exports = {
  apps: [
    {
      name: "queue",
      script: "server.js",
      env: {
        MYSQL_HOST: "103.250.11.49",
        MYSQL_USER: "logos",
        MYSQL_DB: "logos",
        MYSQL_PASS: "W@rung01",
        PORT: 1701,
        REDIS_HOST: "103.250.11.49",
        REDIS_PASS: "W@rung01"
      },
    },
    {
      name: "worker",
      script: "worker.js",
      exec_mode: "fork",
      instances: "max",
      increment_var: "PORT",
      env: {
        MYSQL_HOST: "103.250.11.49",
        MYSQL_USER: "logos",
        MYSQL_DB: "logos",
        MYSQL_PASS: "W@rung01",
        PORT: 1702,
        REDIS_HOST: "103.250.11.49",
        REDIS_PASS: "W@rung01"
      },
    },
  ],
};
