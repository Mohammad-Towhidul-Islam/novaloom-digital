import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const invoices = await prisma.invoice.findMany({ where: { request: { userId: session.sub } }, include: { payments: { orderBy: { createdAt: 'desc' } }, request: { select: { requestCode: true, title: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ invoices });
}
