var ffmpeg = require("ffmpeg.js");
var fs = require("fs");
var testData = new Uint8Array(fs.readFileSync("C:\\Users\\user\\Documents\\15ec4b48dfc39cf43.gif"));
// Encode test video to VP8.




var result = ffmpeg({
  MEMFS: [{ name: "test.gif", data: testData }],
  arguments: '-f gif -i infile.gif outfile.mp4'.split(' '),
  // Ignore stdin read requests.
  stdin: function () { },
});
// Write out.webm to disk.
var out = result.MEMFS[0];
console.log(out);
fs.writeFileSync(out.name, Buffer(out.data));
