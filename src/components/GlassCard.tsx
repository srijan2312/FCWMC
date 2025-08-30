import React from 'react';

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div
    className={`rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 p-6 ${className}`}
    style={{
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      borderRadius: '1.5rem',
      border: '1px solid rgba(255,255,255,0.18)',
    }}
  >
    {children}
  </div>
);

export default GlassCard;
