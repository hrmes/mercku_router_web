const fs = require('fs');
const path = require('path');

const fsPath = path.join(__dirname, '../version.json');
fs.readFile(fsPath, 'utf8', (err, data) => {
  if (err) throw err;
  data = JSON.parse(data);
  console.log(`current Web version is ${data.version}`);
  data.version += 1;
  console.log(`next Web version is ${data.version}`);
  fs.writeFile(fsPath, JSON.stringify(data), err => {
    if (err) throw err;
    console.log('write new version ok.');
  });
});
