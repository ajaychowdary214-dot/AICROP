import { diseases, type Disease } from './diseaseDatabase';

export type AnalysisResult = {
  disease: Disease;
  confidence: number;
  severity: string;
  isHealthy: boolean;
  treatment: string;
  topMatches: { name: string; confidence: number }[];
};

export async function analyzeImage(imageDataUrl: string): Promise<AnalysisResult> {
  const img = await loadImage(imageDataUrl);
  const { avgR, avgG, avgB, brownRatio, yellowRatio, whiteRatio, darkRatio, greenness, brightness } =
    analyzePixels(img);

  const scores = diseases.map((disease) => {
    let score = 0;
    const { r, g, b } = disease.colorSignature;

    if (avgR >= r[0] && avgR <= r[1]) score += 25;
    else if (avgR >= r[0] - 20 && avgR <= r[1] + 20) score += 12;

    if (avgG >= g[0] && avgG <= g[1]) score += 25;
    else if (avgG >= g[0] - 20 && avgG <= g[1] + 20) score += 12;

    if (avgB >= b[0] && avgB <= b[1]) score += 15;
    else if (avgB >= b[0] - 20 && avgB <= b[1] + 20) score += 7;

    if (disease.brownSpots && brownRatio > 0.15) score += 20;
    else if (disease.brownSpots && brownRatio > 0.08) score += 10;
    else if (!disease.brownSpots && brownRatio < 0.05) score += 10;

    if (disease.yellowing && yellowRatio > 0.2) score += 15;
    else if (disease.yellowing && yellowRatio > 0.1) score += 8;
    else if (!disease.yellowing && yellowRatio < 0.08) score += 8;

    if (disease.whiteMold && whiteRatio > 0.15) score += 15;
    else if (!disease.whiteMold && whiteRatio < 0.05) score += 8;

    if (disease.darkLesions && darkRatio > 0.12) score += 12;
    else if (!disease.darkLesions && darkRatio < 0.05) score += 6;

    if (disease.id === 'healthy' && greenness > 0.5 && brownRatio < 0.05) score += 30;
    if (disease.id === 'healthy' && brightness > 80 && brightness < 180) score += 10;

    return { disease, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const maxScore = scores[0].score;
  const secondScore = scores[1]?.score || 0;
  const rawConfidence = maxScore > 0 ? (maxScore / 145) * 100 : 0;

  let confidence = Math.min(98, Math.max(65, rawConfidence + 25));
  if (maxScore - secondScore < 5) confidence -= 8;

  const topDisease = scores[0].disease;
  const topMatches = scores.slice(0, 3).map((s) => ({
    name: s.disease.name,
    confidence: Math.round(Math.min(98, Math.max(60, (s.score / 145) * 100 + 25))),
  }));

  const isHealthy = topDisease.id === 'healthy';
  const severity = isHealthy ? 'None' : topDisease.severity;
  const treatment = topDisease.treatment.join('. ');

  return {
    disease: topDisease,
    confidence: Math.round(confidence),
    severity,
    isHealthy,
    treatment,
    topMatches,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function analyzePixels(img: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const maxSize = 200;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let totalR = 0, totalG = 0, totalB = 0;
  let brownCount = 0, yellowCount = 0, whiteCount = 0, darkCount = 0, greenCount = 0;
  const pixelCount = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    totalR += r;
    totalG += g;
    totalB += b;

    if (isBrown(r, g, b)) brownCount++;
    if (isYellow(r, g, b)) yellowCount++;
    if (isWhite(r, g, b)) whiteCount++;
    if (isDark(r, g, b)) darkCount++;
    if (isGreen(r, g, b)) greenCount++;
  }

  return {
    avgR: totalR / pixelCount,
    avgG: totalG / pixelCount,
    avgB: totalB / pixelCount,
    brownRatio: brownCount / pixelCount,
    yellowRatio: yellowCount / pixelCount,
    whiteRatio: whiteCount / pixelCount,
    darkRatio: darkCount / pixelCount,
    greenness: greenCount / pixelCount,
    brightness: (totalR + totalG + totalB) / (pixelCount * 3),
  };
}

function isBrown(r: number, g: number, b: number): boolean {
  return r > 60 && r < 180 && g > 30 && g < 130 && b < 80 && r > g && g > b;
}

function isYellow(r: number, g: number, b: number): boolean {
  return r > 150 && g > 150 && b < 100 && Math.abs(r - g) < 40;
}

function isWhite(r: number, g: number, b: number): boolean {
  return r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15;
}

function isDark(r: number, g: number, b: number): boolean {
  return r < 60 && g < 60 && b < 60;
}

function isGreen(r: number, g: number, b: number): boolean {
  return g > 60 && g > r && g > b && r < 150;
}
