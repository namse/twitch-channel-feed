const util = require('util');
const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const execAsync = util.promisify(require('child_process').exec);

const tmpDir = '/tmp';
const binDir = path.join(__dirname, '../bin');
const MAX_WIDTH = 300;

module.exports = async function encodeVideo(buffer) {
  const inputFilename = uuid();
  const inputFilePath = path.join(tmpDir, inputFilename);
  const outputFilename = `${uuid()}.mp4`;
  const outputFilePath = path.join(tmpDir, outputFilename);

  await writeFileAsync(inputFilePath, buffer);

  const command = `./ffmpeg -i ${inputFilePath} -c:v libx264 -vf "scale=w=min(iw\\,${MAX_WIDTH}):h=-2" -crf 24 ${outputFilePath}`;
  console.log(command);
  const { error, stdout, stderr } = await execAsync(command, {
    cwd: binDir,
  });
  console.log(error);
  console.log(stdout);
  console.log(stderr);

  const outputBuffer = await readFileAsync(outputFilePath);

  return outputBuffer;
}

