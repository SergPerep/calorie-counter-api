import express from "express";
import serverless from "serverless-http";
import logRequests from "./utils/logRequests";
import recordsAPI from "./components/records/recordsAPI";
import handleErrors from "./components/errors/handleErrors";
import cors from "cors";
export const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(logRequests);
app.use(express.json());

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

router.use("/records", recordsAPI);
router.get("/hello", (req, res) => {
  res.send("Hello");
});

app.use(handleErrors);

app.use("/.netlify/functions/api", router); // path must route to lambda

module.exports.handler = serverless(app);
