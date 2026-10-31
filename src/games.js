export const GAMES = Object.freeze([
  { id: 'sequence', name: 'Sequence', category: 'Memory', color: 'purple', icon: 'grid', description: 'A fleeting pattern. Can you bring it back?', tagline: 'Remember the rhythm', time: '2 min' },
  { id: 'color', name: 'Color Clash', category: 'Focus', color: 'peach', icon: 'layers', description: 'Read between the colors. Trust your eyes.', tagline: 'Find your focus', time: '1 min' },
  { id: 'numbers', name: 'Number Trail', category: 'Logic', color: 'mint', icon: 'path', description: 'Follow the pattern to the missing number.', tagline: 'Connect the dots', time: '2 min' },
  { id: 'math', name: 'Quick Math', category: 'Math', color: 'yellow', icon: 'math', description: 'Little calculations. Satisfying solutions.', tagline: 'Make it add up', time: '1 min' },
  { id: 'words', name: 'Word Mix', category: 'Language', color: 'blue', icon: 'letters', description: 'Untangle the letters. Discover the word.', tagline: 'Find the right words', time: '2 min' },
  { id: 'odd', name: 'Odd One Out', category: 'Observation', color: 'pink', icon: 'eye', description: 'One of these things has its own ideas.', tagline: 'Notice the little things', time: '1 min' }
].map(Object.freeze));

function assertSeed(seed) {
  if (typeof seed !== 'string' && !(typeof seed === 'number' && Number.isFinite(seed))) {
    throw new TypeError('seed must be a string or a finite number');
  }
}

function assertDifficulty(difficulty) {
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 3) {
    throw new RangeError('difficulty must be 1, 2, or 3');
  }
}

