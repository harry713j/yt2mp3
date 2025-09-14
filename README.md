# 🎵 YT2Mp3
> Converts YouTube video to Mp3.


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)

A simple Node.js + TypeScript application that converts YouTube videos into MP3 audio files.
It uses [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) under the hood to fetch and extract audio, and streams the result directly to the client without storing large intermediate files.

---

## ✨ Features
- 🚀 Fast conversion from YouTube to MP3
- 📡 Streams audio directly to the browser (no temp files)
- 🛡️ Validates video duration (only allows videos under 20 minutes)
- ⚠️ Returns clear error responses if conversion fails
- 🎧 Outputs high-quality MP3 audio

---

## 🛠️ Tech Stack
- **Backend:** Node.js, TypeScript
- **Downloader:** [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- **Transcoding:** Built-in `ffmpeg` via yt-dlp
- **Frontend:** React + Tailwind

---

## 📦 Installation

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (>=18)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [ffmpeg](https://ffmpeg.org/)

Clone this repo:

```bash
git clone https://github.com/harry713j/yt2mp3.git
```

Install dependencies:

```bash
cd server
npm install
# and
cd client
npm install
```

## 🚀 Usage
Start the development server:
```bash
cd server
npm run dev
# and
cd client
npm run dev
```

Send a POST request with a YouTube URL:

```bash
curl -X POST http://localhost:4000/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' \
  --output song.mp3
```

Or use the frontend (React client) to paste a YouTube link and download the MP3.
