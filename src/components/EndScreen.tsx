import React from 'react';

interface EndScreenProps {
  score: number;
  attempted: number;
  incorrect: number;
  total: number;
  onRetry: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, attempted, incorrect, total, onRetry }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="max-w-lg w-full text-center py-12 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-black mb-4">Quiz Complete</h2>
        <div className="text-xl font-semibold mb-2 text-black">
          Score: <span className="font-bold">{score}</span> / {total}
        </div>
        <div className="text-lg text-gray-800 mb-2">
          Attempted: <span className="font-bold">{attempted}</span> / {total}
        </div>
        <div className="text-lg mb-6" style={{ color: '#e53935' }}>
          Incorrect: <span className="font-bold">{incorrect}</span>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-8 py-3 rounded-xl bg-[#2563eb] text-white font-bold shadow-lg hover:bg-[#1d4ed8] transition-all text-lg"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
