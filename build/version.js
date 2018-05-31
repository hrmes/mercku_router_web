const fs = require('fs');
const path = require('path');
var exec = require('child_process').exec;

const fsPath = path.join(__dirname, '../version.json');
fs.readFile(fsPath, 'utf8', (err, data) => {
  if (err) throw err;
  data = JSON.parse(data);
  data.version += 1;
  console.log(`new web version is ${data.version}`);
  fs.writeFile(fsPath, JSON.stringify(data), err => {
    if (err) throw err;
    console.log('write version ok.');
    console.log('git add version.json');
    exec('git add version.json', (error, stdout, stderr) => {
      if (err) throw err;
      console.log('git add version.json ok.')
    });
  });
});
