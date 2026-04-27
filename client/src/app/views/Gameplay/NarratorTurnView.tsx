import React from 'react';
import { GameplayHeader } from '../../components/GameplayComponents';
import { useGameStore } from '../../store/useGameStore';

export function NarratorTurnView({ isAI = false }: { isAI?: boolean }) {
  const { timer, players } = useGameStore();
  const narratorName = players.find(p => p.isAI === isAI)?.name || 'Narrator';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-3xl mx-auto min-h-[60vh]">
      <GameplayHeader 
        seconds={timer} 
        roleText="Ruch Narratora" 
        instruction={`Narrator wybiera swoją kartę i wymyśla opis...\n\nObecnie ruch wykonuje: ${narratorName}`} 
        isAI={isAI}
      />
      
      <div className="mt-12 flex space-x-2 justify-center">
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
