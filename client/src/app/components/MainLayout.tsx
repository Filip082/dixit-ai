import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { PlayfulBackground } from './PlayfulBackground';
import { Button } from './Button';
import { ArrowLeft, Terminal } from 'lucide-react';
import { useGameStore, GamePhase } from '../store/useGameStore';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const setGameState = useGameStore((state) => state.setGameState);

  const isAuth = location.pathname === '/';
  const isMenu = location.pathname === '/menu';

  const showBackButton = !isAuth && !isMenu;

  return (
    <div className="relative min-h-screen font-sans text-gray-900 flex flex-col items-center justify-center p-4">
      <PlayfulBackground />

      {showBackButton && (
        <div className="absolute top-6 left-6 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center bg-white/80 backdrop-blur-sm border-gray-300 hover:border-gray-500 rounded-full pr-5 pl-4 py-2"
          >
            <ArrowLeft size={18} />
            Wróć
          </Button>
        </div>
      )}

      {/* Main content container with some entrance animation */}
      <main className="z-10 w-full max-w-5xl animate-[fade-in_0.3s_ease-out_forwards] mx-auto flex items-center justify-center min-h-[80vh]">
        <Outlet />
      </main>

      {/* Debug Panel - Niskie Opory Testing */}
      <div className="fixed bottom-4 right-4 z-[100] flex gap-2 p-2 bg-gray-900/90 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-md opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center px-3 border-r border-gray-700 text-orange-400">
          <Terminal size={16} />
        </div>
        {(['prompting', 'submitting', 'voting', 'scoring', 'game_over'] as GamePhase[]).map((p) => (
          <button
            key={p}
            onClick={() => setGameState({ 
              phase: p, 
              timer: 30, 
              prompt: 'Przykładowe hasło',
              players: useGameStore.getState().players.length > 0 ? useGameStore.getState().players : [
                { name: 'PlayerOne', points: 32, fill: '#f97316' },
                { name: 'AliceInWonder', points: 28, fill: '#3b82f6' },
                { name: 'BobTheBuilder 🤖', points: 22, fill: '#10b981', isAI: true },
                { name: 'CharlieChaplin', points: 15, fill: '#8b5cf6' },
              ]
            })}
            className="px-3 py-1 text-xs font-black text-white hover:text-orange-400 uppercase tracking-tighter"
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => {
            const current = useGameStore.getState().isNarrator;
            setGameState({ isNarrator: !current });
          }}
          className="px-3 py-1 text-xs font-black text-orange-400 hover:text-white uppercase tracking-tighter"
        >
          Toggle Role
        </button>
      </div>
    </div>
  );
}
