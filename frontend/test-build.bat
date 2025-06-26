@echo off
echo Testing Tailwind CSS Configuration...
echo ===================================

cd /d "c:\Users\foryo\projects\resume_builder\frontend"

echo.
echo Checking installed packages...
npm list tailwindcss autoprefixer postcss

echo.
echo Attempting to build...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Build completed successfully.
    echo Configuration is working properly.
    echo.
    echo You can now run: npm start
) else (
    echo.
    echo ❌ Build failed. Please check the errors above.
)

echo.
pause
