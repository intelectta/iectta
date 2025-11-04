
@echo off
title Stellar-Collab App
cd /d "%~dp0"
echo Instalando dependencias...
npm install
echo Iniciando servidor local...
npm run dev
pause