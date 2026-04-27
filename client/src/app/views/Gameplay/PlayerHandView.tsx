import React from 'react';
import { GameplayHeader, CardGrid, AssociationBox } from '../../components/GameplayComponents';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/Button';
import { socket } from '../../services/socket';

export function PlayerHandView() {
  const { hand, selectedCardId, setSelectedCard, prompt, timer } = useGameStore();

  const handleSubmit = () => {
    if (selectedCardId) {
      socket.emit('submitPlayerCard', { cardId: selectedCardId });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-12">
      <GameplayHeader 
        seconds={timer} 
        roleText="Ruch Graczy" 
        instruction="Wybierz kartę którą najlepiej opisują słowa Narratora..." 
      />

      <div className="flex-1 flex flex-col justify-center w-full py-8">
        <AssociationBox text={prompt} />
        
        <div className="flex justify-center mt-4">
          <Button 
            disabled={!selectedCardId} 
            onClick={handleSubmit}
            size="lg"
            className="shadow-xl"
          >
            Zatwierdź wybór
          </Button>
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
