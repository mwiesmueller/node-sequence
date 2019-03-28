'use strict';

const findPath = (obj, path) => {
  const paths = path.split('.');
  let current = obj;
  let i;

  /* eslint-disable no-else-return */
  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] === undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
};

module.exports = findPath;
