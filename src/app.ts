import express from "express";
import logRequests from "./utils/logRequests";
import recordsAPI from "./components/records/recordsAPI";
import handleErrors from "./components/errors/handleErrors";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// const { CORS_ALLOWED_ORIGIN = "http://localhost:3000" } = process.env;

app.use(cors());
app.use(logRequests);
app.use(express.json());

// const router = express.Router();
app.use("/records", recordsAPI);
app.get("/", (req, res) => {
  console.log("Root - /");
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});
app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.use(handleErrors);

// app.use("/.netlify/functions/app", router); // path must route to lambda

// module.exports.handler = serverless(app);

export default app;
