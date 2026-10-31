import { GAMES, makeQuestion, evaluateAnswer } from '../../src/games.js';

const byId = id => document.getElementById(id);
const controls = { game: byId('game'), seed: byId('seed'), difficulty: byId('difficulty'), index: byId('index') };
let question;
let showingPattern = false;

function feedback(message, result = '') {
  byId('feedback').textContent = message;
  byId('feedback').dataset.result = result;
}

function renderAnswers() {
  const container = byId('answers');
  const memory = question.type === 'memory';
  container.replaceChildren();
  container.className = memory ? 'answers memory' : 'answers';
  byId('answer-legend').textContent = memory
    ? showingPattern ? 'Study the marked tiles, then hide the pattern' : 'Select the tiles you remember; order does not matter'
    : 'Choose one answer';
  const options = memory ? Array.from({ length: 9 }, (_, index) => `Tile ${index + 1}`) : question.options;
  options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'answer';
    const input = document.createElement('input');
    input.type = memory ? 'checkbox' : 'radio';
    input.name = 'answer';
    input.value = String(index);
    input.disabled = memory && showingPattern;
    const text = document.createElement('span');
    // Text descriptions remain visible, so Odd One Out is usable without relying on symbol fonts.
    text.textContent = question.type === 'odd' ? `${option} · ${question.optionLabels[index]}` : option;
    label.append(input, text);
    if (memory && showingPattern) {
      const marked = question.pattern.includes(index);
      const state = document.createElement('span');
      state.className = 'tile-state';
      state.textContent = marked ? 'Marked' : 'Not marked';
      label.append(state);
      label.classList.toggle('marked', marked);
    }
    container.append(label);
  });
  byId('check').disabled = memory && showingPattern;
}

function generate({ focus = false } = {}) {
  if (!byId('settings').reportValidity()) return;
  try {
    question = makeQuestion(controls.game.value, Number(controls.index.value), controls.seed.value, Number(controls.difficulty.value));
  } catch (error) {
    feedback(error instanceof Error ? error.message : 'Unable to generate a question.', 'incorrect');
    return;
  }
  showingPattern = question.type === 'memory';
  const game = GAMES.find(item => item.id === controls.game.value);
  byId('question-heading').textContent = game.name;
  byId('question-meta').textContent = `QUESTION ${controls.index.value} / DIFFICULTY ${controls.difficulty.value}`;
  byId('question-prompt').textContent = question.prompt;
  const stimulus = byId('stimulus');
  stimulus.textContent = question.type === 'color' ? question.word
    : question.series ? `${question.series.join('  ·  ')}  ·  ?` : question.display ?? '';
  stimulus.style.color = question.type === 'color' ? question.ink : '';
  const note = byId('task-note');
  note.textContent = question.type === 'color'
    ? 'This activity requires distinguishing ink colors. Choose Quick Math, Number Trail, or Word Mix if color is not a useful cue for you. Text descriptions would reveal the color answer.'
    : question.type === 'word' ? `Clue: ${question.clue}`
    : question.type === 'memory' ? 'Take as long as you need. Hide the pattern when ready; there is no automatic timer.' : '';
  note.hidden = !note.textContent;
  byId('memory-toggle').hidden = question.type !== 'memory';
  byId('memory-toggle').textContent = 'Hide pattern and answer';
  byId('memory-toggle').setAttribute('aria-expanded', String(showingPattern));
  byId('question-json').textContent = JSON.stringify(question, null, 2);
  byId('question-json').closest('details').open = false;
  feedback('');
  renderAnswers();
  if (focus) byId('question-heading').focus();
}

byId('settings').addEventListener('submit', event => {
  event.preventDefault();
  generate({ focus: true });
});

byId('next').addEventListener('click', () => {
  const next = Number(controls.index.value) + 1;
  if (!Number.isSafeInteger(next)) {
    feedback('Choose a smaller question index before continuing.', 'incorrect');
    return;
  }
  controls.index.value = String(next);
  generate({ focus: true });
});

byId('memory-toggle').addEventListener('click', () => {
  showingPattern = !showingPattern;
  byId('memory-toggle').textContent = showingPattern ? 'Hide pattern and answer' : 'Show pattern again (clears selection)';
  byId('memory-toggle').setAttribute('aria-expanded', String(showingPattern));
  feedback(showingPattern ? 'Pattern shown again. Your previous selection was cleared.' : 'Pattern hidden. Select the tiles you remember.');
  renderAnswers();
  if (!showingPattern) byId('answers').querySelector('input').focus();
});

byId('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!question || showingPattern) return;
  const selected = [...byId('answers').querySelectorAll('input:checked')].map(input => Number(input.value));
  if (selected.length === 0) {
    feedback('Choose an answer before checking.');
    byId('answers').querySelector('input').focus();
    return;
  }
  const answer = question.type === 'memory' ? selected : selected[0];
  const correct = evaluateAnswer(question, answer);
  const explanation = question.type === 'memory'
    ? `The marked tiles were ${question.pattern.map(index => index + 1).sort((a, b) => a - b).join(', ')}.`
    : question.explanation;
  feedback(`${correct ? 'Correct.' : 'Not quite.'} ${explanation}`, correct ? 'correct' : 'incorrect');
});

generate();
