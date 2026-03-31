import { normalize, resolve } from 'node:path';
import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = resolve(normalize('test/__fixtures__/e2e'));

test('threshold check passes with low threshold', async () => {
  const result = await inspectPoku({
    command: '-c=configs/thresholds-pass.config.ts',
    spawnOptions: { cwd: fixtureDir },
  });

  console.log('STDOUT:', result.stdout);
  console.log('STDERR:', result.stderr);
  console.log('EXIT:', result.exitCode);

  assert.strictEqual(result.exitCode, 0);
});

test('threshold check fails with 100% threshold on partial coverage', async () => {
  const result = await inspectPoku({
    command: '-c=configs/thresholds-fail.config.ts',
    spawnOptions: { cwd: fixtureDir },
  });

  console.log('STDOUT:', result.stdout);
  console.log('STDERR:', result.stderr);
  console.log('EXIT:', result.exitCode);

  assert.strictEqual(result.exitCode, 1);
});
