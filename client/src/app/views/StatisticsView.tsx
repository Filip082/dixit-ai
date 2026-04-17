import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';

const TOP_PLAYERS = [
  { rank: 1, name: 'DragonSlayer99', wins: 1450, avatar: 'DR' },
  { rank: 2, name: 'AliceInWonder', wins: 1205, avatar: 'AL' },
  { rank: 3, name: 'BobTheBuilder', wins: 980, avatar: 'BO' },
  { rank: 4, name: 'CharlieChaplin', wins: 875, avatar: 'CH' },
  { rank: 5, name: 'EveHacker', wins: 840, avatar: 'EV' },
];

const CURRENT_USER = {
  rank: 142,
  name: 'PlayerOne',
  wins: 156,
  avatar: 'P1',
};

export function StatisticsView() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 relative">
      <div className="text-center space-y-4 mb-12 relative">
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-500 mb-6 rotate-3 shadow-xl">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Globalny Ranking
        </h1>
        <p className="text-gray-500 font-medium text-lg">Top 5 graczy z największą liczbą wygranych</p>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        
        <div className="flex flex-col gap-4 relative z-10">
          {TOP_PLAYERS.map((player) => (
            <div 
              key={player.rank}
              className={`flex items-center gap-6 p-4 rounded-2xl transition-all hover:scale-[1.01] ${
                player.rank === 1 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 shadow-sm' :
                player.rank === 2 ? 'bg-gray-50 border border-gray-200' :
                player.rank === 3 ? 'bg-stone-50 border border-stone-200' : 'bg-white border border-gray-100'
              }`}
            >
              <div className="w-12 text-center flex justify-center">
                {player.rank === 1 ? <Medal size={32} className="text-yellow-500 drop-shadow-sm" /> :
                 player.rank === 2 ? <Medal size={28} className="text-gray-400 drop-shadow-sm" /> :
                 player.rank === 3 ? <Medal size={28} className="text-amber-700 drop-shadow-sm" /> :
                 <span className="text-2xl font-black text-gray-400">#{player.rank}</span>}
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                {player.avatar}
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg ${player.rank === 1 ? 'text-orange-600' : 'text-gray-900'}`}>
                  {player.name}
                </h3>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-2xl font-black text-gray-900">{player.wins}</span>
                  <Star size={16} className="text-orange-400 fill-orange-400 mb-1" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wygrane</p>
              </div>
            </div>
          ))}

          <div className="w-full flex justify-center py-2">
            <div className="w-1 bg-gray-200 rounded-full h-8" />
          </div>

          <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-900 text-white shadow-xl border border-gray-800">
            <div className="w-12 text-center flex justify-center">
              <span className="text-xl font-black text-gray-400">#{CURRENT_USER.rank}</span>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-gray-800 shadow-inner flex items-center justify-center text-lg font-bold">
              {CURRENT_USER.avatar}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                {CURRENT_USER.name} <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">Ty</span>
              </h3>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-2xl font-black text-white">{CURRENT_USER.wins}</span>
                <Star size={16} className="text-orange-400 fill-orange-400 mb-1" />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wygrane</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}