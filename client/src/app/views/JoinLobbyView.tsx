import React, { useState } from 'react';
import { DoorOpen, ArrowRight, Users, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const LOBBY_PLAYERS = [
  { id: 1, name: 'PlayerOne', isHost: true },
  { id: 2, name: 'AliceInWonder', isHost: false },
  { id: 3, name: 'Ty', isHost: false },
];

export function JoinLobbyView() {
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      setJoined(true);
    }
  };

  if (joined) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 relative">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 transform transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-6">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Poczekalnia: {code}
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Oczekiwanie na rozpoczęcie gry przez Hosta...
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Users size={20} className="text-gray-400" /> Dołączyli Gracze
            </h3>
            <div className="bg-white border border-gray-100 shadow-inner rounded-2xl p-2 space-y-2">
              {LOBBY_PLAYERS.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm">
                      {player.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-900">{player.name}</span>
                  </div>
                  {player.name === 'Ty' && (
                    <span className="text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded-md uppercase tracking-wider">
                      To Ty
                    </span>
                  )}
                  {player.isHost && player.name !== 'Ty' && (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 relative">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center space-y-10 transform transition-all duration-300">
        
        <div className="mx-auto w-24 h-24 bg-gray-900 rounded-[2rem] flex items-center justify-center text-orange-400 mb-6 rotate-[12deg] shadow-2xl shadow-gray-900/30">
          <DoorOpen size={48} className="-ml-1" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Dołącz do gry
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Wprowadź 6-znakowy kod od znajomego, aby dołączyć do rozgrywki.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input 
              autoFocus
              maxLength={6}
              placeholder="np. A9X2FB" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-20 text-center text-4xl font-black tracking-[0.5em] uppercase placeholder:text-gray-300 placeholder:font-black rounded-2xl border-2 shadow-inner"
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full flex items-center justify-center gap-3 h-16 rounded-2xl text-xl shadow-xl shadow-orange-500/20"
            disabled={code.length < 6}
          >
            Dołącz do gry <ArrowRight size={24} />
          </Button>
        </form>

      </div>
    </div>
  );
}