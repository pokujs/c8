import { assert, test } from 'poku';
import { add, subtract } from '../src/math.js';

test('add', () => {
  assert.strictEqual(add(1, 2), 3);
  assert.strictEqual(add(-1, 1), 0);
});

test('subtract', () => {
  assert.strictEqual(subtract(5, 3), 2);
});
