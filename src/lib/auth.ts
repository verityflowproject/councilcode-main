import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import clientPromise from '@/lib/db/mongoClient'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'

// #region agent log
;(async () => {
  try {
    await fetch('http://127.0.0.1:7762/ingest/6faa078f-6949-48af-ac2f-612e80285b60', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '45ef32' },
      body: JSON.stringify({
        sessionId: '45ef32', location: 'auth.ts:module-init', message: 'auth module loaded – env var presence',
        data: {
          has_AUTH_SECRET: !!process.env.AUTH_SECRET,
          has_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
          has_GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
          has_GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
          has_MONGODB_URI: !!process.env.MONGODB_URI,
          has_NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
          GOOGLE_CLIENT_ID_len: (process.env.GOOGLE_CLIENT_ID ?? '').length,
        },
        hypothesisId: 'A-B-C-D', timestamp: Date.now(),
      }),
    })
  } catch {}
})()
// #endregion

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    // EmailProvider validates Nodemailer config at initialization — only include
    // it when EMAIL_SERVER is actually configured to prevent build-time crashes.
    ...(process.env.EMAIL_SERVER
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM ?? '',
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          session.user.plan = dbUser.plan
          session.user.modelCallsUsed = dbUser.modelCallsUsed
          session.user.modelCallsLimit = dbUser.modelCallsLimit
        }
      }
      return session
    },
    async signIn({ user, account: _account }) {
      // #region agent log
      fetch('http://127.0.0.1:7762/ingest/6faa078f-6949-48af-ac2f-612e80285b60', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '45ef32' },
        body: JSON.stringify({ sessionId: '45ef32', location: 'auth.ts:signIn-callback', message: 'signIn callback reached', data: { email: user.email ? user.email.slice(0, 3) + '***' : null, provider: _account?.provider }, hypothesisId: 'A', timestamp: Date.now() }),
      }).catch(() => {})
      // #endregion
      if (!user.email) return false
      try {
        await connectDB()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            email: user.email,
            name: user.name ?? 'VerityFlow User',
            image: user.image ?? undefined,
            plan: 'free',
            modelCallsUsed: 0,
            modelCallsLimit: 50,
          })
        }
        return true
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7762/ingest/6faa078f-6949-48af-ac2f-612e80285b60', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '45ef32' },
          body: JSON.stringify({ sessionId: '45ef32', location: 'auth.ts:signIn-callback-error', message: 'signIn callback threw', data: { error: String(err) }, hypothesisId: 'D', timestamp: Date.now() }),
        }).catch(() => {})
        // #endregion
        console.error('signIn callback error:', err)
        return false
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
})
