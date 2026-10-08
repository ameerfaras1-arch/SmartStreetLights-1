@echo off
title Push Smart Street Light System to GitHub
color 0a
echo =====================================================================
echo    PUSHING SMART STREET LIGHT SYSTEM TO GITHUB
echo    Target: https://github.com/ameerfaras1-arch/SmartStreetLights-1.git
echo =====================================================================
echo.

set PATH=C:\Users\ameer\AppData\Local\Programs\Git\cmd;%PATH%

git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =====================================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Check your repository at:
    echo https://github.com/ameerfaras1-arch/SmartStreetLights-1
    echo =====================================================================
) else (
    echo.
    echo =====================================================================
    echo [AUTHENTICATION NOTICE]
    echo GitHub requires authentication to push to your repository:
    echo 1. If prompted for Username, enter: ameerfaras1-arch
    echo 2. If prompted for Password, use a GitHub Personal Access Token (PAT)
    echo    (Tokens can be generated at: https://github.com/settings/tokens)
    echo =====================================================================
)

echo.
pause
