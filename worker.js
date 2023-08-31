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

const processing = (task) =>
  new Promise((resolve) => {
    connection.query(task, (err, _) => {
      if (err) {
        console.log(err);
        resolve(false);
      }

      resolve(true);
    });
  });

queue.process(async (job, done) => {
  if (await processing(job.data.task)) {
    return done(null, null);
  } else {
    return done(new Error("Error"), null);
  }
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
