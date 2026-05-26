"use client";

interface AdminHeaderProps {
  title: string;
  userEmail?: string | null;
  onMenuClick: () => void;
}

export default function AdminHeader({ title, userEmail, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-carbon/10 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-carbon/50 hover:text-carbon transition-colors rounded-lg hover:bg-carbon/5"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="font-semibold text-carbon text-lg">{title}</h1>
      </div>

      {/* Right: user */}
      {userEmail && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold text-sm font-semibold">
              {userEmail[0].toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block text-sm text-carbon/60 max-w-[180px] truncate">
            {userEmail}
          </span>
        </div>
      )}
    </header>
  );
}
