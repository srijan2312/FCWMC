import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeout: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeout, isActive }) => {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (!isActive) return;
    setTime(duration);
    const interval = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, duration, onTimeout]);

  return (
    <div className="w-full flex justify-end mb-2">
      <span className="px-3 py-1 rounded-full bg-cyan-900 text-white font-bold text-lg shadow-md">
        {time}s
      </span>
    </div>
  );
};

export default Timer;
