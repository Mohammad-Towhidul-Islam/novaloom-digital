import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
const schema = z.object({ title: z.string().min(2), description: z.string().optional(), requestId: z.string().optional(), clientId: z.string(), status: z.enum(['CONFIRMED','IN_PROGRESS','TESTING','COMPLETED','DELIVERED']).default('CONFIRMED') });
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const projects = await prisma.project.findMany({ include: { client: { select: { name: true, email: true } }, milestones: true, tasks: true, request: { select: { requestCode: true } } }, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json({ projects });
}
export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { const d = schema.parse(await req.json()); const project = await prisma.project.create({ data: d }); await prisma.notification.create({ data: { userId: d.clientId, title: 'Project workspace created', body: `Your project “${d.title}” is now available.`, href: '/dashboard' } }); return NextResponse.json({ project }, { status: 201 }); }
  catch (e) { return NextResponse.json({ error: e.issues?.[0]?.message || 'Could not create project.' }, { status: 400 }); }
}
export async function PATCH(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { const { id, status } = await req.json(); const project = await prisma.project.update({ where: { id }, data: { status } }); return NextResponse.json({ project }); }
  catch { return NextResponse.json({ error: 'Could not update project.' }, { status: 400 }); }
}
