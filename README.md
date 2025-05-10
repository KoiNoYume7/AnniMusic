# 🎵 AnniMusic 🎵
> Work in progress... but already kinda awesome tbh ^^

<img src="web/assets/^AnniMusic.png" alt="AnniMusic Logo" width="1000" style="border: 2px solid #444; border-radius: 10px; padding: 4px;">

### Welcome to **AnniMusic** – a self-hosted, Spotify-synced music vault built for music lovers who are tired of licensing wipes and vanishing favorites.  
AnniMusic lets you sync, download, and keep your collection forever — right on your own device.

## 💡 What It Does (Now)

- 🔁 **Spotify Sync**: Liked songs & playlists via Spotify API on app startup.
- 🖼️ **Playlist Grid UI**: Beautiful grid with cover art and track counts.
- 🔙 **Back Button Navigation**: Full browser history support.
- 🎶 **spotDL Integration**: Automatic `spotDL` downloads with real-time feedback.
- 🧠 **Status Polling**: Background validation every 2 seconds.
- ✅ **Live Status Tags**: `"queued"` → `"downloading"` → `"validating"` → `"downloaded"` (or `"failed"`).
- 🔊 **Stream-Only Fallback**: Songs with a Spotify URL but no local download can still play.
- 📦 **Metadata Support**: Shows title, artist, album, date added, and duration.
- 🛠️ **Metadata Editor**: Per-track editable tags + rating via JSON backend.
- 🕹️ **Custom Audio Player**: Includes hover play buttons and a main control.
- 📶 **Server Status Watchdog**: Alerts user when backend is offline.
- ⚙️ **Spotify Sync Toggle**: Turn syncing on/off directly in UI.
- 🔒 **Encrypted .env**: Protect your Spotify API keys using `ncrypt`.



## 🧠 Who It’s For

- Anyone tired of losing access to songs they loved.
- Devs who want a *Spotify-to-local* self-hosted vault.
- Music hoarders and local library lovers.
- People who say: “If Spotify deletes it, I still got it.”

## ⚠️ Legal Notice

**AnniMusic is for PERSONAL use only.**  
No file sharing. No DRM bypassing.  
You are fully responsible for following Spotify’s terms and your local copyright laws.


## 🧰 Tech Stack

| Layer     | Tools                                       |
|-----------|---------------------------------------------|
| Backend   | Python, FastAPI, `spotDL`, threading        |
| Frontend  | HTML, CSS, Vanilla JS                       |
| Sync/API  | Spotify Web API, dotenv, Spotipy            |
| Storage   | JSON metadata, `.mp3` file downloads        |
| Dev Tools | Live reload, local-only development         |



## 📁 Project Structure


```
AnniMusic/
│   .cache-annimusic
│   .env / .env.ncrypt
│   .gitignore
│   LICENSE
│   ProjectStruct.md
│   README.md
│   setup.bat / decrypt_env.bat
│
├── server/
│   ├── main.py                  # FastAPI entry + sync on startup
│   ├── core/
│   │   └── shared.py            # Shared resources (e.g., queues)
│   ├── data/
│   │   ├── downloads/           # .mp3 files + .finished markers
│   │   └── metadata/            # liked_tracks.json, playlists.json, status.json
│   ├── logic/
│   │   ├── spotify_sync.py      # Spotify sync logic
│   │   ├── spotify_tools.py     # Auth & client
│   │   ├── status_handler.py    # Track status logic
│   │   └── file_utils.py        # Placeholder for future expansion
│   ├── routes/
│   │   ├── playlists.py         # Playlist routes
│   │   ├── songs.py             # Songs, metadata edit, download logic
│   │   ├── spotify.py           # Token endpoint
│   │   └── status_routes.py     # Status polling + validation
│   └── worker/
│       └── downloader_thread.py # Threaded spotDL downloader
│
└── web/
    ├── index.html
    ├── style.css
    ├── main.js
    ├── assets/
    │   └── [images and logos]
    ├── api/
    │   ├── getPlaylist.js
    │   ├── fetchStatus.js
    │   └── downloadSongs.js
    ├── state/
    │   ├── store.js             # Spotify sync toggle state
    │   └── connection.js        # Online status watchdog
    ├── ui/
    │   ├── playerUI.js
    │   ├── rendererPlaylistGrid.js
    │   └── rendererSongRow.js
    └── utils/
        └── formatter.js         # Date/duration formatting
```

## ✅ Features Done

- Spotify Liked Songs + Playlist Sync
- spotDL Integration
- JSON Metadata System
- Playlist Grid with Covers
- Liked Song List Renderer
- Live Status Polling + Visuals
- Multi-State Download Queue
- Stream Fallback System
- Web Audio Player
- Download-All Button
- Metadata Editor (rating, tags)
- Offline Server Warning
- `.env` Encryption via `ncrypt`

## 🔧 Features Coming Soon

- Mobile-friendly local download options
- Seekbar + Playback Timeline
- Track Ratings / Personal Tag Filters
- Custom Spotify Wrapped Generator
- Server Config Dashboard
- Auth / Password Protection
- Full Theming / UI Skins
- Real-Time Sync (without refresh)
- Jam?

## 👾 How to Use

```bash
git clone https://github.com/your-username/AnniMusic
cd AnniMusic
```

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com).
2. Log in and create an app.
3. Name it (e.g. "AnniMusic"), optionally add description.
4. Add `http://127.0.0.1:8888/callback` to Redirect URIs.
5. Select "Web API" and "Web Playback SDK".
6. Accept terms and save.
7. In your AnniMusic folder, create a file named `.env`.
8. Add the following to it:

```env
SPOTIPY_CLIENT_ID=your_client_id_here
SPOTIPY_CLIENT_SECRET=your_client_secret_here
SPOTIPY_REDIRECT_URI=http://127.0.0.1:8888/callback
```

9. dont forget to save, it belongs to the project root folder (AnniMusic)
10. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

11. Run the backend:

```bash
uvicorn server.main:app --reload
```

12. Visit `http://127.0.0.1:8000` in your browser.
13. Start syncing, downloading, and jamming I guess



### 🔥 Credits
>.env file is now included for convenience while developing, but encrypted thanks to [@SpizzyCoder](https://github.com/SpizzyCoder) with his [ncrypt](https://github.com/SpizzyCoder/ncrypt) Project!

## Final Words
Built by someone who was sick of Spotify saying
 *“This track is no longer available in your country.”*

💿 Keep your music.
🧠 Own your experience.

>And yes, **"AnniMusic"** because Anni deserves good music too!
