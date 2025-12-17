
import React from 'react';

interface LikertScaleProps {
  questionId: number;
  value: number | undefined;
  onChange: (value: number) => void;
  isActive: boolean;
}

const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange, isActive }) => {
  // 左侧为 3 (接受)，右侧为 -3 (不接受)
  // 这样 3 对应左侧绿色文字，-3 对应右侧紫色文字
  const options = [3, 2, 1, 0, -1, -2, -3];
  
  const getCircleSize = (val: number) => {
    const base = 22;
    return base + Math.abs(val) * 6;
  };

  const getColor = (val: number) => {
    if (val > 0) return 'border-green-500 hover:bg-green-500/20';
    if (val < 0) return 'border-purple-500 hover:bg-purple-500/20';
    return 'border-gray-500 hover:bg-gray-500/20';
  };

  const getActiveColor = (val: number) => {
    if (val > 0) return 'bg-green-500 border-green-500';
    if (val < 0) return 'bg-purple-500 border-purple-500';
    return 'bg-gray-500 border-gray-500';
  };

  return (
    <div className={`flex items-center justify-between w-full max-w-2xl mx-auto py-8 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
      <span className="text-green-500 font-bold text-base md:text-lg whitespace-nowrap tracking-widest">接受</span>
      
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-grow px-6">
        {options.map((opt) => {
          const isSelected = value === opt;
          const size = getCircleSize(opt);
          
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{ width: `${size}px`, height: `${size}px` }}
              className={`rounded-full border-2 transition-all duration-300 transform active:scale-90 flex items-center justify-center
                ${isSelected ? getActiveColor(opt) : getColor(opt)}
              `}
              aria-label={`Option ${opt}`}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg animate-pulse" />}
            </button>
          );
        })}
      </div>

      <span className="text-purple-500 font-bold text-base md:text-lg whitespace-nowrap tracking-widest">不接受</span>
    </div>
  );
};

export default LikertScale;
