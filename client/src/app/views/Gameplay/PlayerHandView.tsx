import React, { useState } from 'react';
import { GameplayHeader, CardGrid, AssociationBox } from '../../components/GameplayComponents';
import { ABSTRACT_CARDS } from '../../data/mockCards';

export function PlayerHandView() {
  const [selectedCard, setSelectedCard] = useState<string | undefined>();

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-8">
      <GameplayHeader 
        seconds={30} 
        roleText="Ruch Graczy" 
        instruction="Wybierz kartę którą najlepiej opisują słowa Narratora..." 
      />

      <AssociationBox text="Kosmiczna odyseja" />

      <div className="mt-4 mb-2 w-full flex-1">
        <CardGrid 
          cards={ABSTRACT_CARDS} 
          onSelect={setSelectedCard} 
          selectedId={selectedCard} 
        />
      </div>
    </div>
  );
}