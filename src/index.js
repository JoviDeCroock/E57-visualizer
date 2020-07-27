const { PythonShell } = require('python-shell');

const myPythonScriptPath = 'parse.py';
const pyshell = new PythonShell(myPythonScriptPath);

let currentScanIndex;
const scan = [];

pyshell.on('message', (msg) => {
  scan.push(JSON.parse(msg));
});

pyshell.end((e, data) => {
  if (e) throw e;
  console.log('--- FINISHED ---')
  console.log(Object.keys(scan[1]))
})


// https://github.com/davidcaron/pye57
// http://potree.org/getting_started.html
// https://www.laserscanningforum.com/forum/viewtopic.php?t=13887
