const mysql = require("mysql2");
const Queue = require("bee-queue");
const queue = new Queue("saving_worksheet");
const fs = require("fs");

const isDev = (process.env.NODE_ENV || "development") === "development";

if (isDev) {
  require("dotenv").config();
}

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PASS,
});

queue.process(async (job, done) => {
  connection.query(job.data.task, (err, _) => {
    if (err) {
      throw new Error(err);
    }

    return done(null, null);
  });
});

queue.on("succeeded", (job) => {
  if (fs.existsSync(`./failed_jobs/${job.data.key}.json`)) {
    fs.unlinkSync(`./failed_jobs/${job.data.key}.json`);
  }

  fs.writeFileSync(
    `./succeed_jobs/${job.data.key}.json`,
    JSON.stringify(job.data)
  );
});

queue.on("failed", (job) => {
  fs.writeFileSync(
    `./failed_jobs/${job.data.key}.json`,
    JSON.stringify(job.data)
  );
});
