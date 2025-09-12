import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "dotenv";
import statusCode from "./httpStatuscode.js";
import { loggingMiddleware, corsMiddleware, bodyParser } from "./middleware.js";
import { respondWithError, respondWithJSON } from "./responder.js";
import { handleDownload, handleHealth } from "./controller.js";

config();

const PORT = process.env.PORT;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  loggingMiddleware(req, res, () => {
    corsMiddleware(req, res, () => {
      bodyParser(req, res, () => {
        switch (req.url) {
          case "/health":
            handleHealth(req, res);
            break;
          case "/convert":
            handleDownload(req, res);
            break;
          default:
            respondWithJSON(res, statusCode.NOT_FOUND, {
              message: "Route Not found!",
            });
            break;
        }
      });
    });
  });
};

const server = createServer(requestListener);

export { server, PORT };
