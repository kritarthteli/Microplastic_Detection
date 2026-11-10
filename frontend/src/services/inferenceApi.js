/**
 * inferenceApi.js
 *
 * Service layer for the YOLOv8 microplastic detection backend.
 *
 * MOCK MODE (default):
 *   When USE_MOCK=true the service simulates network latency and returns
 *   fabricated results so the UI works without a real Python backend.
 *
 * LIVE MODE:
 *   Set USE_MOCK=false (or use the env var below).
 *   The backend should expose:
 *     POST /api/detect   multipart/form-data  { image: File }
 *     Response JSON:
 *       {
 *         annotated_image: "<base64 PNG>",
 *         particles_detected: number,
 *         avg_confidence: number,       // 0–1
 *         inference_time_ms: number,
 *         model_version: string,
 *         detections: [
 *           { id, class, confidence, bbox: [x, y, w, h] }
 *         ]
 *       }
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

const PLASTIC_CLASSES = [
  "Fragment",
  "Fiber",
  "Film",
  "Pellet",
  "Foam",
  "Bead",
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateMockDetections(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    class: PLASTIC_CLASSES[Math.floor(Math.random() * PLASTIC_CLASSES.length)],
    confidence: parseFloat(randomBetween(0.65, 0.98).toFixed(3)),
    bbox: [
      Math.floor(randomBetween(10, 400)),
      Math.floor(randomBetween(10, 400)),
      Math.floor(randomBetween(20, 100)),
      Math.floor(randomBetween(20, 100)),
    ],
  }));
}

/**
 * Draws mock bounding boxes over the input image using an offscreen canvas.
 * Returns a data URL of the annotated image.
 */
async function drawMockAnnotations(imageObjectURL, detections) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      const scaleX = img.naturalWidth / 512;
      const scaleY = img.naturalHeight / 512;

      detections.forEach((det) => {
        const [bx, by, bw, bh] = det.bbox;
        const x = bx * scaleX;
        const y = by * scaleY;
        const w = bw * scaleX;
        const h = bh * scaleY;
        const pct = Math.round(det.confidence * 100);

        // Box
        ctx.strokeStyle = "#14b8a6";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        // Label background
        const label = `${det.class} ${pct}%`;
        ctx.font = `bold ${Math.max(11, 13 * scaleX)}px Inter, sans-serif`;
        const textW = ctx.measureText(label).width;
        ctx.fillStyle = "#14b8a6";
        ctx.fillRect(x, y - 20 * scaleY, textW + 8, 20 * scaleY);

        // Label text
        ctx.fillStyle = "#fff";
        ctx.fillText(label, x + 4, y - 5 * scaleY);
      });

      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageObjectURL;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Runs microplastic detection on the provided image file.
 *
 * @param {File} imageFile
 * @returns {Promise<{
 *   annotatedImageUrl: string,
 *   particlesDetected: number,
 *   avgConfidence: string,
 *   inferenceTime: number,
 *   modelVersion: string,
 *   detections: Array,
 * }>}
 */
export async function runDetection(imageFile) {
  if (USE_MOCK) {
    return runMockDetection(imageFile);
  }
  return runLiveDetection(imageFile);
}

async function runMockDetection(imageFile) {
  // Simulate backend latency
  const latency = Math.floor(randomBetween(900, 1800));
  await new Promise((r) => setTimeout(r, latency));

  const count = Math.floor(randomBetween(6, 22));
  const detections = generateMockDetections(count);
  const avgConf = detections.reduce((s, d) => s + d.confidence, 0) / count;

  const objectURL = URL.createObjectURL(imageFile);
  const annotatedImageUrl = await drawMockAnnotations(objectURL, detections);
  URL.revokeObjectURL(objectURL);

  return {
    annotatedImageUrl,
    particlesDetected: count,
    avgConfidence: `${Math.round(avgConf * 100)}`,
    inferenceTime: Math.floor(randomBetween(80, 180)),
    modelVersion: "YOLOv8n",
    detections,
  };
}

async function runLiveDetection(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE}/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Backend error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  return {
    annotatedImageUrl: `data:image/png;base64,${data.annotated_image}`,
    particlesDetected: data.particles_detected,
    avgConfidence: `${Math.round(data.avg_confidence * 100)}`,
    inferenceTime: data.inference_time_ms,
    modelVersion: data.model_version ?? "YOLOv8",
    detections: data.detections ?? [],
  };
}

