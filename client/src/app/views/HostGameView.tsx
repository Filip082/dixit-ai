import React, { useState } from 'react';
import { Copy, Users, Flag, Trophy, Settings2, Play } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const JOINED_PLAYERS = [
  { id: 1, name: 'PlayerOne', isHost: true },
  { id: 2, name: 'AliceInWonder', isHost: false },
  { id: 3, name: 'BobTheBuilder', isHost: false },
];

export function HostGameView() {
  const [players, setPlayers] = useState(4);
  const [endCondition, setEndCondition] = useState<'points' | 'rounds'>('points');
  const [endLimit, setEndLimit] = useState(30);
  const lobbyCode = "A 9 X 2 F B";

  const handleCopy = () => {
    navigator.clipboard.writeText(lobbyCode.replace(/ /g, ''));
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 relative">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-10">
        
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white mb-6 rotate-[-10deg] shadow-lg">
            <Settings2 size={32} className="text-orange-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Ustawienia Lobby
          </h1>
          <p className="text-gray-500 font-medium">Udostępnij ten kod znajomym, aby mogli dołączyć.</p>
        </div>

        {/* Lobby Code Display */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent pointer-events-none" />
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Kod Lobby</p>
          <div className="flex justify-center items-center gap-4">
            <span className="text-5xl font-black text-gray-900 tracking-[0.2em]">{lobbyCode}</span>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white border border-orange-200 rounded-xl text-orange-600 hover:bg-orange-100 transition-colors shadow-sm active:scale-95"
              title="Skopiuj kod"
            >
              <Copy size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Players Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <Users className="text-gray-400" />
                Maksymalna liczba graczy
              </label>
              <span className="bg-gray-100 text-gray-900 px-4 py-1 rounded-full font-black text-xl">
                {players}
              </span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="8" 
              value={players}
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600"
            />
            <div className="flex justify-between text-xs font-bold text-gray-400">
              <span>3</span>
              <span>8</span>
            </div>
          </div>

          {/* End Condition Toggle */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-bold text-gray-900 text-lg mb-2">
              <Flag className="text-gray-400" />
              Warunek końca gry
            </label>
            <div className="bg-gray-100 p-1.5 rounded-2xl flex w-full relative">
              <div 
                className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0 ${
                  endCondition === 'rounds' ? 'translate-x-full' : ''
                }`}
              />
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold z-10 transition-colors ${
                  endCondition === 'points' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setEndCondition('points')}
              >
                <Trophy size={18} /> Limit Punktów
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold z-10 transition-colors ${
                  endCondition === 'rounds' ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setEndCondition('rounds')}
              >
                <Flag size={18} /> Limit Rund
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl">
              <span className="font-medium text-gray-700">
                {endCondition === 'points' ? 'Wymagane punkty do wygranej:' : 'Liczba rund do zagrania:'}
              </span>
              <Input 
                type="number" 
                value={endLimit}
                onChange={(e) => setEndLimit(parseInt(e.target.value) || 0)}
                className="w-24 text-center font-bold text-lg h-10"
              />
            </div>
          </div>

          {/* Joined Players */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-bold text-gray-900 text-lg">
              Dołączyli Gracze ({JOINED_PLAYERS.length}/{players})
            </label>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-2 space-y-2">
              {JOINED_PLAYERS.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {player.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-900">{player.name}</span>
                  </div>
                  {player.isHost && (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase">
                      Host
                    </span>
                  )}
                </div>
              ))}
              {Array.from({ length: players - JOINED_PLAYERS.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <span className="font-medium text-gray-400 italic">Oczekiwanie na gracza...</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full flex items-center justify-center gap-3 py-8 rounded-2xl text-xl shadow-xl shadow-orange-500/20">
          <Play className="fill-white" size={24} /> Rozpocznij Grę
        </Button>
      </div>
    </div>
  );
}