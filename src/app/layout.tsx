import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CouncilCode — Your AI Engineering Firm',
  description:
    'Five AI models collaborate as a structured engineering team to build your project. Zero hallucinations. Persistent context. Code quality that never drifts.',
  openGraph: {
    title: 'CouncilCode — Your AI Engineering Firm',
    description:
      'Five AI models. One codebase. Every line fact-checked before you see it.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
