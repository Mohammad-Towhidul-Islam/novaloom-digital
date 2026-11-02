import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
const schema = z.object({ requestId: z.string(), body: z.string().min(1).max(4000), internal: z.boolean().default(false) });
export async function GET(req) {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const requestId = new URL(req.url).searchParams.get('requestId');
  const owned = await prisma.projectRequest.findFirst({ where: { id: requestId, ...(session.role === 'ADMIN' ? {} : { userId: session.sub }) } });
  if (!owned) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  const messages = await prisma.message.findMany({ where: { requestId, ...(session.role === 'ADMIN' ? {} : { internal: false }) }, include: { sender: { select: { id: true, name: true, role: true } } }, orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ messages });
}
export async function POST(req) {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  try {
    const d = schema.parse(await req.json());
    if (d.internal && session.role !== 'ADMIN' && session.role !== 'PROJECT_MANAGER') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    const owned = await prisma.projectRequest.findFirst({ where: { id: d.requestId, ...(session.role === 'ADMIN' || session.role === 'PROJECT_MANAGER' ? {} : { userId: session.sub }) } });
    if (!owned) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    const message = await prisma.message.create({ data: { ...d, senderId: session.sub } });
    if (owned.userId && owned.userId !== session.sub && !d.internal) await prisma.notification.create({ data: { userId: owned.userId, title: 'New project message', body: `There is a new message for ${owned.requestCode}.`, href: '/dashboard' } });
    return NextResponse.json({ message }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.issues?.[0]?.message || 'Could not send message.' }, { status: 400 }); }
}
