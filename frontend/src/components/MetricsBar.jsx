/**
 * MetricsBar — horizontal card row showing inference statistics.
 *
 * Props:
 *   metrics: { particlesDetected, fibersDetected, fragmentsDetected, avgConfidence, inferenceTime } | null
 *   visible: boolean
 */

const METRIC_DEFINITIONS = [
  {
    key: "particlesDetected",
    label: "Total Particles",
    unit: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      </svg>
    ),
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  // NEW: Fibers Definition
  {
    key: "fibersDetected",
    label: "Fibers",
    unit: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M4 14.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 1 5 0" />
      </svg>
    ),
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  // NEW: Fragments Definition
  {
    key: "fragmentsDetected",
    label: "Microplastics",
    unit: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 2l3 5h5l-4 4 1 6-5-3-5 3 1-6-4-4h5z" />
      </svg>
    ),
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    key: "avgConfidence",
    label: "Avg. Confidence",
    unit: "%",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "inferenceTime",
    label: "Inference Time",
    unit: "ms",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    key: "modelVersion",
    label: "Model",
    unit: "",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export default function MetricsBar({ metrics, visible }) {
  if (!visible) return null;

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Inference Metrics
        </h2>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-mono">
          {metrics ? new Date().toLocaleTimeString() : "—"}
        </span>
      </div>

      {/* Changed CSS grid from 4 columns to 6 columns for large screens */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {METRIC_DEFINITIONS.map((def) => (
          <MetricCard
            key={def.key}
            definition={def}
            value={metrics?.[def.key] ?? "—"}
          />
        ))}
      </div>

      {/* Footer note */}
      {metrics && (
        <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Live inference results from YOLOv8 backend.
        </p>
      )}
    </section>
  );
}

function MetricCard({ definition, value }) {
  const { label, unit, icon, color, bg, border } = definition;

  return (
    <div
      className={`
        flex items-start gap-3 p-4
        bg-white border border-slate-200 rounded-xl
        shadow-xs hover:shadow-sm transition-shadow
      `}
    >
      <div className={`p-2 rounded-lg ${bg} border ${border} flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium leading-tight truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-slate-800 mt-0.5 tracking-tight leading-none">
          {value}
          {value !== "—" && (
            <span className="text-sm font-medium text-slate-400 ml-0.5">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}