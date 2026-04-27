import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { socket } from './services/socket';
import { useGameStore } from './store/useGameStore';

export default function App() {
  const setMe = useGameStore((state) => state.setMe);
  const setGameState = useGameStore((state) => state.setGameState);
  const decrementTimer = useGameStore((state) => state.decrementTimer);

  useEffect(() => {
    // Pobierz dane o zalogowanym użytkowniku
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setMe(data);
      })
      .catch(err => console.error('Błąd pobierania profilu:', err));

    // Lokalny "tick" licznika dla płynności UI (Happy Path)
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    // Nasłuchiwanie na globalną aktualizację stanu gry z serwera
    socket.on('gameStateUpdate', (data) => {
      console.log('Otrzymano aktualizację stanu gry:', data);
      setGameState(data);
    });

    // Obsługa błędów połączenia (opcjonalnie dla stabilności MVP)
    socket.on('connect_error', (err) => {
      console.error('Błąd połączenia Socket.io:', err.message);
    });

    return () => {
      clearInterval(interval);
      socket.off('gameStateUpdate');
      socket.off('connect_error');
    };
  }, [setGameState, decrementTimer]);

  return <RouterProvider router={router} />;
}