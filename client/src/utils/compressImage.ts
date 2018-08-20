async function getBase64(file: File): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

async function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    }
    image.src = base64;
  });
}

export default async function compressImage(file: File, maxWidth: number): Promise<string> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error('canvas context is null');
  }

  const base64 = await getBase64(file);
  const image = await loadImage(base64);

  const scale = image.width <= maxWidth ? 1 : maxWidth / image.width;
  const destWidth = scale * image.width;
  const destHeight = scale * image.height;

  canvas.width = destWidth;
  canvas.height = destHeight;
  ctx.drawImage(image, 0, 0, destWidth, destHeight);

  return canvas.toDataURL('image/jpeg', 1.0);
}


