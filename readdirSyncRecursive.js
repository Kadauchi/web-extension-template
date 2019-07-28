const fs = require('fs-extra');
const path = require('path');

module.exports = function readdirSyncRecursive(directory) {
  const paths = fs.readdirSync(directory).map((fileName) => path.join(directory, fileName));
  const files = paths.filter((path) => fs.statSync(path).isFile());
  const directoryPaths = paths.filter((path) => fs.statSync(path).isDirectory());
  const directoryFiles = directoryPaths.reduce((acc, path) => [...acc, ...readdirSyncRecursive(path)], []);
  return [...files, ...directoryFiles];
};
