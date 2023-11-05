import express from "express";
import { MongoClient } from "mongodb";
import db from "./utils/db.js";
import { initDb, readProducts, initCart } from "./utils/operation.js";
import cors from "cors";
import appRouter from "./routes/appRouter.js";

const app = express();
const port = process.env.NODE_ENV || 3000;

app.use(cors());
app.use("/images", express.static("media"));
app.use(appRouter);

const connect = async () => {
  await initDb();
  await initCart();
  app.listen(port, () => console.log("server in ascolto"));
};

connect();
