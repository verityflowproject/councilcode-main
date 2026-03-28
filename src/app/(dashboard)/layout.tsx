import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      <div
        className="min-h-screen"
        style={{ background: 'var(--background)' }}
      >
        <DashboardNav
          email={session.user.email}
          plan={session.user.plan}
        />

        <main className="px-6 py-8 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
