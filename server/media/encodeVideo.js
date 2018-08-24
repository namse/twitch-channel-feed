const util = require('util');
const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const execAsync = util.promisify(require('child_process').exec);

const tmpDir = '/tmp';

module.exports = async function encodeVideo(buffer) {
  const inputFilename = uuid();
  const inputFilePath = path.join(tmpDir, inputFilename);
  const outputFilename = `${uuid()}.mp4`;
  const outputFilePath = path.join(tmpDir, outputFilename);

  await writeFileAsync(inputFilePath, buffer);

  await execAsync('ffmpeg', `-i ${inputFilename} -c:v libx265 ${outputFilename}`.split(' '), {
    cwd: tmpDir,
  });

  const outputBuffer = await readFileAsync(outputFilePath);

  return outputBuffer;
}

