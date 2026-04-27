import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { NarratorHandView } from './NarratorHandView';
import { NarratorTurnView } from './NarratorTurnView';
import { PlayerHandView } from './PlayerHandView';
import { PlayerTurnView } from './PlayerTurnView';
import { PlayerVoteView } from './PlayerVoteView';
import { NarratorVoteView } from './NarratorVoteView';
import { RoundScoreView } from './RoundScoreView';
import { RoundEndView } from './RoundEndView';

export function GameBoard() {
  const { phase, isNarrator } = useGameStore();

  switch (phase) {
    case 'prompting':
      // Narrator wybiera kartę i hasło, reszta czeka
      return isNarrator ? <NarratorHandView /> : <NarratorTurnView isAI={false} />;
    
    case 'submitting':
      // Gracze wybierają karty do hasła, narrator czeka
      return isNarrator ? <PlayerTurnView /> : <PlayerHandView />;
    
    case 'voting':
      // Gracze głosują na kartę narratora, narrator czeka/obserwuje
      return isNarrator ? <NarratorVoteView /> : <PlayerVoteView />;
    
    case 'scoring':
      // Wyniki rundy
      return <RoundScoreView />;

    case 'game_over':
      // Podium / Wyniki końcowe
      return <RoundEndView />;
    
    default:
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-bold animate-pulse">Ładowanie stanu gry...</p>
          </div>
        </div>
      );
  }
}
