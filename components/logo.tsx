export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="ClientFlow"
    >
      <rect width="32" height="32" rx="8" fill="#3340F0" />
      <rect x="7" y="8" width="18" height="3.5" rx="1.75" fill="#fff" opacity=".35" />
      <rect x="7" y="14.25" width="18" height="3.5" rx="1.75" fill="#fff" opacity=".35" />
      <rect x="7" y="20.5" width="11" height="3.5" rx="1.75" fill="#FFE45C" />
      <path d="M21 22.4l2 2 3.6-4.4" fill="none" stroke="#FFE45C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span
        className={`font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        ClientFlow
      </span>
    </span>
  );
}
