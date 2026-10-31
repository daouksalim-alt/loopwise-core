import { makeWorkout, evaluateAnswer } from '../src/games.js';

// Explicit date makes the example independent of the computer's timezone.
const day = process.argv[2] ?? '2026-10-31';
const difficulty = Number(process.argv[3] ?? 1);
try {
  const workout = makeWorkout(day, difficulty);
  console.log(JSON.stringify({
    day,
    difficulty,
    questions: workout.length,
    games: [...new Set(workout.map(question => question.gameId))],
    firstQuestion: workout[0],
    answerCheck: evaluateAnswer(workout[0], workout[0].type === 'memory' ? workout[0].pattern : workout[0].answer)
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
