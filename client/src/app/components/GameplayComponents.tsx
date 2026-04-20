import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from './Button';

export function TimerBox({ seconds }: { seconds: number }) {
  return (
    <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-gray-800">
      <Clock size={20} className="text-orange-400" />
      <span className="text-2xl font-black tabular-nums">{seconds}s</span>
    </div>
  );
}

export function RoleBadge({ text }: { text: string }) {
  return (
    <div className="bg-orange-500 text-white px-6 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-md border-2 border-orange-600">
      {text}
    </div>
  );
}

export function InstructionBox({ text }: { text: React.ReactNode }) {
  return (
    <div className="w-full text-center mt-6 mb-8 px-4">
      <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto italic whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

export function GameplayHeader({ seconds, roleText, instruction }: { seconds: number, roleText: string, instruction: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center gap-4 mt-6">
        <TimerBox seconds={seconds} />
        <RoleBadge text={roleText} />
      </div>
      <InstructionBox text={instruction} />
    </div>
  );
}

export function AssociationBox({ text }: { text: string }) {
  return (
    <div className="bg-white border-2 border-gray-200 px-8 py-6 rounded-3xl shadow-xl max-w-2xl w-full text-center my-8 mx-auto transform -rotate-1 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
        Skojarzenie Narratora
      </div>
      <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
        "{text}"
      </p>
    </div>
  );
}

export function CardGrid({ 
  cards, 
  onSelect, 
  selectedId 
}: { 
  cards: { id: string, image: string }[], 
  onSelect?: (id: string) => void,
  selectedId?: string 
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto px-4 mt-auto">
      {cards.map((card) => {
        const isSelected = selectedId === card.id;
        return (
          <button
            key={card.id}
            onClick={() => onSelect && onSelect(card.id)}
            className={cn(
              "relative aspect-square rounded-[2rem] overflow-hidden transition-all duration-300 transform",
              onSelect ? "cursor-pointer hover:scale-105 hover:shadow-2xl" : "cursor-default",
              isSelected ? "scale-105 shadow-2xl ring-8 ring-orange-500 ring-offset-4 ring-offset-[#f3f4f6]" : "shadow-lg border border-gray-200"
            )}
          >
            <img 
              src={card.image} 
              alt="Karta" 
              className="w-full h-full object-cover"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-orange-500/20" />
            )}
          </button>
        );
      })}
    </div>
  );
}