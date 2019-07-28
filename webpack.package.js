const fs = require('fs');

// Convert the package to JSON.
module.exports = JSON.parse(fs.readFileSync('./package.json'));
