# 🎵 AnniMusic
>Work in progress... hopefully not for long anymore ^^

<img src="web/assets/^AnniMusic.png" alt="AnniMusic Logo" width="1000" style="border: 2px solid #444; border-radius: 10px; padding: 4px;">

### Welcome to **AnniMusic** – a self-hosted, Spotify-synced music vault built for music lovers who are tired of licensing wipes and vanishing favorites.  
AnniMusic lets you sync, download, and keep your collection forever — right on your own device.

## 💡 What It Does (And Already Does)

- 🔁 **Real-Time Sync**: Syncs liked songs and playlists via the Spotify API.
- 🖼️ **Playlist Grid UI**: Clean grid layout with playlist covers.
- 🔙 **Back Button Support**: Browser navigation works like a real app (playlist ↔ main).
- 🎶 **Local Downloads**: Downloads songs with `spotDL`, stored locally on your system.
- 🧠 **Smart Status Polling**: 1-second polling keeps status updates accurate in real time.
- ✅ **Live Download Status**: See songs flip from `"queued"` → `"downloading"` → `"downloaded"` (or `"failed"`).
- 🔊 **Stream-Only Fallback**: Songs you can’t download are still playable if they have a Spotify link.
- 📦 **Metadata-Rich UI**: Displays title, artist, album, added date, duration, and cover art.
- 🕹️ **Custom Web Player**: Play songs directly from your own UI.
- 🛠️ **spotDL Integration**: Seamless queue-based downloads behind the scenes.
- 🔒 **Private & Secure**: Nothing gets shared, tracked, or uploaded. You own it all.


## 🚀 Who It's For

- People who want to **preserve** songs removed from Spotify.
- Devs who want a **custom, self-hosted** music interface.
- Users who are tired of DRM-based rental models and want **local playback**.
- Everyone who has ever shouted “WHERE DID MY SONG GO?” and meant it.

## ⚠️ Legal Disclaimer

AnniMusic is for **personal use only**.  
You are responsible for following Spotify’s terms of service and local copyright laws.  
This tool does **not** bypass DRM and does **not** share any files between users.

## 🧰 Tech Stack

| Layer    | Tools                               |
|----------|-------------------------------------|
| Backend  | Python, FastAPI, subprocess, spotDL |
| Frontend | Vanilla JS, HTML, CSS               |
| Sync     | Spotify Web API, spotDL, threading  |
| Storage  | JSON-based metadata, local file system |
| Deployment | Localhost / self-hosted (PC, Pi, VPS) |


## 📁 Project Structure


```
AnniMusic
|   .cache-annimusic
|   .env
|   .env.ncrypt
|   .gitignore
|   LICENSE
|   ProjectStruct.txt
|   README.md
|   requirements.txt
|   setup.bat
|
+---data
|   +---downloads
|   |       <--- your downloaded spotify songs go here in .mp3 format <---
|   |
|   \---metadata
|           liked_tracks.json
|           playlists.json
|           status.json
|
+---server
|       downloader.py
|       main.py
|       playback_tracker.py
|       spotify_sync.py
|       utils.py
|
\---web
    |   index.html
    |   player.js
    |   script.js
    |   spotify.js
    |   state.js
    |   style.css
    |   ui.js
    |   utils.js
    |
    \---assets
            AnniMusic-LikedSongs.png
            ^AnniMusic.png
```


## ✅ Features Done

- [ x ] Spotify Sync Script (likes, playlists)
- [ x ] spotDL Integration
- [ x ] Real-Time Polling + UI Status Updates
- [ x ] Web Player UI
- [ x ] Playlist Grid + Cover Display
- [ x ] Browser Navigation (History API)
- [ x ] `stream-only` fallback
- [ x ] Status Validator & Self-Healing JSON
- [ x ] Download Queue & Threaded SpotDL

## 🔧 Features Coming Soon

- [ ] Local Download to Mobile Support
- [ ] Playback Tracker & Seek Bar
- [ ] Metadata Tag Editor & Ratings
- [ ] Custom Spotify Wrapped Generator
- [ ] Server Config/Settings Panel
- [ ] Optional Auth
- [ ] Full UI Customization

## 👾 How to Use

1. Clone this repo
2. Set up your Spotify API keys in `.env`
3. Run the backend with: ```uvicorn server.main:app --reload ```
4. Visit ```http://127.0.0.1:8000```
5. Start syncing, downloading, and jamming
6. Modify to your heart's content — it's your music, your rules.


### 🔥 Credits
>.env file is now included for convenience while developing, but encrypted thanks to [@SpizzyCoder](https://github.com/SpizzyCoder) with his [ncrypt](https://github.com/SpizzyCoder/ncrypt) Project!

## Final Words
Built by someone who was sick of Spotify saying
 *“This track is no longer available in your country.”*

💿 Keep your music.
🧠 Own your experience.

>And yes, **"AnniMusic"** because Anni deserves good music too!
