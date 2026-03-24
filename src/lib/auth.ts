import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import clientPromise from '@/lib/db/mongoClient'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
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
