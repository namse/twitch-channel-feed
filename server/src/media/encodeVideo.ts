import util from 'util';
import uuid from 'uuid/v4';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const execAsync = util.promisify(exec);

const tmpDir = '/tmp';
const binDir = path.join(__dirname, '../../bin');
const MAX_WIDTH = 300;

export default async function encodeVideo(buffer) {
  const inputFilename = uuid();
  const inputFilePath = path.join(tmpDir, inputFilename);
  const outputFilename = `${uuid()}.mp4`;
  const outputFilePath = path.join(tmpDir, outputFilename);

  await writeFileAsync(inputFilePath, buffer);

  // tslint:disable-next-line
  const command = `./ffmpeg -i ${inputFilePath} -c:v libx264 -vf "scale=w=min(iw\\,${MAX_WIDTH}):h=-2" -crf 24 ${outputFilePath}`;
  console.log(command);
  const { stdout, stderr } = await execAsync(command, {
    cwd: binDir,
  });
  console.log(stdout);
  console.log(stderr);

  const outputBuffer = await readFileAsync(outputFilePath);

  return outputBuffer;
}
