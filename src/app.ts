import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import { logging } from "./middleware.js";
import { handleDownload, handleHealth } from "./controller.js";

config();

const PORT = process.env.PORT;
const ALLOWED_CLIENT = process.env.ALLOWED_CLIENT;

const app = express();

app.use(json({}))
app.use(
  cors({
    origin: ALLOWED_CLIENT,
  })
);
app.use(logging);

app.get("/health", handleHealth)
app.post("/convert", handleDownload)

export { app, PORT };
