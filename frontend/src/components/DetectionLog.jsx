/**
 * DetectionLog — collapsible table listing individual detections.
 *
 * Props:
 *   detections: Array<{ id, class, confidence, coordinates }> | null
 *   visible: boolean
 */
export default function DetectionLog({ detections, visible }) {
  if (!visible || !detections || detections.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Detection Log
        </h2>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-teal-700 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5 font-medium">
          {detections.length} objects
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 text-slate-500 font-semibold uppercase tracking-wider w-10">
                #
              </th>
              <th className="text-left px-4 py-2.5 text-slate-500 font-semibold uppercase tracking-wider">
                Class
              </th>
              <th className="text-left px-4 py-2.5 text-slate-500 font-semibold uppercase tracking-wider">
                Confidence
              </th>
              <th className="text-left px-4 py-2.5 text-slate-500 font-semibold uppercase tracking-wider hidden sm:table-cell">
                Bounding Box (x, y, w, h)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {detections.map((det, idx) => (
              <tr
                // Replace det.id with idx because Python doesn't send an id field
                key={idx}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-2.5 text-slate-400 font-mono">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block flex-shrink-0" />
                    {/* Fallback to 'microplastic' if det.class is undefined */}
                    {det.class || "Microplastic"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <ConfidencePill value={det.confidence} />
                </td>
                <td className="px-4 py-2.5 text-slate-400 font-mono hidden sm:table-cell">
                  {/* Safely check for coordinates before joining to prevent crashes */}
                  {det.coordinates ? det.coordinates.map(n => Math.round(n)).join(", ") : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ConfidencePill({ value }) {
  // Multiply by 100 since Python returns decimals like 0.89 instead of 89
  const pct = Math.round(value * 100);
  const color =
    pct >= 85
      ? "text-teal-700 bg-teal-50 border-teal-100"
      : pct >= 65
        ? "text-amber-700 bg-amber-50 border-amber-100"
        : "text-red-700 bg-red-50 border-red-100";

  return (
    <span
      className={`inline-block border rounded-full px-2 py-0.5 font-semibold text-xs ${color}`}
    >
      {pct}%
    </span>
  );
}