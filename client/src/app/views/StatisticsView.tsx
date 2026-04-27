import React, { useEffect } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function StatisticsView() {
  const { me, globalRanking } = useGameStore();

  const userRank = me?.stats?.rank || 999;
  const userWins = me?.stats?.gamesWon || 0;
  const userPlayed = me?.stats?.gamesPlayed || 0;
  const userPoints = me?.stats?.totalPoints || 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      <div className="text-center space-y-4 mb-12 relative">
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-500 mb-6 rotate-3 shadow-xl">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Globalny Ranking
        </h1>
        <p className="text-gray-500 font-medium text-lg">Twoje postępy i najlepsi gracze</p>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Rozegrane Gry', value: userPlayed, icon: Star, color: 'text-blue-500' },
          { label: 'Wygrane Partii', value: userWins, icon: Trophy, color: 'text-orange-500' },
          { label: 'Suma Punktów', value: userPoints, icon: Medal, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center gap-2">
            <stat.icon className={stat.color} size={32} />
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        
        <div className="flex flex-col gap-4 relative z-10">
          {globalRanking.map((player) => (
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
                {player.avatar || player.name.substring(0, 2).toUpperCase()}
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
              <span className="text-xl font-black text-gray-400">#{userRank}</span>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-gray-800 shadow-inner flex items-center justify-center text-lg font-bold">
              {me?.username?.substring(0, 2).toUpperCase() || '??'}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                {me?.username || 'Ty'} <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-md uppercase font-bold tracking-wider">Ty</span>
              </h3>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-2xl font-black text-white">{userWins}</span>
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