import {
  GAMES, makeQuestion, makeWorkout, reasoningSet, evaluateAnswer,
  seededRandom, shuffled, dailyGames,
  type GameId, type Difficulty, type Seed, type Question, type WorkoutQuestion,
  type ReasoningQuestion,
} from '@daouksalim-alt/loopwise-core';

const game: GameId = GAMES[0].id;
const difficulty: Difficulty = 2;
const seed: Seed = 'consumer-types';
const question: Question = makeQuestion(game, 0, seed, difficulty);
const workout: WorkoutQuestion[] = makeWorkout('2026-10-31', difficulty);
const reasoning: ReasoningQuestion[] = reasoningSet(seed);
const selectedGames: GameId[] = dailyGames('2026-10-31');
const shuffledGames: GameId[] = shuffled(selectedGames, seededRandom(seed));

if (question.type === 'memory') {
  const accepted: boolean = evaluateAnswer(question, question.pattern);
  const tiles: number[] = question.pattern;
  void [accepted, tiles];
} else {
  const accepted: boolean = evaluateAnswer(question, question.answer);
  const options: string[] = question.options;
  void [accepted, options];
}

if (question.type === 'word') {
  const clue: string = question.clue;
  void clue;
}
if (question.type === 'odd') {
  const descriptions: string[] = question.optionLabels;
  void descriptions;
}
const explanation: string = reasoning[0].explanation;
const workoutGame: GameId = workout[0].gameId;
void [shuffledGames, explanation, workoutGame];

// Invalid integration inputs must remain compiler errors.
// @ts-expect-error Unknown game names are not accepted.
makeQuestion('unknown', 0, seed);
// @ts-expect-error Difficulty is limited to 1, 2, or 3.
makeQuestion('math', 0, seed, 4);
// @ts-expect-error Seeds are strings or numbers, not objects.
seededRandom({ value: 'seed' });
// @ts-expect-error Exported game metadata is readonly.
GAMES[0].name = 'changed';
// @ts-expect-error The metadata list itself is readonly.
GAMES.push(GAMES[0]);
