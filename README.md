# ◉ Radio Room

> Say good-bye to old-fashioned playlists and say hi! to vibe listening.

**Radio Room** is a free, local-first YouTube radio player. Queue songs based on your vibe as they come to your mind and let them play automatically.

No account, database, backend server, or mandatory API keys required. Your queue, listening history, likes, dislikes, and selected station vibes are stored securely in your browser's local storage.

---

## ✨ Features

- **♫ Smart In-App YouTube Search**: Search any song, artist, or album directly inside the application without leaving the app.
- **⚡ 1-Click & Drag-and-Drop Queueing**: Click `+ Queue` to append a track, `▶ Play Next` to insert it after the current song, or drag & drop search result cards directly into the Queue panel.
- **📻 Radio-Style Queue & Auto-Stop**: Plays tracks sequentially starting from the top item. Automatically moves finished tracks to history and stops smoothly when the queue exhausts.
- **🎯 Vibe & Mood Filters**: Click station vibe chips (`Focus`, `Chill`, `Energy`, `Indie`, `Pop`, `Bollywood`, `Jazz`) for instant curated search results.
- **📱 Fully Responsive**: Optimized for desktop monitors, laptops, tablets, and mobile smartphones with touch-friendly controls.
- **⚙ Flexible Search Providers**: Uses free public search instances out of the box, with an optional setting to supply your own official YouTube Data API v3 key.
- **💾 Local State Persistence**: Keeps your local queue, history, and preferences saved between browser sessions via `redux-persist`.

---

## 🚀 Quick Start (Run Locally)

### Requirements
- [Node.js](https://nodejs.org/) version `20.19` or newer (supports Node 20, 22, and 26).

```bash
# Clone the repository
git clone https://github.com/vibhanshuvaibhav/youtube-radio-player.git
cd youtube-radio-player

# Install dependencies
npm install

# Start development server
npm start
```

The app will open automatically at **[http://localhost:5173](http://localhost:5173)**.

---

## 🛠 Build & Preview

To create a production-ready build:

```bash
npm run build
```

The compiled static site will be output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploy to GitHub Pages (2 Simple Steps)

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Step 1: Enable GitHub Pages in your Repository
1. Go to your repository on GitHub: `https://github.com/vibhanshuvaibhav/youtube-radio-player`
2. Click **Settings** (top navigation tab).
3. On the left sidebar under *Code and automation*, click **Pages**.
4. Under **Build and deployment** -> **Source**, select **GitHub Actions**.

### Step 2: Push your Code to GitHub
Whenever you push your code to `master` (or `main`), the deployment workflow will trigger automatically and build & host your app:

```bash
git add .
git commit -m "Deploy Radio Room"
git push origin master
```

Once completed, your site will be live at:  
**`https://vibhanshuvaibhav.github.io/youtube-radio-player/`**

---

## 🔒 Privacy & Local Storage

- **No Remote Telemetry**: Radio Room does not upload your queue or listening history to any third-party app server.
- **YouTube Embeds**: YouTube is responsible for video playback via iframe embeds.
- **Device-Specific**: Data is stored locally in your browser (`localStorage`). Clearing site data resets your queue and history.

---

## 📄 License

MIT License. Free for personal and commercial use.
