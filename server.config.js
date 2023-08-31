module.exports = {
  apps: [
    {
      name: "queue",
      script: "server.js",
      env: {
        MYSQL_HOST: "localhost",
        MYSQL_USER: "root",
        MYSQL_DB: "proschool",
        MYSQL_PASS: "11Agustus!",
        PORT: 1701,
      },
    },
    {
      name: "worker",
      script: "worker.js",
      exec_mode: "fork",
      instances: "max",
      increment_var: "PORT",
      env: {
        MYSQL_HOST: "localhost",
        MYSQL_USER: "root",
        MYSQL_DB: "proschool",
        MYSQL_PASS: "11Agustus!",
        PORT: 1701,
      },
    },
  ],
};
