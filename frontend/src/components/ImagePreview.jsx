/**
 * ImagePreview — shows the uploaded source image thumbnail with metadata.
 *
 * Props:
 *   file: File | null
 *   preview: string | null  (object URL)
 */
export default function ImagePreview({ file, preview }) {
  if (!preview) return null;

  const sizeKB = file ? (file.size / 1024).toFixed(1) : "—";
  const name = file?.name ?? "image";

  return (
    <div className="mt-4 flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <img
        src={preview}
        alt="Uploaded sample thumbnail"
        className="w-14 h-14 object-cover rounded-md border border-slate-200 flex-shrink-0"
      />
      <div className="min-w-0">
        <p
          className="text-sm font-medium text-slate-800 truncate"
          title={name}
        >
          {name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{sizeKB} KB</p>
        <span className="inline-block mt-1.5 text-xs text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full font-medium">
          Ready for inference
        </span>
      </div>
    </div>
  );
}