function assertDay(day) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new TypeError('day must be a YYYY-MM-DD string');
  }
  const date = new Date(`${day}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day) {
    throw new RangeError('day must be a valid calendar date');
  }
}

export function seededRandom(seed) {
  assertSeed(seed);
  let n = 2166136261;
  const text = String(seed);
  // Iterate code units so both halves of a surrogate pair affect the seed.
  for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619);
  return () => {
    n = (n + 0x6D2B79F5) >>> 0;
    let x = Math.imul(n ^ n >>> 15, 1 | n);
    x ^= x + Math.imul(x ^ x >>> 7, 61 | x);
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
}

export function shuffled(array, rng) {
  if (!Array.isArray(array)) throw new TypeError('array must be an array');
  if (typeof rng !== 'function') throw new TypeError('rng must be a function');
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const random = rng();
    if (!Number.isFinite(random) || random < 0 || random >= 1) {
      throw new RangeError('rng must return a finite number in [0, 1)');
    }
    const j = Math.floor(random * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function optionsFor(correct, rng) {
  const options = new Set([correct]);
  let tries = 0;
  while (options.size < 4 && tries++ < 100) {
    const offset = 1 + Math.floor(rng() * Math.max(4, Math.abs(correct) * .3));
    options.add(correct + (rng() > .5 ? offset : -offset));
  }
  for (let n = 1; options.size < 4; n++) options.add(correct + n);
  const shuffledOptions = shuffled([...options], rng).map(String);
  return { options: shuffledOptions, answer: shuffledOptions.indexOf(String(correct)) };
}

const COLORS = [
  { label: 'Blue', value: '#2963cc' }, { label: 'Red', value: '#c4354f' },
  { label: 'Green', value: '#247953' }, { label: 'Purple', value: '#7950c7' }
];
const WORDS = [
  ['ORBIT', 'The path around a planet', 'ROBOT', 'TRIBE', 'BIRTH'],
  ['SPARK', 'A tiny flash of light', 'SHARK', 'PARKS', 'SPEAK'],
  ['OCEAN', 'A very large body of water', 'CANOE', 'ACORN', 'DANCE'],
  ['BLOOM', 'What a flower does', 'GLOOM', 'BROOM', 'LOOMS'],
  ['LIGHT', 'The opposite of darkness', 'NIGHT', 'THIGH', 'SIGHT'],
  ['DREAM', 'An adventure while you sleep', 'ARMED', 'DRAMA', 'CREAM'],
  ['CLOUD', 'A floating collection of water droplets', 'COULD', 'CLOUT', 'CLOAK'],
  ['PLANT', 'A living thing that grows leaves', 'PLANE', 'PLANK', 'PAINT'],
  ['MUSIC', 'The art of organized sound', 'MUCUS', 'CUMIN', 'MAGIC'],
  ['RIVER', 'A natural flowing watercourse', 'RIDER', 'RIVET', 'ROVER'],
  ['PEARL', 'A gem formed in a mollusk', 'PALER', 'PLEAT', 'PLACE'],
  ['TRAIL', 'A path to follow', 'TRIAL', 'TRAIN', 'TRAIT']
];

export function makeQuestion(gameId, index, seed, difficulty = 1) {
  if (!GAMES.some(game => game.id === gameId)) throw new RangeError(`Unknown game: ${String(gameId)}`);
  if (!Number.isSafeInteger(index) || index < 0) throw new RangeError('index must be a non-negative safe integer');
  assertSeed(seed);
  assertDifficulty(difficulty);
  const rng = seededRandom(`${seed}:${gameId}:${index}:${difficulty}`);
  const integer = (low, high) => low + Math.floor(rng() * (high - low + 1));
  if (gameId === 'sequence') {
    const count = Math.min(6, 3 + Math.floor(index / 2) + difficulty - 1);
    return { type: 'memory', prompt: 'Remember the highlighted tiles.', pattern: shuffled([...Array(9).keys()], rng).slice(0, count), explanation: 'The highlighted tiles are the pattern. Their order does not matter.' };
  }
  if (gameId === 'color') {
    const ink = integer(0, 3);
    const word = (ink + integer(1, 3)) % 4;
    return { type: 'color', prompt: 'Which color is the ink?', word: COLORS[word].label, ink: COLORS[ink].value, options: COLORS.map(c => c.label), answer: ink, explanation: `The word is “${COLORS[word].label}”, but the ink is ${COLORS[ink].label.toLowerCase()}.` };
  }
  if (gameId === 'math') {
    const a = integer(3, difficulty === 3 ? 25 : 15);
    const b = integer(2, difficulty === 1 ? 9 : 12);
    const op = index % 3;
    const left = op === 1 ? a + b : a;
    const value = op === 0 ? a + b : op === 1 ? a : a * b;
    const symbol = ['+', '−', '×'][op];
    return { type: 'choice', prompt: 'Find the missing answer.', display: `${left} ${symbol} ${b} = ?`, ...optionsFor(value, rng), explanation: `${left} ${symbol} ${b} = ${value}.` };
  }
  if (gameId === 'numbers') {
    const start = integer(1, 12), step = integer(2, 7);
    let series, answer, explanation;
    if ((index % 3 + difficulty) % 3 === 0) {
      series = [start, start + step, start + step * 2 + 1, start + step * 3 + 3];
      answer = start + step * 4 + 6;
      explanation = `Add ${step}, then ${step + 1}, then ${step + 2}, then ${step + 3}. The answer is ${answer}.`;
    } else if (difficulty > 1 && index % 2 === 1) {
      series = [start, start * 2, start * 4, start * 8]; answer = start * 16;
      explanation = `Double the previous number each time. ${series[3]} × 2 = ${answer}.`;
    } else {
      series = [start, start + step, start + step * 2, start + step * 3]; answer = start + step * 4;
      explanation = `Add ${step} each time. ${series[3]} + ${step} = ${answer}.`;
    }
    return { type: 'choice', prompt: 'What comes next in the trail?', series, ...optionsFor(answer, rng), explanation };
  }
  if (gameId === 'words') {
    const wordOrder = shuffled(WORDS, seededRandom(`${seed}:word-deck`));
    const [word, clue, ...distractors] = wordOrder[index % wordOrder.length];
    let scrambled = shuffled([...word], rng).join('');
    if (scrambled === word) scrambled = word.slice(1) + word[0];
    const options = shuffled([word, ...distractors], rng);
    return { type: 'word', prompt: 'Untangle the letters.', display: scrambled, clue, options, answer: options.indexOf(word), explanation: `${word}: ${clue.toLowerCase()}.` };
  }
  if (gameId === 'odd') {
    const pairs = [['◉', '◎', 'filled-center circle', 'double circle'], ['✦', '✧', 'filled star', 'outline star'], ['↗', '↖', 'up-right arrow', 'up-left arrow'], ['◒', '◓', 'bottom-filled circle', 'top-filled circle']];
    const [normal, odd, normalName, oddName] = pairs[index % pairs.length];
    const answer = integer(0, 11);
    return { type: 'odd', prompt: 'Find the one that is different.', options: Array.from({length: 12}, (_, i) => i === answer ? odd : normal), optionLabels: Array.from({length: 12}, (_, i) => `Tile ${i + 1}: ${i === answer ? oddName : normalName}`), answer, explanation: `Tile ${answer + 1} is the ${oddName}; the others are ${normalName}s.` };
  }
  throw new Error(`Unknown game: ${gameId}`);
}

export function dailyGames(day) {
  assertDay(day);
  return shuffled(GAMES.map(g => g.id), seededRandom(`daily:${day}`)).slice(0, 3);
}

export function makeWorkout(day, difficulty = 1) {
  assertDifficulty(difficulty);
  return dailyGames(day).flatMap(gameId => Array.from({length: 5}, (_, i) => ({gameId, ...makeQuestion(gameId, i, day, difficulty)})));
}

const REASONING = [
  { prompt: 'All lumens are circles. All circles are shapes. What must be true?', options: ['All lumens are shapes.', 'All shapes are lumens.', 'No circles are lumens.', 'All shapes are circles.'], answer: 0, explanation: 'If lumens belong to the set of circles, and circles belong to shapes, lumens must also be shapes.' },
  { prompt: 'Maya is ahead of Jo. Jo is ahead of Lee. Who is furthest ahead?', options: ['Maya', 'Jo', 'Lee', 'Cannot be determined'], answer: 0, explanation: 'The given order is Maya, then Jo, then Lee.' },
  { prompt: 'A book is to reading as a fork is to…', options: ['Eating', 'Cooking', 'Drawing', 'Measuring'], answer: 0, explanation: 'Reading is the usual action for a book; eating is the usual action for a fork.' },
  { prompt: 'Some green tokens are round. All round tokens are large. What must be true?', options: ['Some green tokens are large.', 'All green tokens are large.', 'No large tokens are green.', 'All large tokens are round.'], answer: 0, explanation: 'The green tokens that are round must also be large. We cannot conclude anything about the other green tokens.' },
  { prompt: 'Turn a right-pointing arrow 90° clockwise. Which way does it point?', options: ['Down', 'Up', 'Left', 'Right'], answer: 0, explanation: 'A quarter turn clockwise takes right to down.' },
  { prompt: 'Which item does not belong with the others?', options: ['Cube', 'Triangle', 'Circle', 'Square'], answer: 0, explanation: 'A cube is three-dimensional. The others are two-dimensional shapes.' },
  { prompt: 'A red tile is left of a blue tile. A yellow tile is between them. What is the order from left to right?', options: ['Red, yellow, blue', 'Blue, yellow, red', 'Yellow, red, blue', 'Red, blue, yellow'], answer: 0, explanation: 'Red is on the left, blue is on the right, and yellow sits between them.' },
  { prompt: 'The pattern is triangle, circle, square, triangle, circle, square. What comes next?', options: ['Triangle', 'Circle', 'Square', 'Pentagon'], answer: 0, explanation: 'The three-shape group repeats, starting again with a triangle.' }
];

export function reasoningSet(seed) {
  const rng = seededRandom(seed);
  const selected = shuffled(REASONING, rng).slice(0, 5).map(q => {
    const options = shuffled(q.options, rng);
    return {...q, type: 'reasoning', gameId: 'reasoning', options, answer: options.indexOf(q.options[q.answer])};
  });
  return shuffled([...selected, ...Array.from({length: 5}, (_, i) => ({...makeQuestion(i % 2 === 0 ? 'numbers' : 'math', i, seed, 2), gameId: 'reasoning'}))], rng);
}

export function evaluateAnswer(question, answer) {
  if (!question || typeof question !== 'object') return false;
  if (question.type === 'memory') {
    if (!Array.isArray(question.pattern) || question.pattern.length === 0 || question.pattern.length > 9 ||
      new Set(question.pattern).size !== question.pattern.length ||
      !Array.from(question.pattern).every(i => Number.isInteger(i) && i >= 0 && i < 9)) return false;
    return Array.isArray(answer) && answer.length === question.pattern.length && new Set(answer).size === answer.length && Array.from(answer).every(i => question.pattern.includes(i));
  }
  if (!['choice', 'color', 'word', 'odd', 'reasoning'].includes(question.type) ||
    !Array.isArray(question.options) || question.options.length < 2 ||
    !Array.from(question.options).every(option => typeof option === 'string' && option.length > 0) ||
    !Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) return false;
  return Number.isInteger(answer) && answer === question.answer;
}
