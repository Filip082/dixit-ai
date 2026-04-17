import React, { useState } from 'react';
import { GameplayHeader, CardGrid } from '../../components/GameplayComponents';
import { ABSTRACT_CARDS } from '../../data/mockCards';
import { Input } from '../../components/Input';

export function NarratorHandView() {
  const [selectedCard, setSelectedCard] = useState<string | undefined>();
  const [association, setAssociation] = useState('');

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-8">
      <GameplayHeader 
        seconds={40} 
        roleText="Ruch Narratora" 
        instruction="Wybierz 1 z dostępnych kart. Co kojarzy ci się z wybraną kartą? Jednak opis nie może być zbyt oczywisty..." 
      />

      <div className="w-full max-w-xl mx-auto my-8 px-4 relative">
        <Input 
          value={association}
          onChange={(e) => setAssociation(e.target.value)}
          maxLength={60}
          placeholder="Wpisz swoje skojarzenie..."
          className="text-center text-xl font-bold h-16 shadow-xl border-gray-200 pr-24"
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
          {association.length}/60
        </div>
      </div>

      <CardGrid 
        cards={ABSTRACT_CARDS} 
        onSelect={setSelectedCard} 
        selectedId={selectedCard} 
      />
    </div>
  );
}