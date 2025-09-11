import { exec, spawn } from "child_process";
import type { IValidateURL } from "./types.js";
import type { Readable } from "stream";

export function validateYTUrl(url: string): Promise<IValidateURL> {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp -j --skip-download ${url}`, (error, stdout, stderr) => {
      if (error) return reject(new Error("Invalid or inaccessible video url"));

      try {
        const data = JSON.parse(stdout);

        resolve({
          id: data.id,
          title: data.title,
          duration: data.duration,
          ext: data.ext,
        });
      } catch (err) {
        reject(
          new Error(
            "Could not parse video metadata " +
              (err as Error).message +
              "\nstderr: " +
              stderr,
          ),
        );
      }
    });
  });
}

export function convertToMp3(url: string): Promise<Readable> {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);
    const ffmpeg = spawn("ffmpeg", [
      "-i", // input flag
      "pipe:0", // input from yt-dlp
      "-vn", // no video
      "-ar",
      "44100", // sample rate
      "-ac",
      "2", // stereo
      "-b:a",
      "192k", // bitrate
      "-f",
      "mp3", // output format
      "pipe:1", // output to stdout
    ]);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    ffmpeg.once("spawn", () => resolve(ffmpeg.stdout));
    ffmpeg.once("error", reject);
    ytdlp.once("error", reject);
  });
}
