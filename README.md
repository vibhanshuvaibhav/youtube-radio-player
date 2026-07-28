# Radio Room

Radio Room is a free, local-first YouTube radio player. Make a station from a mood and a few filters, search YouTube in a new tab, then paste the video links you want to play.

There is no account, database, backend, paid API, or AI API key. Your queue, recent listening history, likes, dislikes, and selected station are stored in the browser on the device you use.

## What it does

- Plays YouTube videos in a simple radio-style queue.
- Accepts standard YouTube, `youtu.be`, Shorts, and live-video links.
- Lets you pause, skip, remove, and reorder tracks.
- Creates a local station guide from a description, mood, genre, and language filters.
- Opens a YouTube search based on that guide in a new tab—no YouTube Data API key is needed.
- Persists your local listening state between browser sessions.

## Run locally

You need [Node.js](https://nodejs.org/) (which includes npm) version 20.19 or newer. The current project setup also supports Node 22.12+ and your installed Node 26.

```bash
git clone https://github.com/vibhanshuvaibhav/youtube-radio-player.git
cd youtube-radio-player
npm install
npm start
```

The development server opens at [http://localhost:5173](http://localhost:5173). If it does not open automatically, visit that address in your browser.

To create a production build:

```bash
npm run build
```

The compiled static site is placed in `dist/`. It can be deployed to any static host, including GitHub Pages.

To preview that production build locally:

```bash
npm run preview
```

## How to use it

1. In **Make this hour sound right**, describe the mood you want, or choose the mood, sound, and language chips.
2. Select **Search on YouTube**. This opens a YouTube search in a new tab using your local station guide.
3. Copy a video URL from YouTube.
4. Return to Radio Room, paste the URL in **Add a YouTube video**, optionally give it a label, and select **Add to queue**.
5. Use the queue controls to move a track up/down or remove it. The top item is the track currently playing.
6. Use the heart and “less like this” controls to keep local preferences for the current browser.

## Privacy and limitations

- Radio Room does not send your queue or preferences to an app server.
- YouTube is responsible for video playback and may show its own controls, notices, availability restrictions, or advertisements.
- Without the YouTube Data API, the app cannot search YouTube inside the interface or automatically retrieve a video title, artist, duration, or channel. The optional label is therefore useful.
- Browser storage is device- and browser-specific. Clearing site data clears the queue, history, and preferences.

## Future direction

The next optional upgrade is YouTube Data API search and metadata. It should remain behind a restricted key and preserve the current paste-a-link flow as a fallback.
