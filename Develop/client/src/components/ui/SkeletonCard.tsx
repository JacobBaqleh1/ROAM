export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden border border-gray-200 bg-white shadow-card">
      <div className="bg-gray-300 h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="bg-gray-300 h-4 rounded-full w-3/4" />
        <div className="bg-gray-200 h-3 rounded-full w-1/2" />
        <div className="bg-gray-200 h-3 rounded-full w-5/6" />
      </div>
    </div>
  );
}
