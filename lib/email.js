export async function sendEmail({to,subject,html}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) return { skipped: true };
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, html }), cache: 'no-store'
    });
    if (!response.ok) return { sent: false };
    return { sent: true, ...(await response.json()) };
  } catch { return { sent: false }; }
}
