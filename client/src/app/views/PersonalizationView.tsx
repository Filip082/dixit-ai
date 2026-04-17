import React, { useState } from 'react';
import { Coins, Sparkles, Check } from 'lucide-react';
import { Button } from '../components/Button';

const THEMES = [
  { id: '1', name: 'Bajka', price: 0, preview: 'bg-gray-900', accent: 'bg-orange-500' },
  { id: '2', name: 'Przyroda', price: 150, preview: 'bg-yellow-100', accent: 'bg-yellow-500' },
  { id: '3', name: 'Muzyka', price: 200, preview: 'bg-cyan-900', accent: 'bg-cyan-400' },
  { id: '4', name: 'Architektura', price: 500, preview: 'bg-purple-950', accent: 'bg-pink-500' },
  { id: '5', name: 'Technologia', price: 300, preview: 'bg-green-900', accent: 'bg-green-400' },
  { id: '6', name: 'Patriotyzm', price: 1000, preview: 'bg-zinc-950', accent: 'bg-amber-400' },
];

export function PersonalizationView() {
  const [coins] = useState(450);
  const [activeTheme, setActiveTheme] = useState('1');
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['1', '3']);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 relative">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Sparkles className="text-orange-500 hidden md:block" size={40} />
            Personalizacja
          </h1>
          <p className="text-gray-600 font-medium text-lg">Wybierz zestawy tematyczne kart dostepnych podczas rozgrywki</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl shadow-orange-500/10">
          <div className="bg-orange-100 p-2 rounded-xl">
            <Coins className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Twoje Saldo</p>
            <p className="text-3xl font-black text-gray-900">{coins}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {THEMES.map((theme) => {
          const isOwned = ownedThemes.includes(theme.id);
          const isActive = activeTheme === theme.id;
          const canAfford = coins >= theme.price;

          return (
            <div 
              key={theme.id}
              className={`bg-white rounded-[2rem] p-6 border-2 transition-all duration-300 shadow-lg ${isActive ? 'border-orange-500 shadow-orange-500/20 scale-[1.02]' : 'border-gray-100 hover:border-gray-300'}`}
            >
              <div className="w-full aspect-video rounded-2xl overflow-hidden relative mb-6 border border-gray-100 shadow-inner">
                <div className={`absolute inset-0 ${theme.preview}`}></div>
                {/* <div className={`absolute bottom-4 right-4 w-12 h-12 rounded-full ${theme.accent} shadow-lg border-2 border-white/20`}></div> */}
                
                {/* Abstract shapes in preview */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-md"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/10 rotate-45"></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">{theme.name}</h3>
                  {!isOwned && (
                    <span className="flex items-center gap-1.5 font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">
                      <Coins size={16} />
                      {theme.price}
                    </span>
                  )}
                </div>

                {isActive ? (
                  <Button 
                    className="w-full bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100 cursor-default"
                  >
                    <Check size={20} className="mr-2" /> Aktywny
                  </Button>
                ) : isOwned ? (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTheme(theme.id)}
                  >
                    Wybierz
                  </Button>
                ) : (
                  <Button 
                    variant={canAfford ? 'primary' : 'secondary'}
                    className={`w-full ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        setOwnedThemes([...ownedThemes, theme.id]);
                        // Would deduct coins here in real app
                      }
                    }}
                  >
                    {canAfford ? 'Kup Motyw' : 'Brak monet'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}