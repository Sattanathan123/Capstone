REM Quick Fix for Role Column Issue
REM Run this in Command Prompt from the backend directory

@echo off
echo ========================================
echo Fixing Database Role Column Size
echo ========================================
echo.
echo This will fix the "Data truncated for column 'role'" error
echo.
echo Running MySQL command...
echo.

mysql -u root -p -e "USE dbi_database; ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL; SELECT 'Role column updated successfully!' AS Status;"

echo.
echo ========================================
echo Fix Applied!
echo ========================================
echo.
echo Now you can:
echo 1. Try registering again
echo 2. Or restart your backend server
echo.
pause
