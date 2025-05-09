# 🎵 AnniMusic
>Work in progress...

<img src="web/assets/^AnniMusic.png" alt="AnniMusic Logo" width="1000" style="border: 2px solid #444; border-radius: 10px; padding: 4px;">

Welcome to **AnniMusic** – a self-hosted, Spotify-synced music vault made for true music lovers who are sick of losing their favorite tracks to licensing black holes. AnniMusic is your own private music webapp, built to sync your Spotify favorites and download them locally — strictly for personal use only.

---

## 💡 What It Does

* 🔁 **Real-Time Sync**: Syncs your liked songs and playlists using the Spotify API.
* 🖼️ **Playlist Grid UI**: Displays your liked songs and playlists in a slick visual grid — including cover images!
* 🔙 **Back Button Support**: Full browser navigation between pages (playlist view ↔ playlist grid).
* 🎶 **Local Downloads**: Downloads songs using `spotDL` and stores them locally on your private server.
* 📆 **Metadata-Rich Library**: Keeps track of full song metadata (artist, album art, duration, etc.) for rich playback experience.
* 🔹 **Playback Control**: Handles play, pause, skip, etc. – either through Spotify or your own interface.
* 📉 **Desync Prevention** *(coming soon)*: Will track song progress to avoid playback misalignment between Spotify and your local player.
* 📁 **Offline Listening**: Download songs from your private server to your phone for offline access.
* 🌿 **Custom Tags & Sorting**: Add your own tags to organize songs by mood, vibe, or absolute banger level.
* 📊 **Custom Wrapped**: Create your own "Spotify Wrapped" with way more detail and full control.
* 🔒 **Private & Secure**: No user data shared. Hosted by you, for you.

---

## 🚀 Who It's For

- People who want to **preserve their favorite songs**, even if Spotify removes them.
- Techies who are fine hosting a private server on their **PC, laptop, or Raspberry Pi**.
- Users who want a **custom, open-ish** music experience without losing Spotify benefits.
- Friends who want to **run their own copies** of the software (you host your own = no copyright drama).

---

## ⚠️ Legal Disclaimer

AnniMusic is for **personal use only**. You are responsible for ensuring your use complies with local laws and Spotify’s terms of service. No music is shared publicly or between users. The tool does not bypass DRM or distribute copyrighted material.

---

## 🧰 Planned Stack (Subject to Change)

- **Backend**: Python (FastAPI or Flask)
- **Sync & Logic**: spotDL, yt-dlp, Spotify Web API
- **Frontend**: HTML + JS (React or vanilla JS for MVP)
- **Server**: Localhost or LAN-accessible with optional VPN

---
### Project structure
```
AnniMusic
│   .env
│   .env.ncrypt
│   .gitignore
│   LICENSE
│   projectstruct.txt
│   README.md
│   requirements.txt
│   setup.bat
│   
├───server
│       downloader.py
│       main.py
│       playback_tracker.py
│       spotfiy_sync.py
│       utils.py
│
└───web
    │   index.html
    │   player.js
    │   script.js
    │   spotify.js
    │   state.js
    │   style.css
    │   ui.js
    │   utils.js
    │
    └───pictures
            ^AnniMusic.png
```


## 🔧 Features To-Do

* [x] Spotify Sync Script (likes, playlists, artists)
* \[-] Playback Tracking System
* [x] spotDL Integration with Sync Logic
* [x] Web Player UI
* [x] Playlist Grid & Cover Images
* [x] Browser Navigation Support
* [ ] Local Download to Mobile Support
* \[-] Metadata Reader & Tagging System
* [ ] Custom Spotify Wrapped Clone
* [ ] Server Config/Settings UI
* [ ] Optional Auth (TBD)
* [ ] Full Customization Panel
* [x] Documentation (YEAHHH)


---

---

## 👾 How to Use

1. Clone this repo
2. Set up your Spotify API keys
3. Run the server on your machine
4. Sync your liked songs via `server/spotify_sync.py`
5. Visit `http://127.0.0.1:8000` to start jamming
6. Profit *(emotionally, not financially)*

---

### 🔥 Credits
>.env file is now included for convenience while developing, but encrypted thanks to [@SpizzyCoder](https://github.com/SpizzyCoder) with his [ncrypt](https://github.com/SpizzyCoder/ncrypt) Project!

---

### Final Words
Made with caffeine, passion, and a sprinkle of frustration at Spotify.
**Name origin: "AnniMusic" – because Anni deserves good music too. ^^**
