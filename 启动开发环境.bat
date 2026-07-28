@echo off
chcp 65001 >nul
title Peter 的小世界 - 开发环境

echo ========================================
echo    Peter 的小世界 - 开发环境启动
echo ========================================
echo.

echo [1/4] 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo [2/4] 安装前端依赖...
cd frontend
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ❌ 前端依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo 依赖已存在，跳过安装
)
cd ..
echo ✅ 前端依赖就绪
echo.

echo [3/4] 安装后端依赖...
cd backend
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo ❌ 后端依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo 依赖已存在，跳过安装
)
cd ..
echo ✅ 后端依赖就绪
echo.

echo [4/4] 启动开发服务器...
echo.
echo ========================================
echo  🎉 开发环境启动完成！
echo ========================================
echo.
echo 🌐 前台地址: http://localhost:5173
echo 🔧 后台地址: http://localhost:5173/admin
echo 🔑 默认账号: admin / admin123
echo.
echo 后端 API: http://localhost:3001
echo.
echo 按 Ctrl+C 停止服务
echo ========================================
echo.

:: 启动后端
start "后端服务" cmd /k "cd /d %~dp0backend && npm run dev"

:: 等待一下再启动前端
timeout /t 3 /nobreak >nul

:: 启动前端
start "前端服务" cmd /k "cd /d %~dp0frontend && npm run dev"

:: 打开浏览器
timeout /t 5 /nobreak >nul
start http://localhost:5173

pause
