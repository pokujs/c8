import { resolve } from 'node:path';
import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = resolve('test/__fixtures__/e2e');

test('basic coverage report is generated', async () => {
  const result = await inspectPoku({
    command: '-c=configs/basic.config.ts',
    spawnOptions: { cwd: fixtureDir },
  });

  assert.strictEqual(result.exitCode, 0);
  assert(result.stdout.includes('math.ts'));
  assert(result.stdout.includes('%'));
});
