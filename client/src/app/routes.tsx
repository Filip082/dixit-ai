import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { AuthView } from "./views/AuthView";
import { MainMenuView } from "./views/MainMenuView";
import { PersonalizationView } from "./views/PersonalizationView";
import { StatisticsView } from "./views/StatisticsView";
import { HostGameView } from "./views/HostGameView";
import { JoinLobbyView } from "./views/JoinLobbyView";

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
    Component: MainLayout,
    children: [
      { index: true, Component: AuthView },
      { path: "menu", Component: MainMenuView },
      { path: "personalization", Component: PersonalizationView },
      { path: "stats", Component: StatisticsView },
      { path: "host", Component: HostGameView },
      { path: "join", Component: JoinLobbyView },
      
      // Gameplay Previews
      { path: "narrator-hand", Component: NarratorHandView },
      { path: "narrator-turn", Component: NarratorTurnView },
      { path: "player-hand", Component: PlayerHandView },
      { path: "player-turn", Component: PlayerTurnView },
      { path: "player-vote", Component: PlayerVoteView },
      { path: "narrator-vote", Component: NarratorVoteView },
      { path: "round-score", Component: RoundScoreView },
      { path: "round-end", Component: RoundEndView },
    ],
  },
]);