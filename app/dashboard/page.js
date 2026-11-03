
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SiteShell from '@/components/site-shell';
import { useSite } from '@/components/site-provider';
import {
  FolderKanban,
  Clock3,
  ArrowUpRight,
  LogOut,
  Bell,
  LifeBuoy,
  RefreshCw,
} from 'lucide-react';
import ProjectChat from '@/components/project-chat';
import ServiceCard from '@/components/service-card';
import { services } from '@/lib/catalog';

const statusLabels = {
  SUBMITTED: { bn: 'জমা হয়েছে', en: 'Submitted' },
  UNDER_REVIEW: { bn: 'পর্যালোচনায়', en: 'Under Review' },
  DISCUSSION: { bn: 'আলোচনা চলছে', en: 'Discussion' },
  QUOTATION_SENT: { bn: 'কোটেশন পাঠানো হয়েছে', en: 'Quotation Sent' },
  AWAITING_APPROVAL: { bn: 'অনুমোদনের অপেক্ষায়', en: 'Awaiting Approval' },
  CONFIRMED: { bn: 'নিশ্চিত', en: 'Confirmed' },
  IN_PROGRESS: { bn: 'কাজ চলছে', en: 'In Progress' },
  TESTING: { bn: 'পরীক্ষা চলছে', en: 'Testing' },
  COMPLETED: { bn: 'সম্পন্ন', en: 'Completed' },
  DELIVERED: { bn: 'হস্তান্তর করা হয়েছে', en: 'Delivered' },
  CANCELLED: { bn: 'বাতিল', en: 'Cancelled' },
};

const serviceName = (slug, en) => {
  const service = services.find((s) => s.slug === slug);

  if (!service) return slug;

  return en
    ? service.titleEn || service.title
    : service.title;
};

