/**
 * RunInferenceButton — primary CTA with loading state.
 *
 * Props:
 *   onClick: () => void
 *   disabled: boolean
 *   loading: boolean
 */
export default function RunInferenceButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full mt-5 flex items-center justify-center gap-2.5
        px-6 py-3 rounded-lg text-sm font-semibold
        transition-all duration-200 select-none
        ${
          disabled || loading
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            : "bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] shadow-sm hover:shadow-md"
        }
      `}
      aria-busy={loading}
    >
      {loading ? (
        <>
          {/* Spinner */}
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Running Inference…
        </>
      ) : (
        <>
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
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Run Inference
        </>
      )}
    </button>
  );
}

