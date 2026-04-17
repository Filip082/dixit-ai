#!/bin/bash

# Kolory dla czytelności
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}===============================================${NC}"
echo -e "${CYAN}          Dixit AI - Szybki Start              ${NC}"
echo -e "${CYAN}===============================================${NC}"

# Funkcja zabijająca procesy po CTRL+C
cleanup() {
    echo -e "\n${RED}Zamykanie serwerów Dixit AI...${NC}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

# 1. Start Backendu
echo -e "${YELLOW}Uruchamiam Backend (Server)...${NC}"
cd server
export PRISMA_CLIENT_ENGINE_TYPE="binary"
export PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
npm run dev &
SERVER_PID=$!
cd ..

# Pauza na start bazy/serwera
sleep 2

# 2. Start Frontendu
echo -e "${YELLOW}Uruchamiam Frontend (Client)...${NC}"
cd client
npm run dev -- --force &
CLIENT_PID=$!
cd ..

echo -e "\n${GREEN}Aplikacja gotowa!${NC}"
echo -e "Backend: ${CYAN}http://localhost:3000${NC}"
echo -e "Frontend: ${CYAN}http://localhost:5173${NC}"
echo -e "Aby zakończyć, naciśnij ${RED}CTRL + C${NC}\n"

wait