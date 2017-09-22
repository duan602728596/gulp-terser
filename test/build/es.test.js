const assert = require('assert');
const {
  add,
  array,
  pow,
  promise,
  asyncFn
} = require('./es');

describe('#es.js', ()=>{
  // add
  describe('#add()', ()=>{
    it('add(1, 2) should return 15', ()=>{
      assert.strictEqual(add(1, 2), 15);
    });
    it('add(-18, 3) should return -3', ()=>{
      assert.strictEqual(add(-18, 3), -3);
    });
  });
  // array
  describe('#array()', ()=>{
    it('array([1, 3, 5]) should return 9', ()=>{
      assert.strictEqual(array([1, 3, 5]), 9);
    });
    it('array([-11, 35, 8]) should return 32', ()=>{
      assert.strictEqual(array([-11, 35, 8]), 32);
    });
  });
  // pow
  describe('#pow()', ()=>{
    it('pow(2, 4) should return 16', ()=>{
      assert.strictEqual(pow(2, 4), 16);
    });
    it('pow(3, 3) should return 27', ()=>{
      assert.strictEqual(pow(3, 3), 27);
    });
  });
  // promise
  describe('#promise()', ()=>{
    it('promise(12) should return 15', async ()=>{
      const r = await promise(12);
      assert.strictEqual(r, 15);
    });
  });
  // async
  describe('#async()', ()=>{
    it('async', ()=>{
      asyncFn();
    });
  });
});