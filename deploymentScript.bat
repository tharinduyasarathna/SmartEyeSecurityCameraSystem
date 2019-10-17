@ECHO OFF 
:: This batch file reveals set Smart Eye project all module configuration.
TITLE Smart Eye Project version 0.1
ECHO Please wait... install and build project.

:: Section 1: Run Object Detection Module.
ECHO ============================
ECHO Object Detection Module
ECHO ============================

cd "modules\Object detection module"

start /b python app.py

ECHO ============================
ECHO Object detection status = passed
ECHO ============================

:: Section 2: Run System Monitor Module.
ECHO ============================
ECHO System Monitor Module
ECHO ============================

cd "../system monitor stat module"

call npm install

start /b npm run dev

ECHO ============================
ECHO System Monitor status = passed
ECHO ============================

:: Section 3: Run Main Module.
ECHO ============================
ECHO Main Module
ECHO ============================

cd "../../"

call npm install

start /b ng serve


ECHO ============================
ECHO Main Module status = passed
ECHO ============================