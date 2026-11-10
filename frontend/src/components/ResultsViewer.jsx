export default function ResultsViewer({ resultImage, loading }) {
  // 1. Show a loading spinner while Python is processing
  if (loading) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium animate-pulse">Running YOLOv8 inference...</p>
      </div>
    );
  }

  // 2. Show a placeholder if no image has been processed yet
  if (!resultImage) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl border-dashed">
        <p className="text-sm text-slate-400">Awaiting image upload...</p>
      </div>
    );
  }

  // 3. Show the final annotated image
  return (
    // The "overflow-hidden" class here is what stops the image from bleeding out of the rounded corners
    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
      <img
        src={resultImage}
        alt="Annotated Microplastics"
        className="w-full h-auto block"
      />
    </div>
  );
}