'use strict';

const assert = require('assertthat');
const path = require('path');
const fs = require('fs');

const sequence = require(path.resolve('./lib'));

const seq = [
  { method: 'console.log', await: false, args: [ 'Foo' ]},
  { method: 'lib.readFileSync', await: true, args: [ './testfile.txt', 'utf8' ]},
  { method: 'console.log', await: false, args: [ '%RES%' ]},
  { method: 'lib.writeFileSync', await: true, args: [ './result.txt', '%RES%', 'utf8' ]}
];

const seq2 = [
  { method: 'console.log', await: false, args: [ 'Test 2' ]},
  { method: 'lib.readFileSync', await: true, args: [ './test.json', 'utf8' ]},
  { method: 'JSON.parse', await: true, args: [ '%RES%' ]},
  { method: 'lib.writeFileSync', await: true, args: [ './result.json', '%RES%.foo.bar', 'utf8' ]}
];

const seq3 = [
  { method: 'console.log', await: false, args: [ '%BASE%' ]},
  { method: 'lib.writeFileSync', await: true, args: [ './base.txt', '%BASE%.foo.bar', 'utf8' ]}
];

describe('node-sequence...', () => {
  it('... is of type function', (done) => {
    assert.that(sequence).is.ofType('function');
    done();
  });

  it('... rejects an error when process is not defined', (done) => {
    (async () => {
      try {
        await sequence();
      } catch (err) {
        assert.that(err).is.equalTo('Process is not an array or undefined');
        done();
      }
    })();
  });

  it('... rejects an error when sequence array is not an array', (done) => {
    (async () => {
      try {
        await sequence('Foo');
      } catch (err) {
        assert.that(err).is.equalTo('Process is not an array or undefined');
        done();
      }
    })();
  });

  it('... rejects an error when sequence array is not complete', (done) => {
    (async () => {
      try {
        await sequence([]);
      } catch (err) {
        assert.that(err).is.equalTo('Process items are not complete');
        done();
      }
    })();
  });

  it('... resolves true when process is done', (done) => {
    (async () => {
      try {
        await fs.writeFileSync('./testfile.txt', 'FOOBARTEST', 'utf8');

        const res = await sequence(seq, require('fs'));
        const file = await fs.readFileSync('./result.txt', 'utf8');

        assert.that(res).is.true();
        assert.that(file).is.equalTo('FOOBARTEST');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolves true when process is done (JSON)', (done) => {
    (async () => {
      try {
        const obj = {
          foo: {
            bar: 'text'
          }
        };

        await fs.writeFileSync('./test.json', JSON.stringify(obj), 'utf8');

        const res = await sequence(seq2, require('fs'));
        const file = await fs.readFileSync('./result.json', 'utf8');

        assert.that(res).is.true();
        assert.that(file).is.equalTo('text');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });

  it('... resolves true when process is done with base object (JSON)', (done) => {
    (async () => {
      try {
        const obj = {
          foo: {
            bar: 'BaseTest'
          }
        };

        const res = await sequence(seq3, require('fs'), obj);
        const file = await fs.readFileSync('./base.txt', 'utf8');

        assert.that(res).is.true();
        assert.that(file).is.equalTo('BaseTest');
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
