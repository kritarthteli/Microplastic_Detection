import { useRef, useState } from "react";

/**
 * UploadZone — drag-and-drop / browse file picker for water sample images.
 *
 * Props:
 *   onFileSelect(file: File) — called when user picks / drops an image
 *   disabled: boolean        — grays out the zone during inference
 */
export default function UploadZone({ onFileSelect, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const borderColor = isDragging
    ? "border-teal-500 bg-teal-50"
    : "border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50";

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative flex flex-col items-center justify-center
        border-2 border-dashed rounded-xl
        min-h-64 p-8 text-center
        transition-colors duration-200 cursor-pointer
        ${borderColor}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
      aria-label="Upload water sample image"
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Upload icon */}
      <div className="mb-4 p-3 bg-slate-100 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-slate-400"
        >
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      </div>

      <p className="text-sm font-medium text-slate-700 mb-1">
        Drag &amp; drop water sample image here
      </p>
      <p className="text-xs text-slate-400 mb-4">or</p>

      <span
        className="
          inline-flex items-center gap-2
          text-sm font-medium text-teal-700
          bg-teal-50 border border-teal-200
          px-4 py-1.5 rounded-lg
          hover:bg-teal-100 transition-colors
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
          className="w-4 h-4"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        Browse files
      </span>

      <p className="mt-4 text-xs text-slate-400">
        Supports PNG, JPG, TIFF — up to 20 MB
      </p>

      {isDragging && (
        <div className="absolute inset-0 rounded-xl bg-teal-50/60 flex items-center justify-center">
          <span className="text-teal-700 font-semibold text-sm">
            Drop to upload
          </span>
        </div>
      )}
    </div>
  );
}

