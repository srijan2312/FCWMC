import React from 'react';

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => (
  <div className="w-full h-3 rounded-full bg-white/20 mt-4 mb-8">
    <div
      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-600 to-cyan-900 transition-all duration-500"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

export default ProgressBar;
