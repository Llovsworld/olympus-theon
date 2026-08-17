import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { timingSafeEqual } from "crypto";

type LoginAttempt = { count: number; resetAt: number };
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 8;

const authGlobal = globalThis as typeof globalThis & {
    olympusLoginAttempts?: Map<string, LoginAttempt>;
};
const loginAttempts = authGlobal.olympusLoginAttempts ?? new Map<string, LoginAttempt>();
authGlobal.olympusLoginAttempts = loginAttempts;

function headerValue(headers: Record<string, unknown> | undefined, name: string): string {
    const value = headers?.[name];
    return Array.isArray(value) ? String(value[0] ?? '') : typeof value === 'string' ? value : '';
}

function loginKey(headers: Record<string, unknown> | undefined, username: string): string {
    const forwarded = headerValue(headers, 'x-forwarded-for').split(',')[0]?.trim();
    const address = headerValue(headers, 'x-real-ip') || forwarded || 'unknown';
    return `${address}:${username.toLowerCase()}`;
}

function isLoginBlocked(key: string, now = Date.now()): boolean {
    const attempt = loginAttempts.get(key);
    if (!attempt || attempt.resetAt <= now) {
        loginAttempts.delete(key);
        return false;
    }
    return attempt.count >= LOGIN_ATTEMPT_LIMIT;
}

function recordLoginFailure(key: string, now = Date.now()): void {
    const attempt = loginAttempts.get(key);
    if (!attempt || attempt.resetAt <= now) {
        loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    } else {
        attempt.count += 1;
    }

    if (loginAttempts.size > 2_000) {
        for (const [entryKey, entry] of loginAttempts) {
            if (entry.resetAt <= now) loginAttempts.delete(entryKey);
        }
    }
}

function secureEqual(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) return false;
    return timingSafeEqual(leftBuffer, rightBuffer);
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, request) {
                const configuredUsername = process.env.ADMIN_USERNAME;
                const configuredPassword = process.env.ADMIN_PASSWORD;
                const suppliedUsername = credentials?.username;
                const suppliedPassword = credentials?.password;

                // Fail closed when credentials are missing or the deployment is incomplete.
                if (
                    !configuredUsername ||
                    !configuredPassword ||
                    typeof suppliedUsername !== 'string' ||
                    typeof suppliedPassword !== 'string' ||
                    suppliedUsername.length === 0 ||
                    suppliedPassword.length === 0
                ) {
                    return null;
                }

                const attemptKey = loginKey(request.headers, suppliedUsername);
                if (isLoginBlocked(attemptKey)) return null;

                if (
                    secureEqual(suppliedUsername, configuredUsername) &&
                    secureEqual(suppliedPassword, configuredPassword)
                ) {
                    loginAttempts.delete(attemptKey);
                    return {
                        id: "1",
                        name: "Admin",
                        email: "admin@olympustheon.com"
                    };
                }

                recordLoginFailure(attemptKey);
                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                Object.assign(session.user, { id: token.id });
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
