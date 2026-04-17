import React, { useState } from 'react';
import { GameplayHeader, CardGrid, AssociationBox } from '../../components/GameplayComponents';
import { ABSTRACT_CARDS } from '../../data/mockCards';

export function PlayerVoteView() {
  const [selectedCard, setSelectedCard] = useState<string | undefined>();

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-8">
      <GameplayHeader 
        seconds={20} 
        roleText="Ruch Graczy" 
        instruction="Wybierz kartę Narratora..." 
      />

      <div className="flex-1 w-full my-6">
        <CardGrid 
          cards={ABSTRACT_CARDS} 
          onSelect={setSelectedCard} 
          selectedId={selectedCard} 
        />
      </div>

      <AssociationBox text="Kosmiczna odyseja" />
    </div>
  );
}