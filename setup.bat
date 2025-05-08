@echo off
echo This script sets up a Python virtual environment and installs the required packages for the Spotify API project.

cd AnniMusic

echo creating a virtual environment if it doesn't already exist
if not exist venv (
    python -m venv venv
)

echo activating the virtual environment
call venv\Scripts\activate.bat

echo installing the required Python packages...
pip install pipreqs
pipreqs . --force
pip install -r requirements.txt
pip install fastapi uvicorn python-dotenv requests spotipy

echo Setup complete. Virtual environment is ready, and required packages are installed.

PAUSE

uvicorn server:app --reload