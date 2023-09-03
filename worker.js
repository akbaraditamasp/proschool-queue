const mysql = require("mysql2");
const Queue = require("bee-queue");
const fs = require("fs");

const isDev = (process.env.NODE_ENV || "development") === "development";

if (isDev) {
  require("dotenv").config();
}

const queue = new Queue("saving_worksheet");

console.log("running...");

if (isDev) {
  require("dotenv").config();
}

const connection = mysql.createConnection({
  host: "103.250.11.49",
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DB,
  password: process.env.MYSQL_PASS,
});

const processing = (task, children = []) =>
  new Promise((resolve) => {
    connection.query(task, async (err, result) => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }

      let failed = false;
      for (const query of children) {
        if (
          !(await processing(
            query.task.replace("%id%", result.insertId),
            query.children || []
          ))
        ) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        resolve(true);
      }
    });
  });

queue.process(async (job, done) => {
  if (await processing(job.data.task, job.data.children || [])) {
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
