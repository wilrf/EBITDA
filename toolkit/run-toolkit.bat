@echo off
:: EBITDA Toolkit Launcher
:: Double-click this file to start the toolkit

title EBITDA Development Toolkit
color 0B

echo.
echo ========================================
echo    EBITDA TOOLKIT - Starting...
echo ========================================
echo.

:: Check if PowerShell is available
where powershell >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is not installed or not in PATH
    echo Please install PowerShell to use this toolkit
    pause
    exit /b 1
)

:: Run the toolkit with proper execution policy
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0EBITDA-Toolkit.ps1"

:: If toolkit exits, pause to show any final messages
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo    ERROR: Toolkit encountered an issue
    echo ========================================
    echo.
    pause
)