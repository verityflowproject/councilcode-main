import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':     'var(--bg-base)',
        'bg-surface':  'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'accent-blue': 'var(--accent-blue)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-green':'var(--accent-green)',
        'accent-amber':'var(--accent-amber)',
        'accent-red':  'var(--accent-red)',
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted':     'var(--text-muted)',
        background:    'var(--background)',
        surface:       'var(--surface)',
        border:        'var(--border)',
        accent:        'var(--accent)',
        'accent-hover':'var(--accent-hover)',
        claude:     'var(--claude)',
        gpt4o:      'var(--gpt4o)',
        codestral:  'var(--codestral)',
        gemini:     'var(--gemini)',
        perplexity: 'var(--perplexity)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        sans:    ['var(--font-sans)'],
        mono:    ['var(--font-mono)'],
      },
      borderRadius: {
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
      },
      boxShadow: {
        card:      'var(--shadow-card)',
        'glow-blue': 'var(--shadow-glow-blue)',
      },
    },
  },
  plugins: [],
}

export default config
