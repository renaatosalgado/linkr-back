import express, { json } from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

app.use(cors());
app.use(json());

const PORT = process.env.PORT || 5000;

express().listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
