import re

def parse_and_rewrite_quiz(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    i = 0
    qnum = 1
    while i < len(lines):
        line = lines[i].strip()
        # Find question start
        if re.match(r'^(Q\d+\.|Section|Which|In |A primary|Modulation|Why|Amplitude|FM|Comparison|Applications|Cell|Handoff|Frequency|A group|Co-channel|Hexagonal|In practice|Sectoring)', line) or (line and line.endswith('?')):
            question = line.replace(f'Q{qnum}. ', '').strip()
            options = []
            i += 1
            # Collect options
            while i < len(lines) and not lines[i].startswith('Answer:') and not re.match(r'^(Q\d+\.|Section|Which|In |A primary|Modulation|Why|Amplitude|FM|Comparison|Applications|Cell|Handoff|Frequency|A group|Co-channel|Hexagonal|In practice|Sectoring)', lines[i].strip()) and not (lines[i].strip() and lines[i].strip().endswith('?')):
                opt = lines[i].strip()
                if opt:
                    options.append(opt)
                i += 1
            # Find answer
            answer = ''
            if i < len(lines) and lines[i].startswith('Answer:'):
                answer = lines[i].replace('Answer: ', '').strip()
                i += 1
            # Write formatted question
            if question and options and answer:
                out = [f"Q{qnum}. {question}"]
                for idx, opt in enumerate(options):
                    out.append(f"{chr(65+idx)}) {opt}")
                # Try to match answer to option
                ans_letter = ''
                for idx, opt in enumerate(options):
                    if answer.strip().lower() == opt.strip().lower():
                        ans_letter = chr(65+idx)
                if not ans_letter and answer in ['A', 'B', 'C', 'D']:
                    ans_letter = answer
                out.append(f"Answer: {ans_letter if ans_letter else answer}")
                questions.append('\n'.join(out))
                qnum += 1
        else:
            i += 1
    # Write to output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(questions))

# Usage:
# parse_and_rewrite_quiz('quiz.txt', 'quiz_formatted.txt')
