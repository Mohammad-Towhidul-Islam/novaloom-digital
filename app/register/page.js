'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteShell from '@/components/site-shell';
import { useSite } from '@/components/site-provider';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const { refresh, lang } = useSite();

  const en = lang === 'en';

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const d = await r.json();

      if (!r.ok) {
        setError(
          d.error ||
            (en
              ? 'Registration failed. Please try again.'
              : 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।')
        );
      } else {
        await refresh();
        router.push('/dashboard');
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
            {en ? 'CREATE YOUR ACCOUNT' : 'অ্যাকাউন্ট খুলুন'}
          </span>

          <h1>
            {en ? (
              <>
                Your Projects,
                <br />
                <em>In Safe Hands.</em>
              </>
            ) : (
              <>
                আপনার প্রজেক্ট,
                <br />
                <em>নিরাপদ হাতে।</em>
              </>
            )}
          </h1>

          <p>
            {en
              ? 'Create an account to manage all your project requests in one place.'
              : 'আপনার সব প্রজেক্টের অনুরোধ এক জায়গায় রাখতে অ্যাকাউন্ট খুলুন।'}
          </p>

          <form onSubmit={submit}>
            <label>
              {en ? 'Full Name' : 'আপনার পুরো নাম'}

              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={en ? 'Your name' : 'আপনার নাম'}
              />
            </label>

            <label>
              {en ? 'Email Address' : 'ইমেইল ঠিকানা'}

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              {en ? 'Phone' : 'ফোন'}{' '}
              <span>{en ? '(optional)' : '(ঐচ্ছিক)'}</span>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+880..."
              />
            </label>

            <label>
              {en ? 'Password' : 'পাসওয়ার্ড'}

              <input
                type="password"
                minLength={8}
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder={
                  en
                    ? 'At least 8 characters'
                    : 'কমপক্ষে ৮টি অক্ষর'
                }
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="button" disabled={busy}>
              {busy
                ? en
                  ? 'Creating Account...'
                  : 'অ্যাকাউন্ট তৈরি হচ্ছে...'
                : en
                  ? 'Create Account'
                  : 'অ্যাকাউন্ট তৈরি করুন'}
            </button>
          </form>

          <p className="auth-switch">
            {en
              ? 'Already have an account?'
              : 'আগে থেকেই অ্যাকাউন্ট আছে?'}{' '}
            <Link href="/login">
              {en ? 'Login' : 'লগইন'}
            </Link>
          </p>
        </div>
      </main>
    </SiteShell>
  );
}