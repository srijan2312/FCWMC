const fs = require('fs');

const raw = fs.readFileSync('public/quiz.txt', 'utf8');
const blocks = raw.split(/\n\s*\n/).filter(Boolean);

function parseBlock(block) {
  const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const qLine = lines.find(l => /^Q\d+/i.test(l)) || lines[0];
  const question = qLine.replace(/^Q\d+\.?\s*/i, '').trim();
  const options = [];
  let answer = null;

  // Collect explicit option lines (A) ..., B) ..., etc.)
  for (const l of lines) {
    const optMatch = l.match(/^([A-Da-d])[)\.:-]\s*(.+)$/);
    if (optMatch) {
      options[optMatch[1].toUpperCase().charCodeAt(0) - 65] = optMatch[2].trim();
      continue;
    }
    const ansMatch = l.match(/^Answer:\s*([A-Da-d]|\d+)/i);
    if (ansMatch) {
      const a = ansMatch[1].toUpperCase();
      if (/[A-D]/.test(a)) answer = a.charCodeAt(0) - 65;
      else answer = parseInt(a, 10) - 1;
    }
  }

  // Filter out any empty slots and ensure options length
  const finalOptions = options.map(o => (o || '').trim()).filter(Boolean);
  return { question, options: finalOptions, answer };
}

const questions = blocks.map(parseBlock);
console.log(`Parsed ${questions.length} questions. Sample:`);
console.log(JSON.stringify(questions.slice(0,3), null, 2));

// Simulate store
const store = {
  questions,
  current: 0,
  selected: Array(questions.length).fill(null),
  locked: Array(questions.length).fill(false),
  progress: 0,
  selectOption(idx) {
    if (this.locked[this.current]) return;
    this.selected[this.current] = idx;
    this.locked[this.current] = true;
    this.progress = this.selected.filter(v => v !== null).length;
  },
  next() {
    if (this.current < this.questions.length - 1) this.current += 1;
  }
};

// Simulate answering the first 5 questions correctly
for (let i = 0; i < 5 && i < questions.length; i++) {
  const q = questions[i];
  store.current = i;
  store.selectOption(q.answer);
  console.log(`Q${i+1}: selected ${String.fromCharCode(65 + store.selected[i])} (correct ${String.fromCharCode(65 + q.answer)}) locked=${store.locked[i]}`);
}

console.log(`Progress after 5 answers: ${store.progress}/${questions.length}`);

// Move through next 3 questions selecting first option (may be wrong)
for (let i = 5; i < 8 && i < questions.length; i++) {
  store.current = i;
  store.selectOption(0);
  console.log(`Q${i+1}: selected ${String.fromCharCode(65 + store.selected[i])} (correct ${String.fromCharCode(65 + questions[i].answer)}) locked=${store.locked[i]}`);
}
console.log(`Final progress: ${store.progress}/${questions.length}`);

// Summary
const correctCount = store.selected.filter((sel, idx) => sel !== null && sel === questions[idx].answer).length;
const attempted = store.selected.filter(sel => sel !== null).length;
console.log(`Correct: ${correctCount}, Attempted: ${attempted}, Total: ${questions.length}`);
