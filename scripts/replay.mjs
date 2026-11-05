import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { makeQuestion, evaluateAnswer } from '../src/games.js';
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

export function replay(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('Expected a JSON object.');
  if (record.version !== version) throw new Error(`Version mismatch: report ${record.version}, installed ${version}. Use the reported release.`);
  if (![1, 2, 3].includes(record.difficulty)) throw new Error('Include difficulty explicitly (1, 2 or 3).');
  const question = makeQuestion(record.gameId, record.index, record.seed, record.difficulty);
  const result = { version, question };
  if (Object.hasOwn(record, 'answer')) result.correct = evaluateAnswer(question, record.answer);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node scripts/replay.mjs report.json');
    console.log(JSON.stringify(replay(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2));
  } catch (error) {
    console.error(`Replay failed: ${error.message}`);
    process.exitCode = 1;
  }
}
