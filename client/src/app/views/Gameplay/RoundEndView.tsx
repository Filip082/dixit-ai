import React from 'react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '../../components/Button';
import { Trophy, Coins } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export function RoundEndView() {
  const navigate = useNavigate();
  const { players } = useGameStore();

  const winner = players.length > 0 
    ? [...players].sort((a, b) => b.points - a.points)[0] 
    : { name: 'Brak graczy', points: 0 };

  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="bg-orange-500 text-white rounded-full px-8 py-3 flex items-center gap-4 shadow-xl shadow-orange-500/30 border-4 border-orange-400 text-center">
        <Trophy size={28} className="text-yellow-300 hidden sm:block" />
        <h1 className="text-2xl md:text-3xl font-black tracking-widest uppercase">
          Wygrywa: {winner.name}
        </h1>
        <Trophy size={28} className="text-yellow-300 hidden sm:block" />
      </div>

      <div className="w-full h-[50vh] bg-white rounded-[2rem] shadow-xl p-8 border-2 border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={players} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontWeight: 'bold' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontWeight: 'bold' }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="points" radius={[8, 8, 8, 8]} barSize={60}>
              {players.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-2 w-full max-w-md">
        <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
          Twoje punkty: {players.find(p => p.name === 'PlayerOne')?.points || 0}
        </div>
        <div className="flex items-center gap-3 text-3xl font-black text-orange-400">
          <span>+{players.find(p => p.name === 'PlayerOne')?.points || 0} monet</span>
          <Coins size={32} />
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={() => navigate('/menu')}
        className="w-full max-w-md h-16 text-xl shadow-lg mt-4"
      >
        Wróć do menu
      </Button>
    </div>
  );
}