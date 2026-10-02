// Re-mounts on every navigation, giving each page a 300ms fade-in (agent.md §6.4).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
