/**
 * VerityFlow Design System — Token Reference
 *
 * Source of truth: src/styles/globals.css
 * All values here mirror the CSS custom properties defined there.
 * Use CSS variables (var(--token)) in components rather than these
 * constants directly — this file exists for documentation and for
 * cases where a JS value is needed (e.g. canvas, dynamic styles).
 */

// ─── Backgrounds ─────────────────────────────────────────────────────────────
// Three-level depth system: base → surface → elevated
export const BG_BASE     = '#050508'  // page/html background
export const BG_SURFACE  = '#0C0E14'  // cards, panels, nav
export const BG_ELEVATED = '#12141C'  // inputs, dropdowns, tooltips

// ─── Text ────────────────────────────────────────────────────────────────────
export const TEXT_PRIMARY   = '#EAEEF4'  // headings, primary content
export const TEXT_SECONDARY = '#9BA5B8'  // body copy, secondary labels
export const TEXT_MUTED     = '#566070'  // meta, timestamps, eyebrows

// ─── Accent / Brand ──────────────────────────────────────────────────────────
export const ACCENT_BLUE      = '#4361EE'              // primary brand, CTAs
export const ACCENT_BLUE_GLOW = 'rgba(67,97,238,0.25)' // glow shadows
export const ACCENT_BLUE_HOVER = '#3251D4'             // button hover state
export const ACCENT_CYAN      = '#06B6D4'              // secondary brand
export const ACCENT_GREEN     = '#10B981'              // success, live indicators, checkmarks
export const ACCENT_AMBER     = '#F59E0B'              // warning, building status
export const ACCENT_RED       = '#EF4444'              // error, destructive, critical

// ─── Borders ─────────────────────────────────────────────────────────────────
export const BORDER_SUBTLE  = 'rgba(255,255,255,0.05)'  // section dividers, card edges
export const BORDER_DEFAULT = 'rgba(255,255,255,0.09)'  // standard inputs, cards
export const BORDER_STRONG  = 'rgba(255,255,255,0.16)'  // hover state borders

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONT_DISPLAY = "'Space Grotesk', sans-serif"  // headings, logo, card titles
export const FONT_BODY    = "'Jost', sans-serif"            // body copy, UI labels, buttons
export const FONT_MONO    = "'JetBrains Mono', monospace"  // badges, eyebrows, code, meta

// ─── Border Radius ───────────────────────────────────────────────────────────
export const RADIUS_SM = '6px'   // small chips, tight elements
export const RADIUS_MD = '10px'  // buttons, inputs, standard cards
export const RADIUS_LG = '16px'  // medium panels
export const RADIUS_XL = '24px'  // large cards, terminal panels, hero blocks

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const SHADOW_CARD      = '0 1px 3px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)'
export const SHADOW_GLOW_BLUE = '0 0 60px rgba(67,97,238,0.2), 0 0 120px rgba(67,97,238,0.08)'

// ─── Model Colors ────────────────────────────────────────────────────────────
// Role-specific accent colors used in council/session UI.
export const COLOR_CLAUDE     = '#9580FF'
export const COLOR_GPT        = '#34D399'
export const COLOR_CODESTRAL  = '#FBBF24'
export const COLOR_GEMINI     = '#60A5FA'
export const COLOR_PERPLEXITY = '#C084FC'

// ─── Layout ──────────────────────────────────────────────────────────────────
export const MAX_WIDTH_FULL    = '1200px'  // full-bleed pages (compare, home)
export const MAX_WIDTH_CONTENT = '840px'   // narrative cards, callout blocks
export const MAX_WIDTH_NARROW  = '720px'   // article/legal content
export const MAX_WIDTH_HERO    = '800px'   // hero copy area
export const NAV_HEIGHT        = '64px'    // fixed nav — used for page-top offsets

// ─── Section Spacing ─────────────────────────────────────────────────────────
export const SECTION_PADDING_Y_LG = '120px'  // hero, CTA sections
export const SECTION_PADDING_Y_MD = '80px'   // standard sections
export const PAGE_PADDING_X       = '40px'   // horizontal page gutter

// ─── Animation Durations ─────────────────────────────────────────────────────
export const TRANSITION_FAST   = '0.15s ease'  // hover color/bg changes
export const TRANSITION_NORMAL = '0.2s ease'   // button lifts, opacity
export const TRANSITION_FADE   = '0.55s ease'  // scroll fade-in (.fade-up)

// ─── CSS Variable Reference Map ──────────────────────────────────────────────
// Quick lookup of all CSS variable names used across the codebase.
export const CSS_VARS = {
  // Backgrounds
  bgBase:     'var(--bg-base)',
  bgSurface:  'var(--bg-surface)',
  bgElevated: 'var(--bg-elevated)',

  // Text
  textPrimary:   'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted:     'var(--text-muted)',

  // Accents
  accentBlue:  'var(--accent-blue)',
  accentCyan:  'var(--accent-cyan)',
  accentGreen: 'var(--accent-green)',
  accentAmber: 'var(--accent-amber)',
  accentRed:   'var(--accent-red)',

  // Borders
  borderSubtle:  'var(--border-subtle)',
  borderDefault: 'var(--border-default)',
  borderStrong:  'var(--border-strong)',

  // Typography
  fontDisplay: 'var(--font-display)',
  fontBody:    'var(--font-body)',
  fontMono:    'var(--font-mono)',

  // Radii
  radiusSm: 'var(--radius-sm)',
  radiusMd: 'var(--radius-md)',
  radiusLg: 'var(--radius-lg)',
  radiusXl: 'var(--radius-xl)',

  // Shadows
  shadowCard:     'var(--shadow-card)',
  shadowGlowBlue: 'var(--shadow-glow-blue)',

  // Backward-compat aliases (dashboard / council / auth)
  background:   'var(--background)',   // = --bg-base
  surface:      'var(--surface)',      // = --bg-surface
  border:       'var(--border)',       // = --border-default
  accent:       'var(--accent)',       // = --accent-blue
  accentHover:  'var(--accent-hover)', // = #3251d4
} as const
