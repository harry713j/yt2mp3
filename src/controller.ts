import type { Request, Response } from "express";
import {HttpStatus} from "./constants.js";
import { isValidUrl, normalizeYouTubeUrl } from "./utils.js";
import type { IValidateURL } from "./types.js";
import { convertToMp3, validateYTUrl } from "./services.js";

export async function handleDownload(req: Request,res: Response) {
  if (req.method !== "POST") {
    return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
      message: "This method is not allowed"
    })
  }

  try {
    const rawUrl = req.body?.url;

    if (!rawUrl || !isValidUrl(rawUrl)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Please provide valid url"
      })
    }

    const ytUrl = normalizeYouTubeUrl(rawUrl);

    let videoData: IValidateURL = await validateYTUrl(ytUrl);

    if (!videoData || !videoData.duration) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid Youtube video url"
      })
    }

    // got the video detils
    if (videoData.duration > 1200) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Video must be less than 20min"
      })
    }

    const ytdlp = convertToMp3(ytUrl);

    if (!ytdlp.stdout) {
     return res.status(HttpStatus.SERVER_ERROR).json({message: "Something went wrong!"})
    }

    const safeTitle = videoData.title.replace(/[^a-z0-9_\-]/gi, "_");
    // Need to change to express way
    res.status(HttpStatus.OK).set({
        "Content-Disposition": `attachment; filename="${safeTitle}.mp3"`,
        "Content-Type": "audio/mpeg",
        "Access-Control-Expose-Headers": "Content-Disposition",
    })


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
         return res.status(HttpStatus.SERVER_ERROR).json({
          message: "Conversion failed"
         })
        } else {
          // headers already sent → stop stream
          res.end();
        }
      }
    });

    // cleanup if client disconnects
    req.on("close", () => ytdlp.kill("SIGKILL"));
  } catch (err) {
    console.error("Server error: ", err);
    return res.status(HttpStatus.SERVER_ERROR).json({
      message: "Something went wrong! Valid YouTube Url expected"
    })
  }
}

export async function handleHealth(req: Request, res: Response) {
  if (req.method !== "GET") {
    return res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
      message: "This method is not allowed"
    })
  }
 try {
  return res.status(HttpStatus.OK).json({message: "Server is running good!"})
 } catch (error) {
  return res.status(HttpStatus.SERVER_ERROR).json({message: "Something went wrong! Server is not running"})
 }
}
