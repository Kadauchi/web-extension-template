const fs = require('fs-extra');
const path = require('path');
const commandLineArgs = require('command-line-args');
const JSZip = require('jszip');

const readdirSyncRecursive = require('./readdirSyncRecursive');

const filePaths = readdirSyncRecursive('./build').map((o) => o.path);
const optionDefinitions = [{ name: 'targets', alias: 't', type: String, multiple: true, defaultOption: true }];
const options = commandLineArgs(optionDefinitions);
const package = fs.readJsonSync('./package.json');

fs.ensureDirSync('./dist');

options.targets.forEach((target) => {
  const zip = new JSZip();
  const zipName = `${target}-${package.version}`;
  const zipPath = `./dist/${zipName}.zip`;

  fs.removeSync(zipPath);

  switch (target) {
    case 'chrome':
      filePaths.forEach((filePath) => {
        const parsed = path.parse(filePath);
        const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'build');
        zip.folder(zipName).file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
      });
      break;
    case 'firefox':
      filePaths.forEach((filePath) => {
        const parsed = path.parse(filePath);
        const dirs = parsed.dir.split(path.sep).filter((dir) => dir !== 'build');
        zip.file(path.join(...dirs, parsed.base), fs.readFileSync(filePath));
      });
      break;
  }

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
    .pipe(fs.createWriteStream(zipPath))
    .on('finish', () => console.log(`${zipPath} created.`));
});
