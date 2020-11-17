const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { add, array, pow, promise, asyncFn } = require('./es');

describe('es.js', () => {
  // add
  describe('add()', () => {
    it('add(1, 2) should return 15', function() {
      expect(add(1, 2)).to.be.equal(15);
    });

    it('add(-18, 3) should return -3', function() {
      expect(add(-18, 3)).to.be.equal(-3);
    });
  });

  // array
  describe('array()', () => {
    it('array([1, 3, 5]) should return 9', function() {
      expect(array([1, 3, 5])).to.be.equal(9);
    });

    it('array([-11, 35, 8]) should return 32', function() {
      expect(array([-11, 35, 8])).to.be.equal(32);
    });
  });

  // pow
  describe('pow()', () => {
    it('pow(2, 4) should return 16', function() {
      expect(pow(2, 4)).to.be.equal(16);
    });

    it('pow(3, 3) should return 27', function() {
      expect(pow(3, 3)).to.be.equal(27);
    });
  });

  // promise
  describe('promise()', () => {
    it('promise(12) should return 15', async function() {
      const r = await promise(12);

      expect(r).to.be.equal(15);
    });
  });

  // async
  describe('async()', function() {
    it('async', function() {
      asyncFn();
    });
  });

  // sourcemaps
  describe('sourcemaps', function() {
    it('sourcemaps exist', function() {
      expect(fs.existsSync(path.join(__dirname, 'es.js.map'))).to.be.true;
    });
  });
});