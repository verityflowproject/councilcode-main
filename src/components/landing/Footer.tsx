export default function Footer() {
  return (
    <footer
      className="px-6 py-12"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(135deg, rgba(79,110,247,0.1) 0%, rgba(16,185,129,0.05) 100%)',
      }}
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ maxWidth: '1100px', margin: '0 auto' }}
      >
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
          className="text-xs"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
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
