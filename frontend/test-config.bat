@echo off
echo Testing React App Configuration...
echo ================================

cd /d "c:\Users\foryo\projects\resume_builder\frontend"

echo.
echo 1. Checking if all packages are installed...
npm ls tailwindcss autoprefixer postcss > nul 2>&1
if %errorlevel% neq 0 (
    echo Installing missing packages...
    npm install -D tailwindcss autoprefixer postcss
)

echo.
echo 2. Testing build process...
npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful! Configuration is working.
    echo.
    echo You can now run: npm start
) else (
    echo ❌ Build failed. Please check the error messages above.
)

echo.
pause
