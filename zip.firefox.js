const fs = require('fs-extra');
const path = require('path');
const JSZip = require('jszip');

const readdirSyncRecursive = require('./readdirSyncRecursive');

const package = fs.readJsonSync('./package.json');
const zipName = `firefox-${package.version}`;
const zipPath = `./dist/${zipName}.zip`;

fs.ensureDirSync('./dist');
fs.removeSync(zipPath);

const zip = new JSZip();
const filePaths = readdirSyncRecursive('./build');

filePaths.forEach((filePath) => {
  const parsed = path.parse(filePath);
  const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'build');
  zip.file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
});

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
  .pipe(fs.createWriteStream(zipPath))
  .on('finish', () => console.log(`${zipPath} created.`));
