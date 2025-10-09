import {exec, spawn, type ChildProcessWithoutNullStreams} from "child_process";
import type { IValidateURL } from "./types.js";

export function validateYTUrl(url: string): Promise<IValidateURL> {
  return new Promise((resolve, reject) => {
    exec(`yt-dlp --extractor-args "youtube:player_client=android" -j --skip-download ${url}`, (error, stdout, stderr) => {
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

export function convertToMp3(url: string): ChildProcessWithoutNullStreams {
  const args = [
    "--extractor-args",
   "youtube:player_client=android",
    "-x",
    "--audio-format",
    "mp3",
    "-o",
    "-",
    "--quiet", // no normal logs
    "--no-warnings", // suppress warnings
    "--no-progress", // disable progress bar
    url,
  ];

  return spawn("yt-dlp", args);
}
