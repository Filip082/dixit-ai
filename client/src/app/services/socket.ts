import { io } from 'socket.io-client';

// W środowisku deweloperskim Vite używamy proxy zdefiniowanego w vite.config.ts
// W produkcji połączenie nawiązywane jest z tego samego hosta
export const socket = io({
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
});
