import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = 'test/__fixtures__/e2e';
const pokuBin = 'node_modules/poku/lib/bin/index.js';

test('threshold check passes with low threshold', async () => {
  const result = await inspectPoku({
    command: '-c=configs/thresholds-pass.config.js',
    spawnOptions: { cwd: fixtureDir },
    bin: pokuBin,
  });

  assert.strictEqual(result.exitCode, 0);
});

test('threshold check fails with 100% threshold on partial coverage', async () => {
  const result = await inspectPoku({
    command: '-c=configs/thresholds-fail.config.js',
    spawnOptions: { cwd: fixtureDir },
    bin: pokuBin,
  });

  assert.strictEqual(result.exitCode, 1);
});
