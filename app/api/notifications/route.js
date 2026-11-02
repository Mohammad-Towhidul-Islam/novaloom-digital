import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const notifications = await prisma.notification.findMany({ where: { userId: session.sub }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json({ notifications, unread: notifications.filter(n => !n.readAt).length });
}
export async function PATCH(req) {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id } = await req.json();
  if (id) await prisma.notification.updateMany({ where: { id, userId: session.sub }, data: { readAt: new Date() } });
  else await prisma.notification.updateMany({ where: { userId: session.sub, readAt: null }, data: { readAt: new Date() } });
  return NextResponse.json({ ok: true });
}
