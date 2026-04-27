import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { AuthView } from "./views/AuthView";
import { MainMenuView } from "./views/MainMenuView";
import { PersonalizationView } from "./views/PersonalizationView";
import { StatisticsView } from "./views/StatisticsView";
import { HostGameView } from "./views/HostGameView";
import { JoinLobbyView } from "./views/JoinLobbyView";

// Gameplay Views
import { GameBoard } from "./views/Gameplay/GameBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: AuthView },
      { path: "menu", Component: MainMenuView },
      { path: "personalization", Component: PersonalizationView },
      { path: "stats", Component: StatisticsView },
      { path: "host", Component: HostGameView },
      { path: "join", Component: JoinLobbyView },
      { path: "game/:id", Component: GameBoard },
    ],
  },
]);