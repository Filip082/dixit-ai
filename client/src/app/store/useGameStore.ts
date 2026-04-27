import { create } from 'zustand';

export interface Card {
  id: string;
  image: string;
}

export interface PlayerScore {
  name: string;
  points: number;
  fill: string;
  isAI?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  coins: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalPoints: number;
    rank?: number;
  };
  ownedThemeIds: string[];
  activeThemeId: string;
}

export interface LobbyPlayer {
  id: string;
  name: string;
  isHost: boolean;
}

export type GamePhase = 'prompting' | 'submitting' | 'voting' | 'scoring' | 'game_over' | 'waiting';

interface GameState {
  // Profil
  me: UserProfile | null;
  globalRanking: { rank: number; name: string; wins: number; avatar: string }[];

  // Stan pokoju/gry
  roomId: string | null;
  lobbyPlayers: LobbyPlayer[];
  phase: GamePhase;
  isNarrator: boolean;
  prompt: string;
  hand: Card[];
  tableCards: Card[];
  timer: number;
  players: PlayerScore[];
  selectedCardId?: string;

  // Akcje
  setMe: (user: UserProfile | null) => void;
  setGlobalRanking: (ranking: any[]) => void;
  setLobbyPlayers: (players: LobbyPlayer[]) => void;
  setGameState: (data: any) => void;
  setSelectedCard: (id: string | undefined) => void;
  decrementTimer: () => void;
  resetSelection: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Dane startowe (Placeholder dopóki API nie odpowie)
  me: {
    id: '1',
    username: 'PlayerOne',
    email: 'player@example.com',
    coins: 450,
    stats: {
      gamesPlayed: 142,
      gamesWon: 15,
      totalPoints: 1250,
      rank: 42
    },
    ownedThemeIds: ['1', '3'],
    activeThemeId: '1'
  },
  globalRanking: [
    { rank: 1, name: 'DragonSlayer99', wins: 1450, avatar: 'DR' },
    { rank: 2, name: 'AliceInWonder', wins: 1205, avatar: 'AL' },
    { rank: 3, name: 'BobTheBuilder', wins: 980, avatar: 'BO' },
    { rank: 4, name: 'CharlieChaplin', wins: 875, avatar: 'CH' },
    { rank: 5, name: 'EveHacker', wins: 840, avatar: 'EV' },
  ],
  roomId: null,
  lobbyPlayers: [],
  phase: 'waiting',
  isNarrator: false,
  prompt: '',
  hand: [],
  tableCards: [],
  timer: 0,
  players: [],
  selectedCardId: undefined,

  setMe: (user) => set({ me: user }),
  setGlobalRanking: (ranking) => set({ globalRanking: ranking }),
  setLobbyPlayers: (players) => set({ lobbyPlayers: players }),
  
  setGameState: (data) => set((state) => ({
    phase: data.phase ?? state.phase,
    isNarrator: data.isNarrator ?? state.isNarrator,
    prompt: data.prompt ?? state.prompt,
    hand: data.hand ?? state.hand,
    tableCards: data.tableCards ?? state.tableCards,
    timer: data.timer ?? state.timer,
    players: data.players ?? state.players,
    roomId: data.roomId ?? state.roomId,
    selectedCardId: data.phase !== state.phase ? undefined : state.selectedCardId,
  })),

  setSelectedCard: (id) => set({ selectedCardId: id }),
  decrementTimer: () => set((state) => ({ timer: Math.max(0, state.timer - 1) })),
  resetSelection: () => set({ selectedCardId: undefined }),
}));
