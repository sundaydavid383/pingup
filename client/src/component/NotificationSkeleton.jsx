// NotificationSkeleton.jsx
const NotificationSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="relative flex items-center gap-3 p-2 rounded-md bg-gray-200 overflow-hidden"
        >
          {/* Circle skeleton for icon */}
          <div className="w-8 h-8 rounded-full bg-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full shimmer"></div>
          </div>

          {/* Text skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-gray-300 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full shimmer"></div>
            </div>
            <div className="h-2 w-1/3 bg-gray-300 rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;