import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-unresolved
import index from './dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { add, array, pow, promise, asyncFn } = index;

test.describe('The code still executes correctly after compression', () => {
  // add
  test.describe('add()', () => {
    test.it('add(1, 2) should return 15', () => {
      assert.deepStrictEqual(add(1, 2), 15);
    });

    test.it('add(-18, 3) should return -3', () => {
      assert.deepStrictEqual(add(-18, 3), -3);
    });
  });

  // array
  test.describe('array()', () => {
    test.it('array([1, 3, 5]) should return 9', () => {
      assert.deepStrictEqual(array([1, 3, 5]), 9);
    });

    test.it('array([-11, 35, 8]) should return 32', () => {
      assert.deepStrictEqual(array([-11, 35, 8]), 32);
    });
  });

  // pow
  test.describe('pow()', () => {
    test.it('pow(2, 4) should return 16', () => {
      assert.deepStrictEqual(pow(2, 4), 16);
    });

    test.it('pow(3, 3) should return 27', () => {
      assert.deepStrictEqual(pow(3, 3), 27);
    });
  });

  // promise
  test.describe('promise()', () => {
    test.it('promise(12) should return 15', async () => {
      const r = await promise(12);

      assert.deepStrictEqual(r, 15);
    });
  });

  // async
  test.describe('async()', () => {
    test.it('async', async () => {
      await asyncFn();
    });
  });

  // sourcemaps
  test.describe('sourcemaps', () => {
    test.it('sourcemaps exist', () => {
      assert.deepStrictEqual(fs.existsSync(path.join(__dirname, 'dist/index.js.map')), true);
    });
  });
});