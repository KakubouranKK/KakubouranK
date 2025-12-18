
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Chapter, Question } from '../types';

interface ResultsViewProps {
  chapters: Chapter[];
  answers: Record<number, number>;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ chapters, answers, onReset }) => {
  // 定义分类配置
  const categoryConfigs = [
    { value: 3, label: '极高接受', color: '#10b981', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
    { value: 2, label: '高度接受', color: '#34d399', bgColor: 'bg-green-400/10', borderColor: 'border-green-400/30' },
    { value: 1, label: '轻微接受', color: '#6ee7b7', bgColor: 'bg-green-300/10', borderColor: 'border-green-300/30' },
    { value: 0, label: '中立', color: '#9ca3af', bgColor: 'bg-neutral-500/10', borderColor: 'border-neutral-500/30' },
    { value: -1, label: '轻微不接受', color: '#c084fc', bgColor: 'bg-purple-400/10', borderColor: 'border-purple-400/30' },
    { value: -2, label: '高度不接受', color: '#a855f7', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    { value: -3, label: '极高不接受', color: '#9333ea', bgColor: 'bg-purple-600/10', borderColor: 'border-purple-600/30' },
  ];

  // 将所有问题按分值归类
  const groupedQuestions = useMemo(() => {
    const allQuestions: Question[] = chapters.flatMap(c => c.questions);
    const groups: Record<number, Question[]> = { 3: [], 2: [], 1: [], 0: [], [-1]: [], [-2]: [], [-3]: [] };
    
    allQuestions.forEach(q => {
      const score = answers[q.id] ?? 0;
      if (groups[score]) {
        groups[score].push(q);
      }
    });
    return groups;
  }, [chapters, answers]);

  // 汇总 80 个问题的回答分布（用于图表）
  const distributionData = categoryConfigs.map(cat => {
    const count = groupedQuestions[cat.value].length;
    return {
      name: cat.label,
      value: cat.value,
      count: count,
      color: cat.color,
      percentage: Math.round((count / 80) * 100)
    };
  });

  // 计算整体倾向
  const allScores = Object.values(answers) as number[];
  const totalScore = allScores.reduce((acc: number, curr: number) => acc + curr, 0);
  const avgScore = allScores.length > 0 ? totalScore / allScores.length : 0;
  
  const getOverallTendency = (avg: number) => {
    if (avg > 1.5) return "开放探索者";
    if (avg > 0.5) return "温和实践者";
    if (avg > -0.5) return "平衡中立者";
    if (avg > -1.5) return "谨慎观察者";
    return "严谨守望者";
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center p-4 md:p-8 pb-32 selection:bg-green-500/30">
      <div className="max-w-[1400px] w-full">
        {/* Header Section */}
        <div className="text-center mt-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black mb-4 text-white tracking-tighter uppercase italic">
            探索报告<span className="text-green-500">总结</span>
          </h1>
          <p className="text-neutral-500 text-lg font-medium tracking-widest">PERSONAL DESIRE SPECTRUM REPORT</p>
        </div>

        {/* Top Summary: Tendency & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Overall Profile Card */}
          <div className="lg:col-span-4 bg-neutral-800/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col justify-center text-center relative overflow-hidden h-full min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-green-500 to-purple-500 opacity-30"></div>
            <span className="text-[10px] font-bold text-neutral-500 tracking-[0.4em] uppercase mb-6 block">核心属性 / CORE ATTRIBUTE</span>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              {getOverallTendency(avgScore)}
            </h2>
            <div className="h-px w-20 bg-neutral-700 mx-auto mb-6"></div>
            <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
              平均接受指数: <span className={`font-bold ${avgScore >= 0 ? 'text-green-400' : 'text-purple-400'}`}>{avgScore.toFixed(2)}</span>
            </p>
            <p className="text-neutral-500 text-xs mt-4 px-6">
              在大数据谱系中，这代表您对亲密关系的探索持{avgScore >= 0 ? '积极且开放' : '审慎且专注'}的态度。每一个选择都构成了您独特的感官边界。
            </p>
          </div>

          {/* Chart Card */}
          <div className="lg:col-span-8 bg-neutral-800/20 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl h-full min-h-[400px]">
            <h2 className="text-sm font-bold mb-8 text-neutral-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
              分值分布直方图 / DISTRIBUTION
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#444" 
                    fontSize={12}
                    fontWeight="bold"
                    tick={{fill: '#666'}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={45} animationDuration={1500}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                    <LabelList dataKey="count" position="top" fill="#888" style={{ fontSize: '12px', fontWeight: 'bold' }} offset={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Spectrum Grid - As requested by image */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-black text-white whitespace-nowrap">探索明细光谱</h2>
            <div className="h-px bg-neutral-800 flex-grow"></div>
            <span className="text-neutral-600 text-xs font-bold uppercase tracking-widest">SPECTRUM DETAILS</span>
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-start">
            {categoryConfigs.map((cat) => {
              const questions = groupedQuestions[cat.value];
              return (
                <div key={cat.value} className={`rounded-3xl border ${cat.borderColor} ${cat.bgColor} flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-black/20`}>
                  {/* Column Header */}
                  <div className="py-4 px-4 text-center border-b border-white/5 backdrop-blur-md">
                    <h3 className="text-sm font-black tracking-tighter mb-1" style={{ color: cat.color }}>{cat.label}</h3>
                    <p className="text-[10px] text-neutral-500 font-bold opacity-60 uppercase">{questions.length} ITEMS</p>
                  </div>
                  
                  {/* Items List */}
                  <div className="p-3 flex flex-col gap-2 min-h-[100px]">
                    {questions.length > 0 ? (
                      questions.map((q) => (
                        <div 
                          key={q.id} 
                          className="bg-neutral-900/40 border border-white/5 py-3 px-4 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all cursor-default"
                        >
                          {q.text}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-20 italic text-[10px] text-neutral-500">
                        暂无选项
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-32 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center">
            <div className="flex gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse delay-75"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-150"></div>
            </div>
            <p className="text-neutral-500 italic font-medium tracking-wide">“ 每一个诚实的选择，都是对自我边界的一次拓荒 ”</p>
          </div>

          <button 
            onClick={onReset}
            className="group relative w-full max-w-md py-6 bg-white text-black font-black rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 text-lg shadow-[0_30px_60px_-12px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 tracking-[0.3em] uppercase">重新探索</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
          
          <div className="text-[10px] text-neutral-600 font-bold tracking-[0.5em] uppercase mt-10">
            End of Exploration Report
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
