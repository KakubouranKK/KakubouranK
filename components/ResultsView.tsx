
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Chapter } from '../types';

interface ResultsViewProps {
  chapters: Chapter[];
  answers: Record<number, number>;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ chapters, answers, onReset }) => {
  // Summary data for the histogram
  const summaryData = chapters.map(chapter => {
    const scores = chapter.questions.map(q => answers[q.id] || 0);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = scores.length > 0 ? sum / scores.length : 0;
    // avg 范围是 -3 到 3
    // 归一化到 0-100: (avg + 3) / 6 * 100
    const normalized = Math.round(((avg + 3) / 6) * 100);
    
    return {
      name: chapter.title.includes('：') ? chapter.title.split('：')[1] : chapter.title,
      score: normalized,
      avgScore: avg.toFixed(1)
    };
  });

  const getScoreLabel = (score: number) => {
    if (score === 3) return { text: '极高接受', color: 'text-green-400' };
    if (score === 2) return { text: '高度接受', color: 'text-green-500' };
    if (score === 1) return { text: '轻微接受', color: 'text-green-600' };
    if (score === 0) return { text: '中立', color: 'text-neutral-500' };
    if (score === -1) return { text: '轻微不接受', color: 'text-purple-600' };
    if (score === -2) return { text: '高度不接受', color: 'text-purple-500' };
    if (score === -3) return { text: '极高不接受', color: 'text-purple-400' };
    return { text: '未评价', color: 'text-neutral-700' };
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center p-6 pb-24 selection:bg-green-500/30">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mt-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tighter uppercase">探索报告总结</h1>
          <p className="text-neutral-500 text-lg font-medium">基于您的 80 项选择生成的深度欲望图谱</p>
        </div>

        {/* Histogram Section - Overall Summary */}
        <div className="bg-neutral-800/30 backdrop-blur-md p-8 rounded-3xl border border-white/5 mb-12 shadow-2xl animate-in fade-in zoom-in duration-700">
          <h2 className="text-xl font-bold mb-8 text-neutral-300 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
            维度倾向性 (概览)
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#555" 
                  fontSize={12}
                  tick={{fill: '#888'}}
                  axisLine={{stroke: '#333'}}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#555" 
                  domain={[0, 100]} 
                  tickFormatter={(val) => `${val}%`}
                  axisLine={{stroke: '#333'}}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={50} animationDuration={1500}>
                  {summaryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.score > 70 ? '#10b981' : (entry.score > 40 ? '#6366f1' : '#a855f7')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Questions List Section */}
        <div className="space-y-12">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="bg-neutral-800/20 p-8 rounded-3xl border border-white/5 shadow-inner">
              <h2 className="text-2xl font-black mb-8 text-white border-b border-neutral-700 pb-4 flex justify-between items-center">
                <span>{chapter.title}</span>
                <span className="text-xs font-normal text-neutral-500 bg-neutral-800 px-3 py-1 rounded-full">共 {chapter.questions.length} 题</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {chapter.questions.map((q) => {
                  const score = answers[q.id] ?? 0;
                  const label = getScoreLabel(score);
                  return (
                    <div 
                      key={q.id} 
                      className="flex items-center justify-between py-4 border-b border-neutral-800/50 group hover:bg-white/5 transition-colors px-2 rounded-lg"
                    >
                      <div className="flex flex-col pr-4">
                        <span className="text-neutral-400 text-sm font-semibold group-hover:text-white transition-colors">
                          {q.text}
                        </span>
                      </div>
                      <div className="flex flex-col items-end min-w-[80px]">
                        <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${label.color}`}>
                          {label.text}
                        </span>
                        <div className="flex gap-0.5">
                          {[3, 2, 1, 0, -1, -2, -3].map((v) => (
                            <div 
                              key={v}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${v === score ? (score > 0 ? 'bg-green-500 scale-125' : (score < 0 ? 'bg-purple-500 scale-125' : 'bg-neutral-400 scale-125')) : 'bg-neutral-800'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-neutral-500 italic font-medium">“ 诚实地面对自我，是探索的第一步 ”</p>
          <button 
            onClick={onReset}
            className="w-full max-w-md py-6 bg-white text-black font-black rounded-full hover:bg-neutral-200 transition-all uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 text-lg"
          >
            重新开始探索之旅
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
