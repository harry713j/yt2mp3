import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "dotenv";
import statusCode from "./httpStatuscode.js";
import { loggingMiddleware, corsMiddleware, bodyParser } from "./middleware.js";
import { respondWithError, respondWithJSON } from "./responder.js";
import { handleDownload } from "./controller.js";

config();

const PORT = process.env.PORT;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  loggingMiddleware(req, res, () => {
    corsMiddleware(req, res, () => {
      bodyParser(req, res, () => {
        switch (req.url) {
          case "/health":
            if (req.method === "GET") {
              respondWithJSON(res, statusCode.OK, {
                message: "Server is running good!",
              });
              break;
            } else {
              respondWithError(
                res,
                statusCode.METHOD_NOT_ALLOWED,
                "Method is not allowed for this end point",
              );
              break;
            }
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
