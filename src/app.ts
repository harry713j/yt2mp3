import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import { logging } from "./middleware.js";
import { handleDownload, handleHealth } from "./controller.js";

config();

const PORT = process.env.PORT;
const whitelists = process.env.ALLOWED_CLIENT?.split(",") || [];

const app = express();

app.use(json({}))
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelists.includes(origin)){
          callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
  })
);
app.use(logging);

app.get("/health", handleHealth)
app.post("/convert", handleDownload)

export { app, PORT };
