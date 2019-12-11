'use strict';

const findPath = require('./findPath');

const runFunctionSequence = async (process, lib, base) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(process)) {
      return reject('Process is not an array or undefined');
    }

    let error;

    process.forEach(item => {
      if (!item.method || !item.args) {
        error = true;
      }
    });

    if (error || process.length === 0) {
      return reject('Process items are not complete');
    }

    if (!lib) {
      lib = false;
    }

    let res;

    console.log('NODE-SEQUENCE: Sequence has been started!');

    (async () => {
      for (let i = 0; i < process.length; i++) {
        const args = [];

        for (let a = 0; a < process[i].args.length; a++) {
          let record;

          if (typeof process[i].args[a] !== 'object' && process[i].args[a].split('.')[0] !== '%RES%' && process[i].args[a].split('.')[0] !== '%BASE%') {
            args.push(process[i].args[a]);

            record = true;
          }

          if (typeof process[i].args[a] !== 'object' && process[i].args[a].split('.')[0] === '%RES%' && typeof res !== 'object' && !record) {
            args.push(res);

            record = true;
          }

          if (typeof process[i].args[a] !== 'object' && process[i].args[a].indexOf('%BASE%.') !== -1 && typeof base === 'object' && !record) {
            const arg = process[i].args[a].replace('%BASE%.', '');

            args.push(findPath(base, arg));
            record = true;
          }

          if (typeof process[i].args[a] !== 'object' && process[i].args[a].split('.')[0] === '%BASE%' && !record) {
            args.push(base);

            record = true;
          }

          if (typeof process[i].args[a] !== 'object' && process[i].args[a].indexOf('%RES%.') !== -1 && typeof res === 'object' && !record) {
            const arg = process[i].args[a].replace('%RES%.', '');

            args.push(findPath(res, arg));
          }

          if (typeof process[i].args[a] === 'object') {
            Object.keys(process[i].args[a]).forEach((key) => {
              if (typeof process[i].args[a][key] === 'string' && process[i].args[a][key].indexOf('%BASE%.') !== -1) {
                const arg = process[i].args[a][key].replace('%BASE%.', '');

                process[i].args[a][key] = findPath(base, arg);
              }

              if (typeof process[i].args[a][key] === 'string' && process[i].args[a][key].indexOf('%RES%.') !== -1) {
                const arg = process[i].args[a][key].replace('%RES%.', '');

                process[i].args[a][key] = findPath(res, arg);
              }
            });

            args.push(process[i].args[a]);
          }
        }

        try {
          let temp;

          if (process[i].await) {
            temp = await eval(process[i].method)(...args);
          } else {
            temp = eval(process[i].method)(...args);
          }

          if (temp) {
            res = temp;
          }
        } catch (err) {
          throw err;
        }

        if (i === process.length - 1) {
          console.log('NODE-SEQUENCE: Sequence is done!');

          return resolve(true);
        }
      }
    })();
  });
};

module.exports = runFunctionSequence;
