import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/** How often a signed-in user's role is re-read from the database. */
const ROLE_REFRESH_MS = 60 * 1000;

/** Failed sign-ins allowed per email before it is locked for LOCKOUT_MS. */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

/*
 * Failed attempts are stored in the database, so the limit holds across every
 * serverless instance. If the database write fails, sign-in still works; the
 * lockout is a brake on guessing, not something that may lock everyone out.
 */
async function isLocked(key: string): Promise<boolean> {
  try {
    const entry = await prisma.loginAttempt.findUnique({ where: { key } });
    return !!entry?.lockedUntil && entry.lockedUntil.getTime() > Date.now();
  } catch (error) {
    console.error("Login throttle read failed:", error);
    return false;
  }
}

async function recordFailure(key: string) {
  const now = new Date();
  try {
    const entry = await prisma.loginAttempt.findUnique({ where: { key } });
    // Start a fresh window if there is none, it expired, or a lockout ended.
    const windowExpired =
      !entry ||
      now.getTime() - entry.firstAt.getTime() > LOCKOUT_MS ||
      (entry.lockedUntil !== null && entry.lockedUntil.getTime() <= now.getTime());
    if (windowExpired) {
      await prisma.loginAttempt.upsert({
        where: { key },
        create: { key, count: 1, firstAt: now },
        update: { count: 1, firstAt: now, lockedUntil: null },
      });
      return;
    }
    const updated = await prisma.loginAttempt.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    if (updated.count >= MAX_FAILED_ATTEMPTS) {
      await prisma.loginAttempt.update({
        where: { key },
        data: { lockedUntil: new Date(now.getTime() + LOCKOUT_MS) },
      });
    }
  } catch (error) {
    console.error("Login throttle write failed:", error);
  }
}

async function clearFailures(key: string) {
  try {
    await prisma.loginAttempt.deleteMany({ where: { key } });
  } catch (error) {
    console.error("Login throttle reset failed:", error);
  }
}

export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

// Compared against when the email does not exist, so both paths take similar time.
const DUMMY_HASH = "$2b$10$o8dhf.oV40JX.4BHHwXg/uy5fMU0WMMT7pZ88uq3ziCL0.5VPNkd.";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email);
        const password = credentials?.password;
        if (!email || !password) return null;

        if (await isLocked(email)) {
          throw new Error("Too many failed attempts. Please try again in 15 minutes.");
        }

        // Accounts created before emails were normalised may be stored mixed-case.
        const user =
          (await prisma.user.findUnique({ where: { email } })) ??
          (credentials?.email && credentials.email.trim() !== email
            ? await prisma.user.findUnique({ where: { email: credentials.email.trim() } })
            : null);

        const isPasswordValid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
        if (!user || !isPasswordValid) {
          await recordFailure(email);
          return null;
        }

        await clearFailures(email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleCheckedAt = Date.now();
        return token;
      }

      // Re-read the role periodically so a demotion or deletion takes effect
      // within a minute instead of when the 30-day token expires.
      const checkedAt = typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0;
      if (token.id && Date.now() - checkedAt > ROLE_REFRESH_MS) {
        try {
          const current = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true },
          });
          token.role = current ? current.role : "revoked";
          token.roleCheckedAt = Date.now();
        } catch (error) {
          // Database unreachable: keep the existing role rather than signing everyone out.
          console.error("Failed to refresh session role:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
