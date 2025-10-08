import type { IncomingMessage, ServerResponse } from "http";
import statusCode from "./httpStatuscode.js";
import { config } from "dotenv";

config();
const ALLOWED_CLIENT = process.env.ALLOWED_CLIENT;

function logging(req: IncomingMessage, res: ServerResponse, next: () => void) {
  console.log(
    `Request Details - ${req.method} ${req.url} | Address: ${req.socket.remoteAddress} | ${new Date(Date.now()).toLocaleString()}`,
  );

  next();
}

function cors(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const origin = req.headers.origin; // browser sends this

  if (origin && ALLOWED_CLIENT && origin === ALLOWED_CLIENT) {
    res.setHeader("Access-Control-Allow-Origin", origin); // allow only this one
  } else {
    res.setHeader("Access-Control-Allow-Origin", "null");
  }
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(statusCode.NO_CONTENT);
    res.end();
    return;
  }

  next();
}

function bodyParser(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const chunks: Buffer[] = [];

  req.on("data", (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    const body = Buffer.concat(chunks).toString();
    // if body is empty
    if (!body) {
      (req as any).body = {};
      next();
      return;
    }

    const contentType = req.headers["content-type"] as string;

    if (contentType && contentType.startsWith("application/json")) {
      // parse the json
      try {
        (req as any).body = JSON.parse(body);
      } catch (err) {
        res.writeHead(statusCode.BAD_REQUEST, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Invalid JSON" }));
        return;
      }
    } else {
      (req as any).body = body;
    }

    next();
  });
}

export { logging, cors, bodyParser };
