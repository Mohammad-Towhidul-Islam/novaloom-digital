import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
const schema = z.object({ subject: z.string().min(4).max(140), message: z.string().min(10).max(5000), requestId: z.string().optional(), priority: z.enum(['LOW','NORMAL','HIGH']).default('NORMAL') });
export async function GET() {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const where = session.role === 'ADMIN' ? {} : { userId: session.sub };
  const tickets = await prisma.supportTicket.findMany({ where, orderBy: { updatedAt: 'desc' }, include: { user: { select: { name: true, email: true } }, request: { select: { requestCode: true, title: true } } } });
  return NextResponse.json({ tickets });
}
export async function POST(req) {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  try {
    const d = schema.parse(await req.json());
    if (d.requestId) {
      const owned = await prisma.projectRequest.findFirst({ where: { id: d.requestId, userId: session.sub } });
      if (!owned && session.role !== 'ADMIN') return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    const ticket = await prisma.supportTicket.create({ data: { ...d, requestId: d.requestId || null, userId: session.sub, ticketNo: `NLT-${Date.now().toString(36).toUpperCase()}` } });
    await prisma.activityLog.create({ data: { actorId: session.sub, action: 'SUPPORT_TICKET_CREATED', entityType: 'SupportTicket', entityId: ticket.id } });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.issues?.[0]?.message || 'Could not create ticket.' }, { status: 400 }); }
}
export async function PATCH(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status, priority } = await req.json();
    const ticket = await prisma.supportTicket.update({ where: { id }, data: { ...(status ? { status } : {}), ...(priority ? { priority } : {}) } });
    return NextResponse.json({ ticket });
  } catch { return NextResponse.json({ error: 'Could not update ticket.' }, { status: 400 }); }
}
