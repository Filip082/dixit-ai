#!/bin/bash

# Kolory dla czytelności w terminalu
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # Brak koloru

echo -e "${CYAN}===============================================${NC}"
echo -e "${CYAN}      Dixit AI - Instalator Konfiguracyjny     ${NC}"
echo -e "${CYAN}===============================================${NC}"
echo -e "${GREEN}Rozpoczynam proces instalacji...${NC}\n"

# ---------------------------------------------------------
# ETAP 1: BACKEND (Serwer)
# ---------------------------------------------------------
echo -e "${YELLOW}[1/2] Konfiguracja serwera (Backend)...${NC}"
cd server || { echo -e "${RED}Błąd: Nie znaleziono folderu 'server'.${NC}"; exit 1; }

echo "-> Instalowanie standardowych zależności serwera..."
npm install

echo "-> Aplikowanie poprawek dla WSL (Prisma v5 + Binary Engine)..."
# Downgrade Prismy dla stabilności na WSL
npm install prisma@5.21.1 @prisma/client@5.21.1

# Neutralizacja problematycznego pliku konfiguracyjnego
if [ -f "prisma.config.ts" ]; then
    mv prisma.config.ts prisma.config.ts.bak
    echo "-> Zneutralizowano plik prisma.config.ts (zmieniono na .bak)"
fi

# Tworzenie/aktualizacja pliku .env
if [ ! -f ".env" ]; then
    echo "-> Tworzę podstawowy szablon .env..."
    echo 'PORT=3000' > .env
    echo 'JWT_SECRET="super_sekretny_klucz_dixit"' >> .env
    echo 'DATABASE_URL="postgresql://user:password@localhost:5432/dixit_db"' >> .env
fi

# Wymuszanie silnika binarnego w .env
if ! grep -q "PRISMA_CLIENT_ENGINE_TYPE" .env; then
    echo 'PRISMA_CLIENT_ENGINE_TYPE="binary"' >> .env
    echo 'PRISMA_CLI_QUERY_ENGINE_TYPE="binary"' >> .env
fi

echo "-> Generowanie Prisma Client..."
export PRISMA_CLIENT_ENGINE_TYPE="binary"
export PRISMA_CLI_QUERY_ENGINE_TYPE="binary"
npx prisma generate

cd ..

# ---------------------------------------------------------
# ETAP 2: FRONTEND (Klient)
# ---------------------------------------------------------
echo -e "\n${YELLOW}[2/2] Konfiguracja klienta (Frontend)...${NC}"
cd client || { echo -e "${RED}Błąd: Nie znaleziono folderu 'client'.${NC}"; exit 1; }

echo "-> Instalowanie pakietów klienta..."
npm install

echo "-> Weryfikacja pakietów Tailwind CSS v4..."
npm install tailwindcss @tailwindcss/postcss

# Sprzątanie śmieci konfiguracyjnych i cache'u
rm -f tailwind.config.js src/styles/tailwind.css
rm -rf node_modules/.vite

cd ..

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN} INSTALACJA ZAKOŃCZONA SUKCESEM! ${NC}"
echo -e " Teraz możesz uruchomić projekt komendą: ${CYAN}./run.sh${NC}"
echo -e "${GREEN}===============================================${NC}"