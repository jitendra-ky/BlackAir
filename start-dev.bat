@echo off
echo Starting Resume Builder Development Environment
echo ===============================================

echo.
echo 1. Starting Django Backend Server...
cd /d "c:\Users\foryo\projects\resume_builder"

echo Installing CORS package if needed...
pip install django-cors-headers==4.6.0

echo.
echo Starting Django on http://localhost:8000
start "Django Backend" cmd /k "python manage.py runserver 8000"

echo.
echo Waiting 3 seconds for Django to start...
timeout /t 3 /nobreak > nul

echo.
echo 2. Starting React Frontend...
cd /d "c:\Users\foryo\projects\resume_builder\frontend"

echo Installing React dependencies if needed...
npm install

echo.
echo Starting React on http://localhost:3000
start "React Frontend" cmd /k "npm start"

echo.
echo ✅ Both servers are starting!
echo.
echo Django Backend: http://localhost:8000
echo React Frontend: http://localhost:3000
echo.
echo CORS is now configured to allow communication between them.
echo.
pause
