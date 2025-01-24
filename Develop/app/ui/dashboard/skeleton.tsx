import '@/app/ui/dashboard/skeleton'; // Import the CSS for shimmer animation

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// Skeleton component for the image
export function ImageSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}></div>
  );
}

// Skeleton component for the dashboard page
export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Page title */}
      <div className="h-6 w-1/4 rounded-md bg-gray-200 shimmer"></div>

      {/* Image placeholder */}
      <ImageSkeleton />
    </div>
  );
}
