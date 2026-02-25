@echo off
echo Inserting sample schemes into database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pYOUR_PASSWORD dbi < insert_sample_schemes.sql
if %errorlevel% equ 0 (
    echo Schemes inserted successfully!
) else (
    echo Error inserting schemes. Please run the SQL manually.
)
pause
