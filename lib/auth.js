
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const COOKIE = 'novaloom_session';

const secretValue =
  process.env.AUTH_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? null
    : 'development-only-change-this-secret-please');

if (!secretValue) {
  throw new Error('AUTH_SECRET must be configured in production.');
}

const secret = new TextEncoder().encode(secretValue);

// Create user session
export async function createSession(user) {
  const token = await new SignJWT({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Clear user session
export function clearSession() {
  cookies().set(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// Get current session
export async function getSession() {
  const token = cookies().get(COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Check admin access
export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    return null;
  }

  return session;
}

// Get current logged-in user
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.sub) return null;

  return prisma.user.findUnique({
    where: {
      id: session.sub,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
}

// Check staff access
export async function requireStaff() {
  const session = await getSession();

  const allowedRoles = [
    'ADMIN',
    'PROJECT_MANAGER',
    'DEVELOPER',
    'DESIGNER',
    'SUPPORT',
  ];

  if (!session || !allowedRoles.includes(session.role)) {
    return null;
  }

  return session;
}
