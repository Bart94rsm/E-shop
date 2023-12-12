import express from "express";
import { initDb, initCart, initUsers } from "./utils/operation.js";
import cors from "cors";
import appRouter from "./routes/appRouter.js";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Sostituisci con il tuo dominio frontend
  credentials: true, // Per consentire l'invio di cookie e credenziali
};

app.use(cors(corsOptions));
const port = process.env.NODE_ENV || 3000;

app.use("/images", express.static("media"));
app.use(appRouter);

const connect = async () => {
  await initDb();
  await initCart();
  await initUsers();
  app.listen(port, () => console.log("server in ascolto"));
};

connect();
