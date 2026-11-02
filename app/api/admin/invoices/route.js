import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const schema = z.object({ requestId: z.string().min(1), title: z.string().min(2), description: z.string().optional(), amount: z.coerce.number().positive(), currency: z.string().default('BDT'), dueAt: z.string().optional() });
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const invoices = await prisma.invoice.findMany({ include: { request: { select: { requestCode: true, clientName: true, email: true } }, payments: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ invoices });
}
export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const d = schema.parse(await req.json());
    const invoice = await prisma.invoice.create({ data: { ...d, invoiceNo: `NLI-${Date.now().toString(36).toUpperCase()}`, dueAt: d.dueAt ? new Date(d.dueAt) : null } });
    const request = await prisma.projectRequest.findUnique({ where: { id: d.requestId }, select: { userId: true } });
    if (request?.userId) await prisma.notification.create({ data: { userId: request.userId, title: 'New invoice issued', body: `Invoice ${invoice.invoiceNo} is ready in your dashboard.`, href: '/dashboard' } });
    const owner = await prisma.projectRequest.findUnique({where:{id:d.requestId},select:{email:true,clientName:true}});
    if(owner) await sendEmail({to:owner.email,subject:`NovaLoom invoice ${invoice.invoiceNo}`,html:`<p>Hello ${owner.clientName},</p><p>Your private invoice ${invoice.invoiceNo} has been issued. Please sign in to your dashboard to review and pay it.</p>`});
    await prisma.activityLog.create({ data: { actorId: admin.sub, action: 'INVOICE_CREATED', entityType: 'Invoice', entityId: invoice.id } });
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e.issues?.[0]?.message || 'Could not create invoice.' }, { status: 400 }); }
}
