export type Seed = string | number;
export type Difficulty = 1 | 2 | 3;
export type GameId = 'sequence' | 'color' | 'numbers' | 'math' | 'words' | 'odd';

export interface Game {
  readonly id: GameId;
  readonly name: string;
  readonly category: string;
  readonly color: string;
  readonly icon: string;
  readonly description: string;
  readonly tagline: string;
  readonly time: string;
}
interface QuestionBase { prompt: string; explanation: string; }
export interface MemoryQuestion extends QuestionBase { type: 'memory'; pattern: number[]; }
interface OptionsQuestion extends QuestionBase { options: string[]; answer: number; }
export interface MathQuestion extends OptionsQuestion { type: 'choice'; display: string; series?: never; }
export interface NumberQuestion extends OptionsQuestion { type: 'choice'; series: number[]; display?: never; }
export interface ColorQuestion extends OptionsQuestion { type: 'color'; word: string; ink: string; }
export interface WordQuestion extends OptionsQuestion { type: 'word'; display: string; clue: string; }
export interface OddQuestion extends OptionsQuestion { type: 'odd'; optionLabels: string[]; }
export interface LogicQuestion extends OptionsQuestion { type: 'reasoning'; }
export type Question = MemoryQuestion | MathQuestion | NumberQuestion | ColorQuestion | WordQuestion | OddQuestion;
export type WorkoutQuestion = Question & { gameId: GameId };
export type ReasoningQuestion = (LogicQuestion | MathQuestion | NumberQuestion) & { gameId: 'reasoning' };

export const GAMES: readonly Game[];
/** Repeatable non-cryptographic random values in [0, 1). Seeds are stringified. */
export function seededRandom(seed: Seed): () => number;
/** Copies the array and shuffles it; rng must return finite values in [0, 1). */
export function shuffled<T>(array: readonly T[], rng: () => number): T[];
/** Throws for unknown IDs, invalid seed, unsafe/negative index, or difficulty outside 1–3. */
export function makeQuestion(gameId: GameId, index: number, seed: Seed, difficulty?: Difficulty): Question;
/** A real YYYY-MM-DD calendar date, selected by the caller; no timezone is inferred. */
export function dailyGames(day: string): GameId[];
export function makeWorkout(day: string, difficulty?: Difficulty): WorkoutQuestion[];
/** Ten recreational questions; no medical assessment or IQ score. */
export function reasoningSet(seed: Seed): ReasoningQuestion[];
/** Checks a generated question. Malformed questions or invalid answers return false. */
export function evaluateAnswer(question: unknown, answer: unknown): boolean;
