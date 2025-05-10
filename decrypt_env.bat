@echo off
echo Decrypting .env.ncrypt with ncrypt...

:: Set path to ncrypt (update this to match your setup)
set NCRYPT_PATH=E:\MyFolder_\^Main\Tools\ncrypt\target\release\ncrypt.exe

:: Set input/output based on current folder
set INPUT_FILE=%CD%\.env.ncrypt
set OUTPUT_FILE=%CD%\.env

:: Decrypt
"%NCRYPT_PATH%" decrypt -i "%INPUT_FILE%" -o "%OUTPUT_FILE%"

echo Decrypted file restored at: %OUTPUT_FILE%
pause
