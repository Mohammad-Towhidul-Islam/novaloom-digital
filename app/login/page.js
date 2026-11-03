'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteShell from '@/components/site-shell';
import { useSite } from '@/components/site-provider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const { refresh, lang } = useSite();

  const en = lang === 'en';

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const d = await r.json();

      if (!r.ok) {
        setError(
          d.error ||
            (en
              ? 'Invalid email or password.'
              : 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।')
        );
      } else {
        await refresh();
        router.push(d.role === 'ADMIN' ? '/admin' : '/dashboard');
      }
    } catch {
      setError(
        en
          ? 'Something went wrong. Please try again.'
          : 'সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell>
      <main className="auth-page">
        <div className="auth-card">
          <span className="eyebrow">
            {en ? 'WELCOME BACK' : 'আবারও স্বাগতম'}
          </span>

          <h1>
            {en ? (
              <>
                Great to see
                <br />
                <em>you again.</em>
              </>
            ) : (
              <>
                আপনাকে দেখে
                <br />
                <em>ভালো লাগছে।</em>
              </>
            )}
          </h1>

          <p>
            {en
              ? 'Log in to track the progress of your projects.'
              : 'আপনার প্রজেক্টের অগ্রগতি দেখতে লগইন করুন।'}
          </p>

          <form onSubmit={submit}>
            <label>
              {en ? 'Email Address' : 'ইমেইল ঠিকানা'}

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              {en ? 'Password' : 'পাসওয়ার্ড'}

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  en ? 'Enter your password' : 'আপনার পাসওয়ার্ড'
                }
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="button" disabled={busy}>
              {busy
                ? en
                  ? 'Logging in...'
                  : 'লগইন হচ্ছে...'
                : en
                  ? 'Login'
                  : 'লগইন'}
            </button>
          </form>

          <p className="auth-switch">
            {en ? 'New to NovaLoom?' : 'NovaLoom-এ নতুন?'}{' '}
            <Link href="/register">
              {en ? 'Create an account' : 'অ্যাকাউন্ট তৈরি করুন'}
            </Link>
          </p>
        </div>
      </main>
    </SiteShell>
  );
}