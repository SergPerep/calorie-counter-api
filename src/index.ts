import dotenv from "dotenv";
import connectToDB from "./db";
import app from "./app";
dotenv.config();

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`-> Server is running on port ${PORT}`);
  connectToDB();
});
