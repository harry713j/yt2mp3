import type { IncomingMessage, ServerResponse } from "http";
import { respondWithError, respondWithJSON } from "./responder.js";
import statusCode from "./httpStatuscode.js";
import { isValidUrl, normalizeYouTubeUrl } from "./utils.js";
import type { IValidateURL } from "./types.js";
import { convertToMp3, validateYTUrl } from "./services.js";

export async function handleDownload(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method !== "POST") {
    respondWithError(
      res,
      statusCode.METHOD_NOT_ALLOWED,
      "Method is not allowed for this end point",
    );
    return;
  }

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

    const ytdlp = convertToMp3(ytUrl);

    if (!ytdlp.stdout) {
      respondWithError(res, statusCode.SERVER_ERROR, "Something went wrong!");
      return;
    }

    const safeTitle = videoData.title.replace(/[^a-z0-9_\-]/gi, "_");
    res.writeHead(statusCode.OK, {
      "Content-Disposition": `attachment; filename=${safeTitle}.mp3`,
      "Content-Type": "audio/mpeg",
      "Access-Control-Expose-Headers": "Content-Disposition",
    });

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (data) => {
      console.error("[yt-dlp]", data.toString());
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        // 0 means successful
        console.error(`yt-dlp exited with ${code}`);
        if (!res.headersSent) {
          // still safe to send JSON error
          respondWithError(res, statusCode.SERVER_ERROR, "Conversion failed");
          return;
        } else {
          // headers already sent → stop stream
          res.end();
        }
      }
    });

    // cleanup if client disconnects
    req.on("close", () => ytdlp.kill("SIGKILL"));
  } catch (err) {
    respondWithError(
      res,
      statusCode.SERVER_ERROR,
      "Something went wrong! valid Youtube Url expected",
    );
    console.error("Server error: ", err);
    return;
  }
}

export async function handleHealth(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    respondWithError(
      res,
      statusCode.METHOD_NOT_ALLOWED,
      "Method is not allowed for this end point",
    );
    return;
  }

  respondWithJSON(res, statusCode.OK, {
    message: "Server is running good!",
  });
  return;
}
