# Wstępny plan testów jednostkowych (backend game logic)

Ten dokument opisuje **konkretne scenariusze testów jednostkowych** dla logiki gry, które będą wdrażane, gdy tylko backend zacznie zawierać pierwsze elementy „game engine” (fazy, tury, talia, punktacja, boty, timer).

## Cel

- Złapać błędy logiki (reguły gry, przejścia faz, punktacja) zanim dojdzie UI/multiplayer.
- Utrzymać deterministyczność: testy nie mogą zależeć od czasu rzeczywistego ani losowości.

## Założenia / przyszłe moduły

Zakładamy, że backend docelowo wyodrębni czystą logikę (bez Express/Socket) do modułów typu:

- `game/state` (stan gry: gracze, talia, runda, faza)
- `game/phases` (maszyna stanów faz)
- `game/scoring` (punktacja)
- `game/deck` (tasowanie, dobieranie)
- `game/bots` (bot narrator/gracz)
- `game/timer` (licznik czasu na fazę)

Testy jednostkowe powinny obejmować powyższe moduły **bez** bazy danych i **bez** sieci.

## Narzędzia i technika

- Runner: Jest (już jest w `server`)
- Mockowanie czasu: `jest.useFakeTimers()` + kontrola `Date.now()`
- Deterministyczny RNG: wstrzykiwany generator (np. `rng.nextInt(max)`), w testach stubowany.
- Dane testowe: małe fixture’y (np. 3–6 kart, 3 graczy).

## Zasady jakości

- Każdy test sprawdza 1 regułę.
- Brak losowości: żadnych "Math.random" bez wstrzyknięcia.
- Brak realnych timerów: żadnych `setTimeout` bez fake timers.
- Każdy błąd ma komunikat (np. `INVALID_PHASE`, `NOT_YOUR_TURN`).

---

## Scenariusze testowe (lista)

### 1) Timer / licznik faz

1. `startTimer(durationMs)` ustawia licznik na poprawną wartość.
2. Gdy licznik dojdzie do 0:
   - a) faza automatycznie się kończy i generuje event `PHASE_TIMEOUT`, **albo**
   - b) zwraca status „timeout” (w zależności od projektu) — decyzja musi być spójna.
3. Licznik nie schodzi poniżej 0 (clamp).
4. Restart timera resetuje stan (brak „podwójnych ticków”).
5. `pause/resume` (jeśli będzie) — nie zmienia końcowego czasu wznawiania.

### 2) Talia / dobieranie kart

1. Tasowanie jest deterministyczne przy tym samym seed/RNG.
2. Dobranie karty zmniejsza talię o 1 i zwiększa rękę o 1.
3. Próba dobrania z pustej talii:
   - a) zwraca błąd `DECK_EMPTY`, **albo**
   - b) dobiera z discard (jeśli taki mechanizm będzie) — do ustalenia.
4. „Bot wylosuje pustą kartę”:
   - jeśli karta jest `null/undefined` → błąd walidacji `INVALID_CARD_DRAW`.
   - jeśli karta ma brakujące pola → błąd walidacji (np. `CARD_MALFORMED`).
5. Duplicaty kart w ręce (jeśli niedozwolone) — nie powinny się pojawić.

### 3) Rejestracja graczy w grze / lobby state

1. Dodanie gracza zwiększa licznik graczy i przypisuje unikalne `playerId`.
2. Ten sam gracz nie może dołączyć 2× (idempotencja / `ALREADY_JOINED`).
3. Przekroczenie limitu graczy zwraca błąd `LOBBY_FULL`.
4. Start gry bez minimalnej liczby graczy (np. <3) zwraca `NOT_ENOUGH_PLAYERS`.

### 4) Maszyna stanów faz (core)

Przykładowe fazy: `NARRATOR_PICK` → `PLAYERS_PICK` → `VOTING` → `SCORING`.

1. Z poprawnego stanu da się przejść tylko do dozwolonej fazy następnej.
2. Niedozwolone przejście faz zwraca `INVALID_PHASE_TRANSITION`.
3. Przejście faz resetuje dane fazy (np. wybory kart, głosy).
4. Brak „przecieków” między rundami (nowa runda nie dziedziczy głosów/wyborów).

### 5) Narrator: wybór karty i skojarzenie

1. Narrator musi podać skojarzenie niepuste (trim) i w limicie znaków.
2. Narrator musi wybrać kartę z własnej ręki.
3. Narrator nie może wybrać 2 kart.
4. Wybór narratora zamyka `NARRATOR_PICK` i otwiera `PLAYERS_PICK`.

### 6) Gracze: wybór karty

1. Gracz nie może wybrać karty, jeśli nie jest w fazie `PLAYERS_PICK`.
2. Gracz nie może wybrać karty spoza swojej ręki.
3. Gracz nie może wybrać tej samej karty co narrator (jeśli to zasada) — do ustalenia.
4. Gdy wszyscy gracze wybiorą (bez narratora) → przejście do `VOTING`.
5. Timeout w `PLAYERS_PICK`:
   - a) auto-wybór (np. losowa karta), **albo**
   - b) pominięcie gracza — do ustalenia.

### 7) Głosowanie

1. Gracz nie może głosować na swoją kartę (jeśli to zasada).
2. Gracz może oddać tylko 1 głos.
3. Narrator nie głosuje (jeśli to zasada) i próba głosu zwraca `NARRATOR_CANNOT_VOTE`.
4. Głos oddany na kartę spoza puli rundy zwraca `INVALID_VOTE_TARGET`.
5. Timeout w `VOTING`:
   - a) brak głosu (0 punktów za bonusy), **albo**
   - b) auto-głos — do ustalenia.

### 8) Punktacja (Dixit rules – do doprecyzowania)

Warianty zależą od reguł, ale minimum:

1. Nikt nie trafił narratora → narrator 0, gracze (nienarratorzy) +2? (wg zasad)
2. Wszyscy trafili narratora → narrator 0, gracze +2? (wg zasad)
3. Część trafiła narratora → narrator +3, trafiający +3.
4. Bonusy za głosy na kartę gracza (np. +1 za każdy głos na Twoją kartę).
5. Suma punktów po rundzie = poprzednia suma + przyrost z rundy.
6. Wyniki są deterministyczne dla tych samych danych wejściowych.

> Uwaga: gdy ustalicie dokładne reguły punktacji, te przypadki trzeba dopasować 1:1 do implementacji.

### 9) Boty

1. Bot narrator nie wybiera pustego skojarzenia.
2. Bot narrator nie wybiera `null` karty; jeśli RNG daje indeks spoza zakresu → fallback + test.
3. Bot gracza głosuje tylko na kartę z puli.
4. Bot nie wykonuje akcji poza swoją fazą.

### 10) Walidacja i błędy domenowe

1. Każda niepoprawna akcja zwraca zdefiniowany błąd domenowy (kod + message).
2. Błędy nie mutują stanu (po błędzie stan gry pozostaje taki sam).
3. Idempotencja: powtórzenie tej samej akcji (np. „wybór karty” drugi raz) ma jasne zachowanie:
   - a) nadpisanie wyboru, **albo**
   - b) błąd `ALREADY_SELECTED` — do ustalenia.

---

## Minimalna ścieżka implementacji testów (gdy logika się pojawi)

1. Wyodrębnić czystą logikę do modułów bez Express.
2. Dodać deterministyczny RNG jako zależność.
3. Dodać „clock/timer” jako zależność.
4. Napisać testy dla: przejść faz + punktacji (najwięcej wartości na start).
