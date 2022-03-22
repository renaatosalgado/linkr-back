import express, { json } from "express";
import cors from "cors";
import router from "./routes/index.js";

express().use(cors());
express().use(json());

express().use(router);

const PORT = process.env.PORT || 5000;

express().listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
