import React from 'react';
import { GameplayHeader, CardGrid, AssociationBox } from '../../components/GameplayComponents';
import { useGameStore } from '../../store/useGameStore';

export function NarratorVoteView() {
  const { tableCards, prompt, timer } = useGameStore();

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-12">
      <GameplayHeader 
        seconds={timer} 
        roleText="Ruch Graczy" 
        instruction="Karty wybrane w rundzie..." 
      />

      <AssociationBox text={prompt} />

      <div className="flex-1 w-full my-6 flex items-center justify-center">
        <CardGrid 
          cards={tableCards} 
          layout="grid"
        />
      </div>
    </div>
  );
}