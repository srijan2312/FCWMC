"use client";
import React, { useEffect } from 'react';
import OptionButton from './OptionButton';
import { useRef } from 'react';
// import Timer from './Timer';
import EndScreen from './EndScreen';
import { useQuizStore } from '../store/quizStore';
import { parseQuizText } from '../utils/quizParser';
import confetti from 'canvas-confetti';

const fetchQuizData = async () => {
  try {
    const res = await fetch('/quiz.txt');
    if (!res.ok) {
      console.error('Failed to fetch quiz.txt:', res.status, res.statusText);
      return [];
    }
    const text = await res.text();
    const parsed = parseQuizText(text);
    if (!parsed.length) {
      console.error('Quiz parser returned no questions.');
    }
    return parsed;
  } catch (err) {
    console.error('Error fetching quiz.txt:', err);
    return [];
  }
};

const Quiz: React.FC = () => {
  const {
    questions,
    current,
    selected,
    locked,
    progress,
    setQuestions,
    selectOption,
    next,
    prev,
    reattempt,
    setCurrentQuestion,
  } = useQuizStore();
  const [showEndScreen, setShowEndScreen] = React.useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('quiz-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setQuestions(data.questions);
        if (typeof data.current === 'number') {
          if (useQuizStore.getState().current !== data.current) {
            useQuizStore.setState({ current: data.current });
          }
        }
        if (Array.isArray(data.selected)) {
          useQuizStore.setState({ selected: data.selected });
        }
        if (Array.isArray(data.locked)) {
          useQuizStore.setState({ locked: data.locked });
        }
        if (typeof data.progress === 'number') {
          useQuizStore.setState({ progress: data.progress });
        }
  } catch {
        fetchQuizData().then((parsed) => {
          setQuestions(parsed);
        });
      }
    } else {
      fetchQuizData().then((parsed) => {
        setQuestions(parsed);
      });
    }
  }, [setQuestions]);

  useEffect(() => {
    if (questions.length) {
      localStorage.setItem('quiz-progress', JSON.stringify({
        questions,
        current,
        selected,
        locked,
        progress,
      }));
    }
  }, [questions, current, selected, locked, progress]);

  if (!questions.length) return (
    <div className="text-center text-2xl mt-20">
      Loading quiz...<br />
      <span className="text-red-400 text-base">If this persists, check the browser console for errors and ensure public/quiz.txt exists and is formatted correctly.</span>
    </div>
  );

  const q = questions[current];
  const selectedIdx = selected[current];
  const isLocked = locked[current];
  // Removed unused variable 'completed' for ESLint compliance

  const handleSelect = (idx: number) => {
    if (!isLocked) {
      selectOption(idx);
      if (idx === q.answer) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      }
    }
  };

  const handleRetry = () => {
    localStorage.removeItem('quiz-progress');
    // Randomize questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setShowEndScreen(false);
    reattempt();
    setCurrentQuestion(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      {/* Top right corner reset button */}
      <button
        className="absolute top-6 right-6 py-2 px-5 rounded bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition z-20"
        onClick={handleRetry}
        aria-label="Reset Quiz"
      >
        Reset Quiz
      </button>
      <main className="flex flex-col items-center w-full max-w-3xl mx-auto px-2">
        {/* Progress and question count */}
        <div className="w-full flex flex-col items-center mt-8 mb-4">
          <div className="w-full flex flex-row items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-700">Question {current + 1} / {questions.length}</span>
            <span className="text-sm text-gray-400">Left: {questions.length - (current + 1)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        {/* Main quiz card */}
        <div className="bg-white rounded-2xl shadow p-8 w-full max-w-xl flex flex-col items-center">
          <div className="mb-6 text-xl font-bold text-gray-900 text-center leading-snug">
            {q.question}
          </div>
          <div className="flex flex-col gap-3 w-full">
            {q.options.map((opt, idx) => (
              <OptionButton
                key={idx}
                option={opt}
                isSelected={selectedIdx === idx}
                isCorrect={idx === q.answer}
                isLocked={isLocked}
                onClick={() => handleSelect(idx)}
                showFeedback={isLocked}
                theme={idx}
              />
            ))}
          </div>
          {/* Navigation buttons */}
          <div className="w-full flex items-center justify-between mt-8">
            <button
              className="py-2 px-6 rounded bg-gray-200 text-gray-700 font-semibold text-base shadow hover:bg-gray-300 transition"
              onClick={prev}
              disabled={current === 0}
            >
              Prev
            </button>
            {current === questions.length - 1 ? (
              <button
                className="py-2 px-6 rounded bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition"
                onClick={() => setShowEndScreen(true)}
              >
                Submit
              </button>
            ) : (
              <button
                className="py-2 px-6 rounded bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition"
                onClick={next}
              >
                Next
              </button>
            )}
          </div>
        </div>
        {/* Number panel */}
        <div className="mt-8 w-full max-w-xl mx-auto">
          <div className="mb-2 text-base font-semibold text-gray-700">Jump to Question:</div>
          <div className="grid grid-cols-12 gap-2">
            {questions.map((q, idx) => {
              let bg = 'bg-gray-100 text-gray-700';
              if (selected[idx] !== null && selected[idx] !== undefined) {
                if (selected[idx] === q.answer) {
                  bg = 'bg-green-200 text-green-800';
                } else {
                  bg = 'bg-red-200 text-red-800';
                }
              }
              if (idx === current) {
                bg = 'bg-blue-500 text-white';
              }
              return (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded ${bg} font-bold flex items-center justify-center transition-all duration-200`}
                  onClick={() => setCurrentQuestion(idx)}
                  aria-label={`Go to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
      {/* EndScreen overlay */}
      {showEndScreen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <EndScreen
            score={selected.filter((sel, idx) => sel === questions[idx].answer).length}
            attempted={selected.filter(sel => sel !== null && sel !== undefined).length}
            incorrect={selected.filter(sel => sel !== null && sel !== undefined).length - selected.filter((sel, idx) => sel === questions[idx].answer).length}
            total={questions.length}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
}

export default Quiz;
