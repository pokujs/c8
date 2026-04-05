import { assert, test } from 'poku';
import { inspectPoku } from 'poku/plugins';

const fixtureDir = 'test/__fixtures__/e2e';
const pokuBin = 'node_modules/poku/lib/bin/index.js';

test('loads JSONC config file with comments', async () => {
  const result = await inspectPoku({
    command: '-c=configs/config-file.config.js',
    spawnOptions: { cwd: fixtureDir },
    bin: pokuBin,
  });

  assert.strictEqual(result.exitCode, 0);
  assert(result.stdout.includes('math.ts'));
  assert(result.stdout.includes('%'));
});
