import { create } from 'zustand';

export interface QuizQuestion {
	question: string;
	options: string[];
	answer: number;
}

interface QuizState {
	questions: QuizQuestion[];
	current: number;
	selected: (number | null)[];
	locked: boolean[];
	progress: number;
		setQuestions: (questions: QuizQuestion[]) => void;
		selectOption: (optionIdx: number) => void;
	next: () => void;
	prev: () => void;
	reset: () => void;
	reattempt: () => void;
	setCurrentQuestion: (idx: number) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
	questions: [],
	current: 0,
	selected: [],
	locked: [],
	progress: 0,
	setQuestions: (questions: QuizQuestion[]) => set({
		questions,
		selected: Array(questions.length).fill(null),
		locked: Array(questions.length).fill(false),
		current: 0,
		progress: 0,
	}),
	selectOption: (optionIdx: number) => {
		const { current, selected, locked } = get();
		if (locked[current]) return;
		const newSelected = [...selected];
		newSelected[current] = optionIdx;
		const newLocked = [...locked];
		newLocked[current] = true;
		set({
			selected: newSelected,
			locked: newLocked,
			progress: newSelected.filter((v) => v !== null).length,
		});
	},
	next: (): void => {
		const { current, questions } = get();
		if (current < questions.length - 1) set({ current: current + 1 });
	},
	prev: (): void => {
		const { current } = get();
		if (current > 0) set({ current: current - 1 });
	},
	reset: (): void => {
		const { questions } = get();
		set({
			selected: Array(questions.length).fill(null),
			locked: Array(questions.length).fill(false),
			current: 0,
			progress: 0,
		});
	},
	reattempt: (): void => {
		// Only unlock and clear answers, keep question order
		const { questions } = get();
		set({
			selected: Array(questions.length).fill(null),
			locked: Array(questions.length).fill(false),
			current: 0,
			progress: 0,
		});
	},
	setCurrentQuestion: (idx) => set({ current: idx }),
}));
