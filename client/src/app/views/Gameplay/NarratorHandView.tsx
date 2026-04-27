import React, { useState } from 'react';
import { GameplayHeader, CardGrid } from '../../components/GameplayComponents';
import { useGameStore } from '../../store/useGameStore';
import { Input } from '../../components/Input';
import { ArrowRight } from 'lucide-react';
import { socket } from '../../services/socket';

export function NarratorHandView() {
  const { hand, selectedCardId, setSelectedCard, timer } = useGameStore();
  const [association, setAssociation] = useState('');

  const handleSubmit = () => {
    if (selectedCardId && association) {
      socket.emit('submitNarratorCard', { cardId: selectedCardId, prompt: association });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-12">
      <GameplayHeader 
        seconds={timer} 
        roleText="Ruch Narratora" 
        instruction="Wybierz 1 z dostępnych kart. Co kojarzy ci się z wybraną kartą? Jednak opis nie może być zbyt oczywisty..." 
      />

      <div className="flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto px-4 py-8">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Input 
              value={association}
              onChange={(e) => setAssociation(e.target.value)}
              maxLength={60}
              placeholder="Wpisz swoje skojarzenie..."
              className="text-center text-xl font-bold h-16 shadow-xl border-gray-200 pr-20"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
              {association.length}/60
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="h-16 w-16 shrink-0 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            disabled={!association || !selectedCardId}
          >
            <ArrowRight size={28} />
          </button>
        </div>
      </div>

      <CardGrid 
        cards={hand} 
        onSelect={setSelectedCard} 
        selectedId={selectedCardId}
        layout="row"
      />
    </div>
  );
}
