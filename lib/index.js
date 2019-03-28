'use strict';

const findPath = require('./findPath');

const runFunctionSequence = async (process, lib) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(process)) {
      return reject('Process is not an array or undefined');
    }

    if (!lib) {
      return reject('Library is undefined');
    }

    process.forEach(item => {
      if (!item.method || !item.args) {
        return reject('Process items are not complete');
      }
    });

    let res;

    (async () => {
      for (let i = 0; i < process.length; i++) {
        const args = [];

        process[i].args.forEach(arg => {
          if (arg.split('.')[0] !== '%RES%') {
            args.push(arg);
          } else {
            if (typeof res !== 'object') {
              args.push(res);
            } else {
              arg = arg.replace('%RES%.', '');

              args.push(findPath(res, arg));
            }
          }
        });

        try {
          if (process[i].await) {
            res = await eval(process[i].method)(...args);
          } else {
            res = eval(process[i].method)(...args);
          }
        } catch (err) {
          throw err;
        }

        if (i === process.length) {
          return resolve(true);
        }
      }
    })();
  });
};

module.exports = runFunctionSequence;
