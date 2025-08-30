import { parseQuizText, QuizQuestion } from '../utils/quizParser';
import fs from 'fs';
import path from 'path';

export function getQuizData(): QuizQuestion[] {
  // For demo, load synchronously from quiz.txt
  const filePath = path.join(process.cwd(), 'quiz.txt');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return parseQuizText(raw);
}
