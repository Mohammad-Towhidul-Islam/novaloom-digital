import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const data = await req.formData();
  const tranId = String(data.get('tran_id') || '');
  const valId = String(data.get('val_id') || '');
  const postedStatus = String(data.get('status') || '');
  const payment = tranId ? await prisma.payment.findUnique({ where: { tranId }, include: { invoice: true } }) : null;
  if (!payment) return NextResponse.redirect(new URL('/dashboard?payment=not-found', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  if (payment.status === 'PAID') return NextResponse.redirect(new URL('/dashboard?payment=success', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  if (postedStatus !== 'VALID' && postedStatus !== 'VALIDATED') {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: postedStatus === 'CANCELLED' ? 'FAILED' : 'FAILED', rawStatus: postedStatus || 'FAILED' } });
    return NextResponse.redirect(new URL('/dashboard?payment=failed', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  }
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword || !valId) return NextResponse.redirect(new URL('/dashboard?payment=pending-verification', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  const sandbox = process.env.SSLCOMMERZ_SANDBOX !== 'false';
  const validator = sandbox ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php' : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';
  const query = new URLSearchParams({ val_id: valId, store_id: storeId, store_passwd: storePassword, format: 'json' });
  try {
    const verifiedResponse = await fetch(`${validator}?${query.toString()}`, { cache: 'no-store' });
    const verified = await verifiedResponse.json();
    const valid = verifiedResponse.ok && ['VALID','VALIDATED'].includes(verified.status) && verified.tran_id === tranId && Number(verified.amount) === Number(payment.amount) && verified.currency === payment.currency;
    if (!valid) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', validationId: valId, rawStatus: verified.status || 'VALIDATION_MISMATCH' } });
      return NextResponse.redirect(new URL('/dashboard?payment=verification-failed', process.env.NEXT_PUBLIC_SITE_URL || req.url));
    }
    await prisma.$transaction(async tx => {
      await tx.payment.update({ where: { id: payment.id }, data: { status: 'PAID', validationId: valId, gatewayTranId: verified.bank_tran_id || null, rawStatus: verified.status } });
      const all = await tx.payment.findMany({ where: { invoiceId: payment.invoiceId, status: 'PAID' } });
      const total = all.reduce((sum, item) => sum + Number(item.amount), 0);
      const invoiceStatus = total >= Number(payment.invoice.amount) ? 'PAID' : 'PARTIALLY_PAID';
      await tx.invoice.update({ where: { id: payment.invoiceId }, data: { status: invoiceStatus } });
      const owner = await tx.projectRequest.findUnique({ where: { id: payment.invoice.requestId }, select: { userId: true } });
      if (owner?.userId) await tx.notification.create({ data: { userId: owner.userId, title: 'Payment received', body: `Your payment for invoice ${payment.invoice.invoiceNo} has been verified.`, href: '/dashboard' } });
    });
    return NextResponse.redirect(new URL('/dashboard?payment=success', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  } catch {
    return NextResponse.redirect(new URL('/dashboard?payment=verification-error', process.env.NEXT_PUBLIC_SITE_URL || req.url));
  }
}
