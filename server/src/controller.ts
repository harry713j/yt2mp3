import type { IncomingMessage, ServerResponse } from "http";
import { respondWithError } from "./responder.js";
import statusCode from "./httpStatuscode.js";
import { isValidUrl, normalizeYouTubeUrl } from "./utils.js";
import type { IValidateURL } from "./types.js";
import { convertToMp3, validateYTUrl } from "./services.js";

export async function handleDownload(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method === "POST") {
    // client will send the Youtube URL,
    // download the video and then convert the video to Mp3 and send it to client's
    try {
      const rawUrl = (req as any).body.url;

      if (!rawUrl || !isValidUrl(rawUrl)) {
        respondWithError(
          res,
          statusCode.BAD_REQUEST,
          "Please provide a valid Url",
        );
        return;
      }

      const ytUrl = normalizeYouTubeUrl(rawUrl);

      let videoData: IValidateURL = await validateYTUrl(ytUrl);

      if (!videoData || !videoData.duration) {
        respondWithError(res, statusCode.BAD_REQUEST, "Invalid YouTube video");
        return;
      }

      // got the video detils
      if (videoData.duration > 1200) {
        respondWithError(
          res,
          statusCode.BAD_REQUEST,
          "Video should be less than 20min",
        );
        return;
      }

      const stream = await convertToMp3(ytUrl);

      const safeTitle = videoData.title.replace(/[^a-z0-9_\-]/gi, "_");
      res.writeHead(statusCode.OK, {
        "Content-Disposition": `attachment; filename=${safeTitle}.mp3`,
        "Content-Type": "audio/mpeg",
      });

      stream.pipe(res);
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          respondWithError(res, statusCode.SERVER_ERROR, "Conversion fail");
        }
      });
    } catch (err) {
      respondWithError(
        res,
        statusCode.SERVER_ERROR,
        "Something went wrong! valid Youtube Url expected",
      );
      console.error("Server error: ", err);
      return;
    }
  } else {
    respondWithError(
      res,
      statusCode.METHOD_NOT_ALLOWED,
      "Method is not allowed for this end point",
    );
    return;
  }
}
