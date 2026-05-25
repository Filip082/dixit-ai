// Mapowanie 6-znakowych kodów lobby (np. "A9X2FB") na UUID pokoju w bazie.
// Frontend posługuje się czytelnym kodem, baza trzyma UUID — utrzymujemy mapę
// w pamięci procesu, bo schemat DB nie ma kolumny `code` (zmiana schematu = cross-boundary).

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bez 0/O/1/I/L dla czytelności
const CODE_LENGTH = 6;
const MAX_ATTEMPTS = 50;

const codeToRoomId = new Map();
const roomIdToCode = new Map();

function randomCode() {
    let out = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return out;
}

function generateCode(roomId) {
    if (roomIdToCode.has(roomId)) {
        return roomIdToCode.get(roomId);
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const code = randomCode();
        if (!codeToRoomId.has(code)) {
            codeToRoomId.set(code, roomId);
            roomIdToCode.set(roomId, code);
            return code;
        }
    }

    throw new Error('Nie udało się wygenerować unikalnego kodu pokoju');
}

function resolveRoomId(codeOrId) {
    if (!codeOrId) return null;

    // UUID v4
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(codeOrId)) {
        return codeOrId.toLowerCase();
    }

    const code = codeOrId.toUpperCase();
    return codeToRoomId.get(code) || null;
}

function getCodeForRoom(roomId) {
    return roomIdToCode.get(roomId) || null;
}

function bindExistingCode(code, roomId) {
    const upper = code.toUpperCase();
    codeToRoomId.set(upper, roomId);
    roomIdToCode.set(roomId, upper);
}

function releaseRoom(roomId) {
    const code = roomIdToCode.get(roomId);
    if (code) {
        codeToRoomId.delete(code);
        roomIdToCode.delete(roomId);
    }
}

function clearAll() {
    codeToRoomId.clear();
    roomIdToCode.clear();
}

module.exports = {
    generateCode,
    resolveRoomId,
    getCodeForRoom,
    bindExistingCode,
    releaseRoom,
    clearAll,
    CODE_LENGTH,
};
