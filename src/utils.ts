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

    // youtube.com/shorts form
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      return `https://www.youtube.com/watch?v=${id}`;
    }

    // youtube.com, youtube-nocookie.com, m.youtube.com
    if (
      u.hostname.includes("youtube.com") ||
      u.hostname.includes("youtube-nocookie.com")
    ) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    }


    return url; // fallback
  } catch {
    return url; // not even a valid URL
  }
}
