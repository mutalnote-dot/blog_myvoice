export function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-main)]/90 backdrop-blur-md border-b border-[var(--color-card-border)] px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-accent)]">My Voice</h1>
      </div>
    </header>
  );
}
