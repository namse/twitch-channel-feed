import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

const MAX_WIDTH = 300;

async function resizeImage(buffer) {
  const image = sharp(buffer);

  const { width } = await image.metadata();

  if (width <= MAX_WIDTH) {
    return buffer;
  }

  const resizedBuffer = await image.resize(MAX_WIDTH)
    .toBuffer();

  return resizedBuffer;
}

export default async function encodeImage(buffer) {
  const resizedBuffer = await resizeImage(buffer);

  const resultBuffer = await imagemin.buffer(resizedBuffer, {
    plugins: [
      imageminWebp(),
    ],
  });

  return resultBuffer;
}
