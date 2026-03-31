import { normalize, resolve } from 'node:path';
import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = resolve(normalize('test/__fixtures__/e2e'));

test('basic coverage report is generated', async () => {
  const result = await inspectPoku({
    command: '-c=configs/basic.config.ts',
    spawnOptions: { cwd: fixtureDir },
  });

  console.log('STDOUT:', result.stdout);
  console.log('STDERR:', result.stderr);
  console.log('EXIT:', result.exitCode);

  assert.strictEqual(result.exitCode, 0);
  assert(result.stdout.includes('math.ts'));
  assert(result.stdout.includes('%'));
});
