import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { app } from "./app";
dotenv.config();

// Connection URI
const { MONGODB_USER, MONGODB_PASSWORD } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.s0yec.mongodb.net/?retryWrites=true&w=majority`;
const dbName = "calorie_counter";
// Create a new MongoClient
const client = new MongoClient(uri);
const connectToDB = async () => {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db(dbName).command({ ping: 1 });
    app.locals.recordsColl = client.db(dbName).collection("records");
    console.log("-> Connected to MongoDB");
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.error(error);
    await client.close();
  }
};

export default connectToDB;