export default function Dashboard() {
  const { user, refresh, lang } = useSite();
  const en = lang === 'en';
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState({
    subject: '',
    message: '',
    requestId: '',
  });
  const [busy, setBusy] = useState(false);

  const statusText = (status) =>
    statusLabels[status]?.[en ? 'en' : 'bn'] || status || '—';

  const dateLocale = en ? 'en-US' : 'bn-BD';

  async function load() {
    try {
      const [r, i, t, n] = await Promise.all([
        fetch('/api/client/requests'),
        fetch('/api/client/invoices'),
        fetch('/api/support/tickets'),
        fetch('/api/notifications'),
      ]);

      if (r.status === 401) {
        router.push('/login');
        return;
      }

      const [rd, id, td, nd] = await Promise.all([
        r.json(),
        i.json(),
        t.json(),
        n.json(),
      ]);

      setRequests(rd.requests || []);
      setInvoices(id.invoices || []);
      setTickets(td.tickets || []);
      setNotifications(nd.notifications || []);
    } catch {
      setError(
        en
          ? 'Unable to load dashboard data. Please refresh.'
          : 'ড্যাশবোর্ডের তথ্য লোড করা যায়নি। রিফ্রেশ করুন।'
      );
    }
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await refresh();
    router.push('/');
  }

  async function pay(invoiceId) {
    setError('');

    try {
      const r = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const d = await r.json();

      if (!r.ok) {
        setError(
          d.error ||
            (en
              ? 'Payment could not be started.'
              : 'পেমেন্ট শুরু করা যায়নি।')
        );
        return;
      }

      window.location.href = d.url;
    } catch {
      setError(
        en
          ? 'Payment could not be started.'
          : 'পেমেন্ট শুরু করা যায়নি।'
      );
    }
  }

  async function createTicket(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const r = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      });

      const d = await r.json();

      if (!r.ok) {
        setError(
          d.error ||
            (en
              ? 'Could not submit support request.'
              : 'সহায়তার অনুরোধ পাঠানো যায়নি।')
        );
        return;
      }

      setTicket({
        subject: '',
        message: '',
        requestId: '',
      });

      await load();
    } catch {
      setError(
        en
          ? 'Could not submit support request.'
          : 'সহায়তার অনুরোধ পাঠানো যায়নি।'
      );
    } finally {
      setBusy(false);
    }
  }

  async function markAll() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    await load();
  }

  async function updateQuote(id, status) {
    setError('');

    const r = await fetch('/api/client/quotations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    const d = await r.json();

    if (!r.ok) {
      setError(
        d.error ||
          (en
            ? 'Could not update quotation.'
            : 'কোটেশন আপডেট করা যায়নি।')
      );
      return;
    }

    await load();
  }

  return (
    <SiteShell>
      <main className="dashboard-page container">

        {/* DISCOVER SERVICES */}
        <section className="dashboard-discover">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {en ? 'SERVICES FOR YOUR NEEDS' : 'আপনার প্রয়োজনীয় সেবা'}
              </span>

              <h2>
                {en ? 'What would you like us to build?' : 'কোন কাজটি করাতে চান?'}
              </h2>
            </div>

            <p>
              {en
                ? 'Explore our services and choose the one that fits your needs. You can send a project request directly.'
                : 'সেবা বেছে নিয়ে বিস্তারিত দেখুন। পছন্দ হলে সরাসরি বুকিং অনুরোধ পাঠাতে পারবেন।'}
            </p>
          </div>

          <div className="dashboard-service-grid">
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
              />
            ))}
          </div>

          <div className="dashboard-discover-action">
            <Link href="/services" className="button">
              {en ? 'Explore All Services' : 'সব সেবা দেখুন'}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        {/* DASHBOARD HEADER */}
        <div className="dash-head">
          <div>
            <span className="eyebrow">
              {en ? 'CUSTOMER DASHBOARD' : 'গ্রাহক ড্যাশবোর্ড'}
            </span>

            <h1>
              {en ? 'Welcome' : 'স্বাগতম'}
              {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              {en ? '!' : '।'}
            </h1>

            <p>
              {en
                ? 'Manage your projects, invoices and support in one place.'
                : 'আপনার প্রজেক্ট, বিল ও সহায়তা—সব এক জায়গায়।'}
            </p>
          </div>

          <div className="dash-head-actions">
            <button className="button button-ghost" onClick={load}>
              <RefreshCw size={15} />
              {en ? 'Refresh' : 'রিফ্রেশ'}
            </button>

            <button className="button button-ghost" onClick={logout}>
              <LogOut size={16} />
              {en ? 'Logout' : 'লগআউট'}
            </button>
          </div>
        </div>

        {error && <div className="notice">{error}</div>}

        {/* STATISTICS */}
        <div className="dash-stats">
          <div>
            <FolderKanban />
            <b>{en ? 'Project Requests' : 'প্রজেক্টের অনুরোধ'}</b>
            <strong>{requests.length}</strong>
            <small>
              {en ? 'Requests submitted by you' : 'আপনার পাঠানো অনুরোধ'}
            </small>
          </div>

          <div>
            <Clock3 />
            <b>{en ? 'Current Status' : 'বর্তমান অবস্থা'}</b>
            <strong>
              {statusText(requests[0]?.status)}
            </strong>
            <small>
              {en ? 'Latest request' : 'সর্বশেষ অনুরোধ'}
            </small>
          </div>

          <div>
            <Bell />
            <b>{en ? 'Unread Updates' : 'অপঠিত আপডেট'}</b>
            <strong>
              {notifications.filter((n) => !n.readAt).length}
            </strong>
            <small>
              {en
                ? 'Project and invoice notifications'
                : 'প্রজেক্ট ও বিলের নোটিশ'}
            </small>
          </div>
        </div>

        {/* PROJECT REQUESTS */}
        {requests.length === 0 ? (
          <div className="dash-empty">
            <div className="empty-icon">
              <FolderKanban size={27} />
            </div>

            <h2>
              {en
                ? 'Your next project starts here.'
                : 'আপনার পরবর্তী প্রজেক্ট শুরু হোক এখান থেকে।'}
            </h2>

            <p>
              {en
                ? 'Share your requirements, receive a custom quotation and track your project progress here.'
                : 'কাজের বিবরণ পাঠান, কাস্টম কোটেশন পান এবং এখান থেকে অগ্রগতি দেখুন।'}
            </p>

            <Link href="/request" className="button">
              {en ? 'Submit a New Request' : 'নতুন কাজের অনুরোধ দিন'}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <section className="admin-table-wrap">
            <div className="admin-table-head">
              <div>
                <span className="eyebrow">
                  {en ? 'YOUR PROJECTS' : 'আপনার প্রজেক্টসমূহ'}
                </span>

                <h2>
                  {en ? 'Project Requests & Progress' : 'প্রজেক্টের অনুরোধ ও অগ্রগতি'}
                </h2>
              </div>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{en ? 'Reference' : 'রেফারেন্স'}</th>
                    <th>{en ? 'Project' : 'প্রজেক্ট'}</th>
                    <th>{en ? 'Services' : 'সেবাসমূহ'}</th>
                    <th>{en ? 'Status' : 'অবস্থা'}</th>
                    <th>{en ? 'Submitted Date' : 'জমা দেওয়ার তারিখ'}</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td><b>{r.requestCode}</b></td>

                      <td>
                        {r.title}
                        <small>{r.description.slice(0, 65)}...</small>
                      </td>

                      <td>
                        {r.serviceSlugs
                          .map((slug) => serviceName(slug, en))
                          .join(', ')}
                      </td>

                      <td>{statusText(r.status)}</td>

                      <td>
                        {new Date(r.createdAt).toLocaleDateString(dateLocale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PROJECT PROGRESS */}
            <div className="project-progress-list">
              {requests
                .filter((r) => r.project)
                .map((r) => (
                  <div key={r.project.id} className="project-progress-card">
                    <div>
                      <b>{r.title}</b>

                      <small>
                        {en ? 'Project' : 'প্রজেক্ট'} ·{' '}
                        {statusText(r.project.status)}
                      </small>
                    </div>

                    <div className="milestone-row">
                      {r.project.milestones.map((m) => (
                        <span
                          key={m.id}
                          className={m.completed ? 'done' : ''}
                        >
                          {m.completed ? '✓' : '○'} {m.title}
                        </span>
                      ))}
                    </div>

                    {r.project.tasks.length > 0 && (
                      <small>
                        {en ? 'Pending Tasks: ' : 'অসম্পন্ন কাজ: '}
                        {r.project.tasks.map((t) => t.title).join(' · ')}
                      </small>
                    )}
                  </div>
                ))}
            </div>

            {/* PROJECT CHAT */}
            <div className="project-chat-list">
              {requests.map((r) => (
                <ProjectChat
                  key={r.id}
                  requestId={r.id}
                  requestCode={r.requestCode}
                />
              ))}
            </div>
          </section>
        )}

        {/* QUOTATIONS */}
        <section className="admin-table-wrap" style={{ marginTop: 24 }}>
          <div className="admin-table-head">
            <div>
              <span className="eyebrow">
                {en ? 'CUSTOM PROPOSALS' : 'কাস্টম প্রস্তাব'}
              </span>

              <h2>{en ? 'My Quotations' : 'আমার কোটেশন'}</h2>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{en ? 'Project' : 'প্রজেক্ট'}</th>
                  <th>{en ? 'Scope of Work' : 'কাজের পরিধি'}</th>
                  <th>{en ? 'Deliverables' : 'যা যা দেওয়া হবে'}</th>
                  <th>{en ? 'Proposed Price' : 'প্রস্তাবিত মূল্য'}</th>
                  <th>{en ? 'Status' : 'অবস্থা'}</th>
                  <th>{en ? 'Decision' : 'সিদ্ধান্ত'}</th>
                </tr>
              </thead>

              <tbody>
                {requests.flatMap((r) =>
                  (r.quotations || []).map((q) => (
                    <tr key={q.id}>
                      <td>
                        {r.requestCode}
                        <small>{r.title}</small>
                      </td>

                      <td>{q.scope}</td>

                      <td>{q.deliverables.join(', ') || '—'}</td>

                      <td>
                        {q.currency} {Number(q.amount).toLocaleString()}
                        <small>{q.timeline}</small>
                      </td>

                      <td>{q.status}</td>

                      <td>
                        {q.status === 'SENT' ? (
                          <div className="quote-actions">
                            <button
                              className="button button-small"
                              onClick={() => updateQuote(q.id, 'ACCEPTED')}
                            >
                              {en ? 'Accept' : 'গ্রহণ করুন'}
                            </button>

                            <button
                              className="button button-small button-ghost"
                              onClick={() => updateQuote(q.id, 'REJECTED')}
                            >
                              {en ? 'Reject' : 'প্রত্যাখ্যান করুন'}
                            </button>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!requests.some((r) => r.quotations?.length) && (
            <div className="table-empty">
              {en
                ? 'Your quotation will appear here after our team reviews your request.'
                : 'আমাদের টিম আপনার অনুরোধ পর্যালোচনা করলে কোটেশন এখানে দেখা যাবে।'}
            </div>
          )}
        </section>

        {/* INVOICES */}
        <section className="admin-table-wrap" style={{ marginTop: 24 }}>
          <div className="admin-table-head">
            <div>
              <span className="eyebrow">
                {en ? 'BILLING' : 'বিলিং'}
              </span>

              <h2>{en ? 'My Invoices' : 'আমার ইনভয়েস'}</h2>
            </div>

            <span>
              {invoices.length} {en ? 'total' : 'টি'}
            </span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{en ? 'Invoice' : 'ইনভয়েস'}</th>
                  <th>{en ? 'Project' : 'প্রজেক্ট'}</th>
                  <th>{en ? 'Amount' : 'পরিমাণ'}</th>
                  <th>{en ? 'Due Date' : 'শেষ তারিখ'}</th>
                  <th>{en ? 'Status' : 'অবস্থা'}</th>
                  <th>{en ? 'Action' : 'করণীয়'}</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <b>{i.invoiceNo}</b>
                      <small>{i.title}</small>
                    </td>

                    <td>{i.request?.requestCode}</td>

                    <td>
                      {i.currency} {Number(i.amount).toLocaleString()}
                    </td>

                    <td>
                      {i.dueAt
                        ? new Date(i.dueAt).toLocaleDateString(dateLocale)
                        : '—'}
                    </td>

                    <td>{i.status}</td>

                    <td>
                      {['PAID', 'VOID'].includes(i.status) ? (
                        '—'
                      ) : (
                        <button
                          className="button button-small"
                          onClick={() => pay(i.id)}
                        >
                          {en ? 'Pay Securely' : 'নিরাপদে পেমেন্ট করুন'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!invoices.length && (
            <div className="table-empty">
              {en
                ? 'You do not have any invoices yet.'
                : 'এখনো কোনো ইনভয়েস নেই। তৈরি হলে এখানে দেখা যাবে।'}
            </div>
          )}
        </section>

        {/* SUPPORT AND NOTIFICATIONS */}
        <div className="dashboard-lower-grid">

          {/* SUPPORT */}
          <section className="admin-table-wrap">
            <div className="admin-table-head">
              <div>
                <span className="eyebrow">
                  {en ? 'CUSTOMER SUPPORT' : 'গ্রাহক সহায়তা'}
                </span>

                <h2>
                  <LifeBuoy size={18} />
                  {en ? 'Support Request' : 'সহায়তার অনুরোধ'}
                </h2>
              </div>
            </div>

            <form
              className="contact-form"
              onSubmit={createTicket}
              style={{ padding: 22 }}
            >
              <label>
                {en ? 'Subject' : 'বিষয়'}

                <input
                  required
                  minLength="4"
                  value={ticket.subject}
                  onChange={(e) =>
                    setTicket({ ...ticket, subject: e.target.value })
                  }
                  placeholder={
                    en
                      ? 'How can we help you?'
                      : 'কীভাবে সাহায্য করতে পারি?'
                  }
                />
              </label>

              <label>
                {en
                  ? 'Related Project (Optional)'
                  : 'সংশ্লিষ্ট প্রজেক্ট (ঐচ্ছিক)'}

                <select
                  value={ticket.requestId}
                  onChange={(e) =>
                    setTicket({ ...ticket, requestId: e.target.value })
                  }
                >
                  <option value="">
                    {en ? 'General Support' : 'সাধারণ সহায়তা'}
                  </option>

                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.requestCode} · {r.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {en ? 'Message' : 'বার্তা'}

                <textarea
                  required
                  minLength="10"
                  rows="4"
                  value={ticket.message}
                  onChange={(e) =>
                    setTicket({ ...ticket, message: e.target.value })
                  }
                  placeholder={
                    en
                      ? 'Describe your issue...'
                      : 'আপনার সমস্যাটি লিখুন...'
                  }
                />
              </label>

              <button className="button" disabled={busy}>
                {busy
                  ? en
                    ? 'Submitting...'
                    : 'জমা হচ্ছে...'
                  : en
                    ? 'Send Support Request'
                    : 'সহায়তার অনুরোধ পাঠান'}
              </button>
            </form>

            <div className="ticket-list">
              {tickets.map((t) => (
                <div key={t.id}>
                  <b>
                    {t.ticketNo} · {t.subject}
                  </b>

                  <small>
                    {t.status} ·{' '}
                    {new Date(t.createdAt).toLocaleDateString(dateLocale)}
                  </small>
                </div>
              ))}
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="admin-table-wrap">
            <div className="admin-table-head">
              <div>
                <span className="eyebrow">
                  {en ? 'UPDATES' : 'আপডেট'}
                </span>

                <h2>
                  <Bell size={18} />
                  {en ? 'Notifications' : 'নোটিফিকেশন'}
                </h2>
              </div>

              <button
                className="button button-small button-ghost"
                onClick={markAll}
              >
                {en ? 'Mark All as Read' : 'সব পড়া হয়েছে হিসেবে চিহ্নিত করুন'}
              </button>
            </div>

            <div className="notification-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={!n.readAt ? 'unread' : ''}
                >
                  <div>
                    <b>{n.title}</b>
                    <p>{n.body}</p>

                    <small>
                      {new Date(n.createdAt).toLocaleString(dateLocale)}
                    </small>
                  </div>

                  {n.href && (
                    <Link href={n.href}>
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              ))}

              {!notifications.length && (
                <div className="table-empty">
                  {en
                    ? 'You do not have any notifications yet.'
                    : 'এখনো কোনো নোটিফিকেশন নেই।'}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
