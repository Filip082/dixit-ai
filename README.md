# Dixit AI

Cyfrowa implementacja gry planszowej Dixit z AI botami, systemem multiplayer i edytorem kart. Gracze poprzez skojarzenia słowne odgadują karty, a system AI generuje hasła i wykonuje ruchy botów.

## Funkcjonalności

### 🎮 Rdzenna rozgrywka

- **Fazy gry**: Każda runda składa się z trzech etapów:
  - *Prompting* — Narrator wybiera kartę z ręki i wymyśla do niej skojarzenie (max 8 słów)
  - *Submitting* — Pozostali gracze wybierają kartę, którą uważają za inspirację narratora
  - *Voting* — Wszyscy (poza narratorem) głosują na kartę, którą myślą, że wybrał narrator
- **Rotacja narratora** — Po każdej rundzie narrator zmienia się (rotacja cykliczna)
- **System punktacji** — Punkty przydzielane za prawidłowe odgadnięcie i za oszukanie (jeśli inni wcześnie odgadli kartę narratora)

### 🤖 AI i Boty

- **AI Narrator** — Bot generuje skojarzenia do kart za pomocą modelu AI (Google GenAI, HuggingFace)
- **AI Submitter** — Boty wybierają karty do skojarzenia na podstawie analizy obrazów
- **AI Voter** — Boty głosują strategicznie na podstawie dostępnych opcji
- **Graceful fallback** — Gdy AI niedostępne, boty losują karty/głosy

### 👥 System Lobby

- **Tworzenie pokoju** — Host ustala liczbę graczy, warunek końca gry (punkty/rundy)
- **Kod dostępu** — 6-znakowy kod do dołączenia przez innych graczy
- **Dodawanie botów** — Host może dodać boty do pokoju (min. 3 gracze do startu)
- **Synchronizacja graczy** — Rejestracja wejścia/wyjścia w czasie rzeczywistym (Socket.io)

### 📊 Statystyki i Ranking

- **Leaderboard** — Globalny ranking (wygrane gry, liczba rund)
- **Historia gier** — Szczegółowe wyniki każdej rozgrywki (wynik, ranga, uczestnicy)
- **Profil psychologiczny** — Analiza stylu gry w czterech wymiarach (abstrakcja, zwięzłość, cukierkowatość, trafność)
- **Profil gracza** — Statystyki indywidualne

### 💰 Żetony 

- **Zarabianie żetonów** — Gracze zdobywają monety za punkty w grze
- **Sprzedaż motywy** — Możliwość zakupu dodatkowych motywów interfejsu za monety
- **Wyświetlanie salda** — Aktualne saldo monet w panelu personalizacji
- **Leaderboard żetonów** — Ranking graczy wg liczby posiadanych monet

### 🎨 Motywy (personalizacja interfejsu)

- **Classic** (gratis) — Pomarańczowy motyw (domyślny)
- **Ocean** (100 monet) — Niebieski motyw inspirowany oceanem
- **Forest** (100 monet) — Zielony motyw inspirowany lasem
- **Dark** (200 monet) — Ciemny motyw dla wygody oka
- **Zmiana aktywnego motywu** — Wybór motywu do użycia w grze
- **System zakupu** — Kup motywy za zarobione monety

### 🎨 Własne karty

- **Upload kart** — Gracze mogą wgrać własne obrazy jako karty
- **Canvas Editor** — Wbudowany edytor do rysowania/modyfikacji kart
- **Zestawy kart** — Możliwość wyboru zestawu kart do gry

### 🔐 Autentykacja

- **Rejestracja i logowanie** — System JWT
- **Sesja** — Tokeny httpOnly, bezpieczne

---

## Przepływ gry (krok po kroku)

### 1. Logowanie
Gracz rejestruje się lub loguje na stronie głównej. Identyfikator gracza zapisywany w sesji.

### 2. Menu główne
Gracz wybiera **Stwórz nową grę** (host) lub **Dołącz do gry** (gracz).

### 3. Lobby (Host)
1. Host tworzy pokój — otrzymuje 6-znakowy kod
2. Opcjonalnie dodaje boty
3. Czeka na dołączenie innych graczy (min. 3 łącznie)
4. Klika **Rozpocznij grę**

### 4. Lobby (Pozostali gracze)
1. Wpisują 6-znakowy kod
2. Dołączają do pokoju
3. Widzą listę graczy w czasie rzeczywistym

### 5. Gra — runda (3+ graczy)
Każda runda przechodzi przez fazy:

**Narrator (losowy):**
- Widzi swoją rękę (8 kart)
- Wybiera kartę
- Wpisuje skojarzenie 
- Potwierdza — faza przechodzi do *submitting*

**Pozostali gracze:**
- Widzą skojarzenie narratora
- Wybierają z własnej ręki kartę, którą uważają za inspirację
- Wszystkie submissje wysyłane naraz — faza przechodzi do *voting*

**Wszyscy (łącznie narrator):**
- Widzą 3+ kart na stole (wyborów gracze + karta narratora)
- Głosują kto ma rację (karta narratora)
- Po głosach: obliczenie punktów → przejście do następnej rundy

### 6. Koniec gry
Gra kończy się po osiągnięciu warunku (punkty/rundy). Wyświetlany:
- Ostateczny ranking
- Wykresy statystyk
- Powrót do menu

---

## Infrastruktura

| Komponent | Technologia | Port | Rola |
|-----------|------------|------|------|
| Frontend | React, Vite, TypeScript | 5173 | UI gry, routing, Socket.io |
| Backend | Node.js, Express, Socket.io | 3000 | REST API, lobby, gra, DB |
| AI Bot | Python, FastAPI, Google GenAI | 8000 | Generowanie haseł, wybór kart, głosy |
| DB | PostgreSQL | 5432 | Użytkownicy, gry, karty, statystyki |

---

## Instalacja i uruchomienie

### Szybko (Docker)
```bash
docker-compose up --build
```

### Lokalnie

**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

 