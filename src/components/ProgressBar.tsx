import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-md">
      <div
        className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md transition-all"
        style={{ width: `${progress}%` }}
      />
      <span className="absolute w-full text-center text-xs font-bold text-gray-700">
        {progress}%
      </span>
    </div>
  );
};

export default ProgressBar;
