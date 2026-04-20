import React from 'react';
import { TimerBox } from '../../components/GameplayComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'PlayerOne', points: 24, fill: '#f97316' }, // orange-500
  { name: 'AliceInWonder', points: 18, fill: '#3b82f6' }, // blue-500
  { name: 'BobTheBuilder', points: 12, fill: '#10b981' }, // green-500
  { name: 'CharlieChaplin', points: 10, fill: '#8b5cf6' }, // purple-500
];

export function RoundScoreView() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-4xl mx-auto py-8 px-4">
      <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-gray-200 shadow-sm mb-12">
        <TimerBox seconds={5} />
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Punkty do zdobycia: 30
        </h2>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      <div className="w-full h-[60vh] bg-white rounded-[2rem] shadow-xl p-8 border-2 border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}