export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-600">Loading your workspace...</p>
      </div>
    </div>
  );
};
