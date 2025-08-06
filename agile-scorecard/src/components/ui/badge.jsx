export function Badge({ children, className = "" }) {
  return <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${className}`}>{children}</span>;
}
