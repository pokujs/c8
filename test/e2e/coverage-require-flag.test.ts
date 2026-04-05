import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = 'test/__fixtures__/e2e';
const pokuBin = 'node_modules/poku/lib/bin/index.js';

test('coverage is skipped without --coverage flag when requireFlag is true', async () => {
  const result = await inspectPoku({
    command: '-c=configs/require-flag.config.js',
    spawnOptions: { cwd: fixtureDir },
    bin: pokuBin,
  });

  assert.strictEqual(result.exitCode, 0);
  assert(
    !result.stdout.includes('%'),
    'coverage report should not be generated'
  );
});

test('coverage runs with --coverage flag when requireFlag is true', async () => {
  const result = await inspectPoku({
    command: '--coverage -c=configs/require-flag.config.js',
    spawnOptions: { cwd: fixtureDir },
    bin: pokuBin,
  });

  assert.strictEqual(result.exitCode, 0);
  assert(result.stdout.includes('math.ts'));
  assert(result.stdout.includes('%'));
});
