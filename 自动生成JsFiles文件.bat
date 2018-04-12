@echo off
::获取的js文件路径
set getPath=%~dp0%assets\Script\
::保存的文件名
set saveFileName=JsFiles
::保存的文件路径
set savePath=%getPath%\Global\%saveFileName%.js

::缩进(4格)
set retract=    
::head内容
set head=var %saveFileName% = [
::bottom1内容
set bottom1=];
::bottom2内容
set bottom2=module.exports = %saveFileName%

::初始并写入head内容
echo %head%> %savePath%
::遍历getPath路径下所有.js文件名 写入文本
for /f "delims=" %%i in ('dir /b /s %getPath%*.js') do (
    if not %saveFileName%==%%~ni ( echo %retract%"%%~ni", ) >> %savePath%
)
::写入bottom1内容
echo %bottom1%>> %savePath%
::写入换行
echo.>> %savePath%
::写入bottom2内容
echo %bottom2% >> %savePath%

echo SUCCESS!!  

pause
