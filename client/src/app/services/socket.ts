import { io, Socket } from 'socket.io-client';

// Łączymy się przez '/', ponieważ Proxy w Vite przekieruje to na http://localhost:3000
export const socket: Socket = io('/', {
  autoConnect: false, // Nie łączymy się od razu (poczekamy na logowanie)
  withCredentials: true, // Kluczowe: wysyła ciasteczko JWT do backendu
});

// Pomocnicza funkcja do logowania zdarzeń (ułatwi Ci debugowanie)
socket.onAny((eventName, ...args) => {
  console.log(`[Socket.io Event]: ${eventName}`, args);
});