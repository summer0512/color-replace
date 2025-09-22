// Worker script for image processing
interface ColorPair {
  sourceColor: string;
  targetColor: string;
  tolerance: number;
}

interface ProcessImageMessage {
  type: 'process';
  imageData: ImageData;
  colorPairs: ColorPair[];
}

// Convert hex color to RGB
function hexToRgb(hex: string | null): { r: number; g: number; b: number; a: number } | null {
  if (!hex || hex === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
}

// Calculate color similarity (0-1)
function getColorSimilarity(
  r1: number, g1: number, b1: number, a1: number,
  r2: number, g2: number, b2: number, a2: number
): number {
  // If either color is transparent, only compare alpha values
  if (a1 === 0 || a2 === 0) {
    return Math.abs(a1 - a2) / 255;
  }

  // For non-transparent colors, compare RGB values
  const rMean = (r1 + r2) / 2;
  const deltaR = r1 - r2;
  const deltaG = g1 - g2;
  const deltaB = b1 - b2;
  
  // Weighted distance calculation (gives more weight to red channel)
  const distance = Math.sqrt(
    (2 + rMean / 256) * deltaR * deltaR +
    4 * deltaG * deltaG +
    (2 + (255 - rMean) / 256) * deltaB * deltaB
  );
  
  return distance / 765; // Normalize to 0-1 range
}

// Process the image data
function processImage(imageData: ImageData, colorPairs: ColorPair[]): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Check each color pair
    for (const pair of colorPairs) {
      const sourceRgb = hexToRgb(pair.sourceColor);
      const targetRgb = hexToRgb(pair.targetColor);
      
      if (!sourceRgb || !targetRgb) continue;

      const similarity = getColorSimilarity(
        r, g, b, a,
        sourceRgb.r, sourceRgb.g, sourceRgb.b, sourceRgb.a
      );

      // If color is similar enough (within tolerance), replace it
      if (similarity <= pair.tolerance / 100) {
        data[i] = targetRgb.r;
        data[i + 1] = targetRgb.g;
        data[i + 2] = targetRgb.b;

        // Only adjust alpha when toggling transparency state
        if (targetRgb.a === 0) {
          data[i + 3] = targetRgb.a;
        } else if (sourceRgb.a === 0) {
          data[i + 3] = targetRgb.a;
        }
        break; // Stop checking other pairs once we've found a match
      }
    }
  }

  return imageData;
}

// Handle messages from the main thread
self.onmessage = (e: MessageEvent<ProcessImageMessage>) => {
  if (e.data.type === 'process') {
    const result = processImage(e.data.imageData, e.data.colorPairs);
    // 使用正确的 postMessage 重载，添加 transfer 选项
    self.postMessage(
      { type: 'done', imageData: result },
      { transfer: [result.data.buffer] }
    );
  }
};
