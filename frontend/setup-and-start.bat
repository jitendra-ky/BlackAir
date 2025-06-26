@echo off
echo ==================================================
echo        Resume Builder Frontend Setup
echo ==================================================
echo.

cd /d "c:\Users\foryo\projects\resume_builder\frontend"

echo Checking Node.js version...
node --version
echo.

echo Checking npm version...
npm --version
echo.

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.

echo Starting development server...
echo The app will open in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
