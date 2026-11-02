import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getSession();
  if (!session?.sub) return NextResponse.json({ error: 'Please sign in to pay an invoice.' }, { status: 401 });
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) return NextResponse.json({ error: 'Online payment is not configured yet. Please contact the administrator.' }, { status: 503 });
  try {
    const { invoiceId } = await req.json();
    const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, request: { userId: session.sub } }, include: { request: true, payments: { where: { status: 'PAID' } } } });
    if (!invoice || ['PAID','VOID'].includes(invoice.status)) return NextResponse.json({ error: 'Invoice is unavailable for payment.' }, { status: 404 });
    const paid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = Number(invoice.amount) - paid;
    if (remaining <= 0) return NextResponse.json({ error: 'This invoice is already paid.' }, { status: 400 });
    const pending = await prisma.payment.findFirst({ where: { invoiceId: invoice.id, status: 'PENDING' }, orderBy: { createdAt: 'desc' } });
    if (pending && Date.now() - pending.createdAt.getTime() < 30 * 60 * 1000) return NextResponse.json({ error: 'A payment session is already pending for this invoice. Wait up to 30 minutes or contact support before retrying.' }, { status: 409 });
    if (pending) await prisma.payment.update({ where: { id: pending.id }, data: { status: 'FAILED', rawStatus: 'SESSION_EXPIRED' } });
    const tranId = `NL-${randomUUID()}`;
    const payment = await prisma.payment.create({ data: { invoiceId: invoice.id, amount: remaining, currency: invoice.currency, tranId } });
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const sandbox = process.env.SSLCOMMERZ_SANDBOX !== 'false';
    const endpoint = sandbox ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php' : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
    const form = new URLSearchParams({
      store_id: storeId, store_passwd: storePassword, total_amount: String(remaining), currency: invoice.currency, tran_id: tranId,
      success_url: `${base}/api/payments/sslcommerz/callback`, fail_url: `${base}/api/payments/sslcommerz/callback`, cancel_url: `${base}/api/payments/sslcommerz/callback`, ipn_url: `${base}/api/payments/sslcommerz/callback`,
      product_name: invoice.title, product_category: 'Digital Services', product_profile: 'service', cus_name: invoice.request.clientName, cus_email: invoice.request.email, cus_add1: 'Not provided', cus_city: 'Dhaka', cus_country: 'Bangladesh', cus_phone: invoice.request.phone || '01700000000', shipping_method: 'NO', num_of_item: '1'
    });
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form.toString(), cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || !result.GatewayPageURL) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', rawStatus: result.status || 'GATEWAY_INIT_FAILED' } });
      return NextResponse.json({ error: result.failedreason || 'Could not start payment session.' }, { status: 502 });
    }
    return NextResponse.json({ url: result.GatewayPageURL });
  } catch { return NextResponse.json({ error: 'Could not initiate payment.' }, { status: 400 }); }
}
