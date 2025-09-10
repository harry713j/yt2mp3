import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "dotenv";
import statusCode from "./httpStatuscode.js";
import { loggingMiddleware, corsMiddleware } from "./middleware.js";

config();

const PORT = process.env.PORT;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  loggingMiddleware(req, res, () => {
    corsMiddleware(req, res, () => {
      switch (req.url) {
        case "/health":
          if (req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode.OK);
            res.end(JSON.stringify({ message: "Server is running good!" }));
            break;
          } else {
            res.writeHead(
              statusCode.METHOD_NOT_ALLOWED,
              "Method is not allowed for this end point",
            );
            res.end();
            break;
          }

        case "/convert":
          if (req.method === "POST") {
            // client will send the Youtube URL, download the video and then convert the video to Mp3 and send it to client's
          } else {
            res.writeHead(
              statusCode.METHOD_NOT_ALLOWED,
              "Method is not allowed for this end point",
            );
            res.end();
            break;
          }

        default:
          res.setHeader("Content-Type", "application/json");
          res.writeHead(statusCode.NOT_FOUND);
          res.end(JSON.stringify({ message: "Route Not found!" }));
          break;
      }
    });
  });
};

const server = createServer(requestListener);

export { server, PORT };
