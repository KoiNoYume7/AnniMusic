@echo off
echo Setting up the AnniMusic project...

REM Navigate to the project directory
cd /d "%~dp0"

REM Create virtual environment if it doesn't exist
if not exist venv (
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install pipreqs
pipreqs . --force

pip install -r requirements.txt
spotdl -download--ffmpeg

echo Setup complete!
PPAUSE
echo starting the server...
uvicorn server.main:app --reload


PAUSE