import React from 'react';
import { motion } from 'framer-motion';

interface SidebarNavProps {
  total: number;
  current: number;
  answered: boolean[];
  onSelect: (idx: number) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ total, current, answered, onSelect }) => (
  <nav className="flex flex-col items-center gap-2 py-8">
    {Array.from({ length: total }).map((_, idx) => (
      <motion.button
        key={idx}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        animate={current === idx ? { boxShadow: '0 0 12px 4px #38bdf8', scale: 1.15 } : { scale: 1 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
          ${current === idx ? 'bg-cyan-400 text-white shadow-lg animate-pulse' : 'bg-white/20 text-cyan-700'}
          ${answered[idx] ? 'border-2 border-green-400' : 'border border-white/30'}
        `}
        onClick={() => onSelect(idx)}
        aria-label={`Go to question ${idx + 1}`}
      >
        {idx + 1}
      </motion.button>
    ))}
  </nav>
);

export default SidebarNav;
