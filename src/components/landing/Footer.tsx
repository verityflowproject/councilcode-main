export default function Footer() {
  return (
    <footer
      className="px-6 py-12 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-lg font-bold"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Council<span style={{ color: 'var(--accent)' }}>Code</span>
        </span>
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          Five models. One codebase. Zero hallucinations.
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} CouncilCode
        </p>
      </div>
    </footer>
  )
}
