import ZipBuilder from './ZipBuilder';

export type ProcessedImageExport = { name: string; canvas: HTMLCanvasElement | null };

function startDownload(href: string, filename: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  try { link.click(); } finally { link.remove(); }
}

// Resolve only after valid image data is generated and the browser download is
// initiated. The browser does not expose whether a user saves the resulting file.
export async function downloadProcessedImages(images: ProcessedImageExport[]) {
  if (!images.length || images.some(({ canvas }) => !canvas || canvas.width <= 0 || canvas.height <= 0)) {
    throw new Error('Processed images are not ready');
  }
  if (images.length === 1) {
    const image = images[0];
    const data = image.canvas!.toDataURL('image/png');
    if (!data.startsWith('data:image/png;base64,') || !data.split(',')[1]) throw new Error('Empty image data');
    startDownload(data, image.name);
    return;
  }

  const zip = new ZipBuilder();
  for (const image of images) zip.addCanvas(image.name, image.canvas!);
  const blob = await zip.build();
  if (!blob.size) throw new Error('Empty archive');
  const href = URL.createObjectURL(blob);
  try {
    const pad = (value: number) => value.toString().padStart(2, '0');
    const now = new Date();
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    startDownload(href, `color-replaced-images-${timestamp}.zip`);
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
}
