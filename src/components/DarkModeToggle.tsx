import React from 'react';

const DarkModeToggle: React.FC = () => {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/30 dark:bg-black/30 shadow-lg hover:scale-110 transition-all"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <span className="text-yellow-400 text-2xl">🌙</span>
      ) : (
        <span className="text-cyan-700 text-2xl">☀️</span>
      )}
    </button>
  );
};

export default DarkModeToggle;
