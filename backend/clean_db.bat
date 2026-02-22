@echo off
echo Cleaning invalid applications from database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot dbi_system < fix_db.sql
echo Done!
pause
