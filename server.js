const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const Queue = require("bee-queue");
const { createServer } = require("http");

const isDev = (process.env.NODE_ENV || "development") === "development";

if (isDev) {
  require("dotenv").config();
}

const queue = new Queue("saving_worksheet");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  for (const query of req.body.queries) {
    const job = queue.createJob(query);

    await job.timeout(3000).retries(2).save();
  }

  return res.sendStatus(200);
});

const server = createServer(app);

server.listen(process.env.PORT, () => {
  console.log("running");
});
