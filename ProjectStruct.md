📂 **AnniMusic Project Structure**

├── 📁 **server**
│   ├── 📄 `main.py` _(FastAPI server initialization)_
│   ├── 📁 **core**
│   │   └── 📄 `shared.py` _(shared resources)_
│   ├── 📁 **routes**
│   │   ├── 📄 `songs.py` _(song endpoints)_
│   │   ├── 📄 `playlists.py` _(playlist endpoints)_
│   │   ├── 📄 `spotify.py` _(Spotify token endpoint)_
│   │   └── 📄 `status_routes.py` _(status checking endpoints)_
│   ├── 📁 **logic**
│   │   ├── 📄 `spotify_tools.py` _(Spotify API interactions)_
│   │   ├── 📄 `spotify_sync.py` _(Spotify data synchronization)_
│   │   ├── 📄 `status_handler.py` _(status and queue management)_
│   │   └── 📄 `file_utils.py` _(placeholder for future file utilities)_
│   ├── 📁 **worker**
│   │   └── 📄 `downloader_thread.py` _(background download worker)_
│   └── 📁 **data**
│       ├── 📁 **metadata** _(stores playlists and track metadata)_
│       └── 📁 **downloads** _(stores downloaded audio files)_

├── 📁 **web**
│   ├── 📄 `index.html`
│   ├── 📄 `main.js`
│   ├── 📄 `style.css`
│   ├── 📁 **api**
│   │   ├── 📄 `getPlaylist.js`
│   │   ├── 📄 `fetchStatus.js`
│   │   └── 📄 `downloadSongs.js`
│   ├── 📁 **state**
│   │   ├── 📄 `store.js`
│   │   └── 📄 `connection.js`
│   ├── 📁 **ui**
│   │   ├── 📄 `playerUI.js`
│   │   ├── 📄 `rendererPlaylistGrid.js`
│   │   └── 📄 `rendererSongRow.js`
│   ├── 📁 **utils**
│   │   └── 📄 `formatter.js`
│   └── 📁 **assets**
│       ├── 📄 `AnniMusic-LikedSongs.png`
│       └── 📄 `^AnniMusic.png`

├── 📄 `.env` _(environment variables)_
├── 📄 `.cache-annimusic` _(cached credentials for Spotify API)_
├── 📄 `setup.bat` _(environment setup script)_
├── 📄 `decrypt_env.bat` _(environment decryption script)_
├── 📄 `LICENSE`
└── 📄 `README.md`
