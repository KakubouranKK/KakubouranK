
import React from 'react';

interface ProgressHeaderProps {
  current: number;
  total: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="bg-neutral-800 h-1 w-full">
        <div 
          className="bg-green-500 h-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-end p-2 px-4">
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
          进度: {percentage}% ({current}/{total})
        </span>
      </div>
    </div>
  );
};

export default ProgressHeader;
