/**
 * Navbar — top-of-page header with branding and YOLOv8 engine badge.
 */
export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-md bg-teal-600 flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <circle cx="11" cy="11" r="3" />
            </svg>
          </div>
          <div>
            <span className="text-slate-900 font-semibold text-lg tracking-tight">
              Microplastic Detector
            </span>
            <span className="ml-2 text-xs text-slate-400 font-medium hidden sm:inline">
              Automated Detection System
            </span>
          </div>
        </div>

        {/* Right side — engine badge + status */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>
            YOLOv8 Engine
          </span>
          <span className="text-xs text-slate-400 font-medium border border-slate-200 rounded-full px-3 py-1">
            v1.0.0
          </span>
        </div>
      </div>
    </header>
  );
}

