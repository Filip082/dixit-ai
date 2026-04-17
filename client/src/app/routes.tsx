import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { AuthView } from "./views/AuthView";
import { MainMenuView } from "./views/MainMenuView";
import { HostGameView } from "./views/HostGameView";
import { JoinLobbyView } from "./views/JoinLobbyView";
import { PersonalizationView } from "./views/PersonalizationView";
import { StatisticsView } from "./views/StatisticsView";

// Gameplay Views
import { NarratorHandView } from "./views/Gameplay/NarratorHandView";
import { NarratorTurnView } from "./views/Gameplay/NarratorTurnView";
import { PlayerHandView } from "./views/Gameplay/PlayerHandView";
import { PlayerTurnView } from "./views/Gameplay/PlayerTurnView";
import { PlayerVoteView } from "./views/Gameplay/PlayerVoteView";
import { NarratorVoteView } from "./views/Gameplay/NarratorVoteView";
import { RoundScoreView } from "./views/Gameplay/RoundScoreView";
import { RoundEndView } from "./views/Gameplay/RoundEndView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Używamy element zamiast Component
    children: [
      { 
        index: true, 
        element: <AuthView /> 
      },
      { 
        path: "menu", 
        element: <MainMenuView /> 
      },
      { path: "personalization", element: <PersonalizationView /> },
      { path: "stats", element: <StatisticsView /> },
      { path: "host", element: <HostGameView /> },
      { path: "join", element: <JoinLobbyView /> },
      
      // Gameplay Previews
      { path: "narrator-hand", element: <NarratorHandView /> },
      { path: "narrator-turn", element: <NarratorTurnView /> },
      { path: "player-hand", element: <PlayerHandView /> },
      { path: "player-turn", element: <PlayerTurnView /> },
      { path: "player-vote", element: <PlayerVoteView /> },
      { path: "narrator-vote", element: <NarratorVoteView /> },
      { path: "round-score", element: <RoundScoreView /> },
      { path: "round-end", element: <RoundEndView /> },

      // Catch-all: Przekieruj do logowania jeśli ścieżka nie istnieje
      { path: "*", element: <Navigate to="/" replace /> }
    ],
  },
]);