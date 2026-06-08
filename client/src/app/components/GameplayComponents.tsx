import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/app/components/ui/utils';
import { GameCard } from './GameCard';

export function TimerBox({ seconds }: { seconds: number }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-2.5 rounded-2xl shadow-lg border-2 border-gray-800">
      <img src="/Ikony/ClockIcon.svg" className="w-6 h-6" alt="Czas" />
      <span className="text-2xl font-black tabular-nums leading-none">{seconds}s</span>
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

const MIN_CARD_WIDTH = 96;
const HAND_MAX_WIDTH = 176;
const TABLE_MAX_BY_COUNT: [number, number][] = [
  [4, 200],
  [6, 160],
  [8, 128],
];

function getMaxCardWidth(variant: 'hand' | 'table', count: number) {
  if (variant === 'hand') return HAND_MAX_WIDTH;
  for (const [maxCount, maxWidth] of TABLE_MAX_BY_COUNT) {
    if (count <= maxCount) return maxWidth;
  }
  return 128;
}

function computeCardWidth(
  containerWidth: number,
  count: number,
  variant: 'hand' | 'table',
  gap: number,
) {
  if (count === 0 || containerWidth <= 0) {
    return variant === 'hand' ? 128 : 160;
  }
  const maxW = getMaxCardWidth(variant, count);
  const available = containerWidth - gap * Math.max(0, count - 1);
  return Math.max(MIN_CARD_WIDTH, Math.min(maxW, Math.floor(available / count)));
}

export function CardGrid({
  cards,
  onSelect,
  selectedId,
  faceDown = false,
  disabled = false,
  variant = 'hand',
}: {
  cards: { id: string; image?: string; disabled?: boolean }[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  faceDown?: boolean;
  disabled?: boolean;
  /** hand = przewijana ręka; table = karty na stole */
  variant?: 'hand' | 'table';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number>(() =>
    computeCardWidth(0, cards.length, variant, variant === 'hand' ? 20 : 24),
  );
  const gap = variant === 'hand' ? 20 : 24;
  const selectable = !!onSelect && !disabled;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setCardWidth(computeCardWidth(el.clientWidth, cards.length, variant, gap));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cards.length, variant, gap]);

  const inner = cards.map((card) => (
    <GameCard
      key={card.id}
      cardId={card.id}
      imageUrl={card.image}
      isBack={faceDown}
      isSelected={selectedId === card.id}
      isSelectable={selectable && !card.disabled}
      onClick={() => onSelect?.(card.id)}
      size="fluid"
      width={cardWidth}
      className={cn('shrink-0', card.disabled && 'opacity-40 cursor-not-allowed')}
    />
  ));

  if (variant === 'hand') {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 md:px-4 mt-auto mb-6">
        <div className="overflow-x-auto pb-3 -mx-2 px-2 md:overflow-visible md:pb-0">
          <div
            ref={containerRef}
            className="flex flex-nowrap md:flex-wrap justify-center gap-3 md:gap-5 w-full min-w-min mx-auto"
          >
            {inner}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-7xl mx-auto px-4 mt-auto mb-8"
    >
      {inner}
    </div>
  );
}
