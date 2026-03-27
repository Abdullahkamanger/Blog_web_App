const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-4 h-[400px]">
    <div className="bg-slate-200 dark:bg-slate-700 h-52 rounded-xl mb-4" />
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
  </div>
);

export default SkeletonCard;
