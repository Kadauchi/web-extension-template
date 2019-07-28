const fs = require('fs-extra');
const path = require('path');

// Create an entry for every ts and tsx file in the /src/pages folder.
module.exports = fs.readdirSync('./src/pages').reduce((acc, fileName) => {
  const [name, ext] = fileName.split('.');

  if (ext && ext.match(/ts(x?)/)) {
    return {
      ...acc,
      [name]: path.join(__dirname, 'src', 'pages', fileName),
    };
  }

  return acc;
}, {});
