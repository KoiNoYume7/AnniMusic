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
pip install -r requirements.txt

echo Setup complete!
PAUSE