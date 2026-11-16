// Small inline icons so we do not depend on brand icons from a library.
export default function PlatformIcon({ platform, className = "h-4 w-4" }) {
  if (platform === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (platform === "X") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="5" r="2.2" />
      <path d="M10 9h4v1.8c.6-1.1 2-2.1 4-2.1 3.3 0 4 2.1 4 5V21h-4v-6c0-1.4-.3-2.5-1.8-2.5S14 13.6 14 15v6h-4z" />
    </svg>
  );
}
