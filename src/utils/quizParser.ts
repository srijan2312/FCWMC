// quizParser.ts
// Utility to parse quiz.txt into structured question objects

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export function parseQuizText(raw: string): QuizQuestion[] {
  // Split by double newlines (handles Windows and Unix)
  const blocks = raw.split(/\r?\n\r?\n/);
  const questions: QuizQuestion[] = [];
  let id = 1;
  for (const block of blocks) {
    // Each block should contain question, 4 options, and answer
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 6) continue;
    // Question line (allow Q1. or no prefix)
    let question = lines[0].replace(/^Q\d+\.\s*/, '');
    // Options
    let options: string[] = [];
    for (let j = 1; j <= 4; j++) {
      const optMatch = lines[j].match(/^[A-D][).]\s*(.*)$/);
      if (optMatch) {
        options.push(optMatch[1]);
      } else {
        options.push(lines[j]); // fallback
      }
    }
    // Answer line
    let answerIdx = -1;
    const ansMatch = lines[5].match(/^Answer:\s*([A-D])/);
    if (ansMatch) {
      answerIdx = 'ABCD'.indexOf(ansMatch[1]);
    }
    if (question && options.length === 4 && answerIdx !== -1) {
      questions.push({ id, question: question.trim(), options, answer: answerIdx });
      id++;
    }
  }
  return questions;
}
