import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [clients, requests, projects, pendingQuotes, invoices, openTickets, payments] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT' } }), prisma.projectRequest.count(), prisma.project.count(), prisma.quotation.count({ where: { status: { in: ['DRAFT','SENT'] } } }), prisma.invoice.count(), prisma.supportTicket.count({ where: { status: { in: ['OPEN','IN_PROGRESS'] } } }), prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } })
  ]);
  return NextResponse.json({ analytics: { clients, requests, projects, pendingQuotes, invoices, openTickets, paidAmount: payments._sum.amount || 0 } });
}
