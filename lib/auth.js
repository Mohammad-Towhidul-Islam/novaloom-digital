import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SECRET) throw new Error('AUTH_SECRET must be configured in production.');
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-change-this-secret-please');
const COOKIE = 'novaloom_session';
export async function createSession(user) {
  const token = await new SignJWT({ sub: user.id, role: user.role, email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
  cookies().set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export function clearSession() { cookies().set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 }); }
export async function getSession() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return payload; } catch { return null; }
}
export async function requireAdmin() {
  const session = await getSession();
  if (!session || !['ADMIN'].includes(session.role)) return null;
  return session;
}
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.sub) return null;
  return prisma.user.findUnique({ where: { id: session.sub }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
}

export async function requireStaff() {
  const session = await getSession();
  if (!session || !['ADMIN','PROJECT_MANAGER','DEVELOPER','DESIGNER','SUPPORT'].includes(session.role)) return null;
  return session;
}
