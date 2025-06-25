@echo off
echo Building Resume Builder Frontend for production...
cd /d "c:\Users\foryo\projects\resume_builder\frontend"
echo Installing dependencies...
call npm install
echo.
echo Building application...
call npm run build
echo.
echo Build complete! Files are in the 'build' folder.
pause
