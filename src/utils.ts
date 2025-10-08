import { URL } from "url";

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export function normalizeYouTubeUrl(url: string): string {
  try {
    const u = new URL(url);
    // youtu.be short form
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/watch?v=${id}`;
    }

    // youtube.com form → just keep ?v= param
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    }

    return url; // fallback
  } catch {
    return url; // not even a valid URL
  }
}
