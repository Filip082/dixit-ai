import React from 'react';
import { GameplayHeader, CardGrid, AssociationBox } from '../../components/GameplayComponents';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/Button';
import { socket } from '../../services/socket';

export function PlayerVoteView() {
  const { tableCards, selectedCardId, setSelectedCard, prompt, timer } = useGameStore();

  const handleVote = () => {
    if (selectedCardId) {
      socket.emit('castVote', { cardId: selectedCardId });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center max-w-5xl mx-auto pb-12">
      <GameplayHeader 
        seconds={timer} 
        roleText="Ruch Graczy" 
        instruction="Wybierz kartę Narratora..." 
      />

      <AssociationBox text={prompt} />

      <div className="flex justify-center my-4">
        <Button 
          disabled={!selectedCardId} 
          onClick={handleVote}
          size="lg"
          className="shadow-xl"
        >
          Oddaj głos
        </Button>
      </div>

      <div className="flex-1 w-full my-6 flex items-center justify-center">
        <CardGrid 
          cards={tableCards} 
          onSelect={setSelectedCard} 
          selectedId={selectedCardId} 
          layout="grid"
        />
      </div>
    </div>
  );
}