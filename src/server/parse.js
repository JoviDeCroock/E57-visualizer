import pkg from 'python-shell';
const { PythonShell } = pkg;

export const parse = async () => {
  return await new Promise((resolve, reject) => {
    const scans = [];
    const myPythonScriptPath = 'parse.py';
    const pyshell = new PythonShell(myPythonScriptPath);

    pyshell.on('message', (msg) => {
      const { cartesianX, cartesianY, cartesianZ, colorRed, colorBlue, colorGreen } = JSON.parse(msg);

      scans.push({
        x: cartesianX,
        y: cartesianY,
        z: cartesianZ,
        red: colorRed,
        green: colorGreen,
        blue: colorBlue
      });
    });

    pyshell.end((e) => {
      if (e) {
        return reject(e);
      }

      return resolve(scans);
    })
  });
};

// https://github.com/davidcaron/pye57
// http://potree.org/getting_started.html
// https://www.laserscanningforum.com/forum/viewtopic.php?t=13887
