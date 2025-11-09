export default function LiveIndicator() {
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-2 border-2 border-primary shadow-md" data-testid="indicator-live">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
      </div>
      <span className="text-primary font-bold text-sm uppercase tracking-wide">LIVE</span>
    </div>
  );
}
