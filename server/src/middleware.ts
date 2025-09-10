import type { IncomingMessage, ServerResponse } from "http";
import statusCode from "./httpStatuscode.js";
import { config } from "dotenv";

config();
const ALLOWED_CLIENT = process.env.ALLOWED_CLIENT;

function loggingMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  console.log(
    `Request Details - ${req.method} ${req.url} | Address: ${req.socket.remoteAddress} | ${new Date(Date.now()).toLocaleString()}`,
  );

  next();
}

function corsMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(statusCode.NO_CONTENT);
    res.end();
    return;
  }

  next();
}

export { loggingMiddleware, corsMiddleware };
