'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useSite } from './site-provider';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSite();

  const links = [
    ['সেবাসমূহ', '/services'],
    ['আমাদের কাজ', '/work'],
    ['ব্লগ', '/blog'],
    ['কাজের ধাপ', '/#process'],
    ['আমাদের সম্পর্কে', '/#about']
  ];

  return (
    <header className="nav-wrap">
      <nav className="nav container">

        {/* NovaLoom Logo */}
        <Link
          href="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/novaloom-logo.png"
            alt="NovaLoom Digital Solutions"
            width={58}
            height={58}
            priority
            className="brand-logo"
          />

          <span className="brand-text">
            nova<span className="brand-accent">loom</span>
            <small>ডিজিটাল সলিউশনস</small>
          </span>
        </Link>

        <div className="nav-links">
          {links.map(([n, h]) => (
            <Link key={n} href={h}>
              {n}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link
            className="nav-login"
            href={user ? '/dashboard' : '/login'}
          >
            {user ? 'ড্যাশবোর্ড' : 'লগইন'}
          </Link>

          <Link className="button button-small" href="/request">
            সেবা বুক করুন <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          className="menu-toggle"
          aria-label="মেনু খুলুন"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu">
          {links.map(([n, h]) => (
            <Link
              key={n}
              href={h}
              onClick={() => setOpen(false)}
            >
              {n}
            </Link>
          ))}

          <Link
            href={user ? '/dashboard' : '/login'}
            onClick={() => setOpen(false)}
          >
            {user ? 'ড্যাশবোর্ড' : 'লগইন'}
          </Link>

          <Link
            className="button"
            href="/request"
            onClick={() => setOpen(false)}
          >
            সেবা বুক করুন <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
