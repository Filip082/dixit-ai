import React from 'react';
import { RouterProvider } from 'react-router-dom'; // Zmieniono z 'react-router'
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}

// Layout i tło
import { MainLayout } from './components/MainLayout';
import { PlayfulBackground } from './components/PlayfulBackground';

// Widoki
import { AuthView } from './views/AuthView';
import { MainMenuView } from './views/MainMenuView';
import { HostGameView } from './views/HostGameView';
import { JoinLobbyView } from './views/JoinLobbyView';