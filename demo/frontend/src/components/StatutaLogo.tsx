export const StatutaLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect x="4" y="8" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
        <rect x="4" y="13" width="20" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
        <rect x="4" y="18" width="20" height="3" rx="1.5" fill="currentColor" />
        <circle cx="22" cy="8" r="4" fill="currentColor" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="flex flex-col">
        <span className="font-semibold text-foreground leading-none">Statuta</span>
        <span className="text-xs text-muted-foreground leading-none mt-0.5">
          Visual Git Diff for Swiss Statutes
        </span>
      </div>
    </div>
  );
};
