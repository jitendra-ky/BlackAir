@echo off
echo Testing CORS Configuration...
echo =============================

cd /d "c:\Users\foryo\projects\resume_builder"

echo.
echo Starting Django server for CORS test...
start "Django Test" cmd /k "python manage.py runserver 8000"

echo.
echo Waiting for Django to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing CORS with curl (if available)...
curl -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: authorization,content-type" http://localhost:8000/api/auth/token/ -v

echo.
echo If you see "Access-Control-Allow-Origin: http://localhost:3000" in the response above, CORS is working!
echo.
pause
