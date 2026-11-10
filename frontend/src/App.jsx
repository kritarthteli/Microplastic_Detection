import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import UploadZone from "./components/UploadZone";
import ImagePreview from "./components/ImagePreview";
import RunInferenceButton from "./components/RunInferenceButton";
import ResultsViewer from "./components/ResultsViewer";
import MetricsBar from "./components/MetricsBar";
import DetectionLog from "./components/DetectionLog";

// App state shape
const INITIAL_STATE = {
  uploadedFile: null,       // File object
  previewUrl: null,         // local object URL for thumbnail
  status: "idle",           // "idle" | "loading" | "done" | "error"
  resultImageUrl: null,     // annotated image URL
  metrics: null,            // { particlesDetected, fibersDetected, fragmentsDetected, avgConfidence, inferenceTime, modelVersion }
  detections: null,         // Array of individual detection objects
  errorMessage: null,
};

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);

  // ------------------------------------------------------------------ //
  // Handlers
  // ------------------------------------------------------------------ //

  const handleFileSelect = useCallback((file) => {
    // Revoke old preview URL if any
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);

    const previewUrl = URL.createObjectURL(file);
    setState({
      ...INITIAL_STATE,
      uploadedFile: file,
      previewUrl,
    });
  }, [state.previewUrl]);

  const handleRunInference = useCallback(async () => {
    if (!state.uploadedFile || state.status === "loading") return;

    setState((prev) => ({
      ...prev,
      status: "loading",
      resultImageUrl: null,
      metrics: null,
      detections: null,
      errorMessage: null,
    }));

    try {
      const formData = new FormData();
      formData.append("file", state.uploadedFile);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to connect to Python backend");
      const data = await response.json();

      const avgConf = data.detections.length
        ? Math.round((data.detections.reduce((sum, det) => sum + det.confidence, 0) / data.detections.length) * 100)
        : 0;

      setState((prev) => ({
        ...prev,
        status: "done",
        resultImageUrl: data.annotated_image,
        metrics: {
          particlesDetected: data.particle_count,
          fibersDetected: data.fibers_count,
          fragmentsDetected: data.fragments_count,
          avgConfidence: avgConf,
          inferenceTime: data.inference_time,
          modelVersion: "YOLOv8s (V2)",
        },
        detections: data.detections,
      }));
    } catch (err) {
      console.error("[Inference Error]", err);
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: err.message ?? "An unknown error occurred.",
      }));
    }
  }, [state.uploadedFile, state.status]);

  const handleReset = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    if (state.resultImageUrl && state.resultImageUrl.startsWith("blob:"))
      URL.revokeObjectURL(state.resultImageUrl);
    setState(INITIAL_STATE);
  };

  const handleExport = useCallback(() => {
    if (!state.detections || state.detections.length === 0) return;

    // Create CSV headers
    const csvRows = ["ID,Class,Confidence,BoundingBox"];

    // Add data rows
    state.detections.forEach((det, idx) => {
      const id = String(idx + 1).padStart(2, '0');
      // Wrap coordinates in quotes so the commas don't break the CSV columns
      csvRows.push(`${id},${det.class},${det.confidence},"${det.coordinates.join(', ')}"`);
    });

    // Trigger the download
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'microplastic_analysis_report.csv';
    link.click();

    URL.revokeObjectURL(url);
  }, [state.detections]);

  // ------------------------------------------------------------------ //
  // Derived values
  // ------------------------------------------------------------------ //
  const isLoading = state.status === "loading";
  const hasResult = state.status === "done";
  const hasError = state.status === "error";
  const hasFile = Boolean(state.uploadedFile);

  // ------------------------------------------------------------------ //
  // Render
  // ------------------------------------------------------------------ //
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Page body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* ── Page title row ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Detection Workspace
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload a microscopy image of a water sample to identify and
              classify microplastic particles.
            </p>
          </div>

          {/* Reset button — only shown when there's something to clear */}
          {hasFile && (
            <button
              onClick={handleReset}
              className="
                self-start sm:self-auto
                flex items-center gap-1.5 text-xs font-medium text-slate-500
                border border-slate-200 bg-white rounded-lg px-3 py-2
                hover:border-slate-300 hover:text-slate-700 transition-colors
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-5.5" />
              </svg>
              New Analysis
            </button>
          )}
        </div>

        {/* ── Two-column workspace ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT: Upload panel ── */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
                  Input Image
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Water sample microscopy
                </p>
              </div>
              <StepBadge step="01" />
            </div>

            {/* Upload zone */}
            <UploadZone onFileSelect={handleFileSelect} disabled={isLoading} />

            {/* Thumbnail preview of selected file */}
            <ImagePreview file={state.uploadedFile} preview={state.previewUrl} />

            {/* Error banner */}
            {hasError && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-700">
                    Inference Failed
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">
                    {state.errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* CTA button */}
            <RunInferenceButton
              onClick={handleRunInference}
              disabled={!hasFile}
              loading={isLoading}
            />

            {/* Help text */}
            <p className="mt-3 text-xs text-slate-400 text-center">
              {hasFile
                ? "Click 'Run Inference' to start detection"
                : "Select an image above to begin"}
            </p>
          </section>

          {/* ── RIGHT: Results panel ── */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-widest">
                  Detection Output
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  YOLOv8 annotated result
                </p>
              </div>
              <div className="flex items-center gap-3">
                {hasResult && state.detections?.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 rounded-md px-2.5 py-1 hover:bg-teal-100 hover:border-teal-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export
                  </button>
                )}
                <StepBadge step="02" />
              </div>
            </div>
            <ResultsViewer
              resultImage={state.resultImageUrl}
              loading={isLoading}
            />
          </section>
        </div>

        {/* ── Metrics bar ─────────────────────────────────────────── */}
        <MetricsBar metrics={state.metrics} visible={hasResult} />

        {/* ── Detection log table ──────────────────────────────────── */}
        <DetectionLog detections={state.detections} visible={hasResult} />

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="mt-16 pb-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            Microplastic Detection System &mdash; Research Prototype
          </p>
          <p className="text-xs text-slate-400">
            Powered by&nbsp;
            <span className="font-medium text-slate-500">YOLOv8</span>
            &nbsp;&amp;&nbsp;
            <span className="font-medium text-slate-500">React + Vite</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

/** Small decorative step badge */
function StepBadge({ step }) {
  return (
    <span className="text-xs font-mono font-bold text-slate-300 border border-slate-200 rounded px-1.5 py-0.5">
      {step}
    </span>
  );
}