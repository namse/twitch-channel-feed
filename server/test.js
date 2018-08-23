// var a = require("./media");

// async function run() {
//   const { url, fields } = await a.post();
//   console.log(url);
//   Object.entries(fields).forEach(([key, value]) => {
//     console.log(`${key}:${value}`);
//   });
// }

// run();

const encodeImage = require('./media/encodeImage');
const fs = require('fs');
const fileType = require('file-type');

const filePath = './before.jpg';
const fileOutputPath = './after.jpg';
async function main() {
  const image = fs.readFileSync(filePath);
  const { ext } = fileType(image);
  const encodedImage = await encodeImage(image, ext);
  fs.writeFileSync(fileOutputPath, encodedImage);
}

main().catch(err => console.error(err));
