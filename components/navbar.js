
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { useSite } from './site-provider';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, lang, setLang } = useSite();

  const isBn = lang === 'bn';

  const links = [
    [isBn ? 'সেবাসমূহ' : 'Services', '/services'],
    [isBn ? 'আমাদের কাজ' : 'Our Work', '/work'],
    [isBn ? 'ব্লগ' : 'Blog', '/blog'],
    [isBn ? 'কাজের ধাপ' : 'Process', '/#process'],
    [isBn ? 'আমাদের সম্পর্কে' : 'About Us', '/#about'],
  ];

  const switchLanguage = () => {
    setLang(isBn ? 'en' : 'bn');
    setOpen(false);
  };

  return (
    <header className="nav-wrap">
      <nav className="nav container">

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
            <small>
              {isBn ? 'ডিজিটাল সলিউশনস' : 'Digital Solutions'}
            </small>
          </span>
        </Link>

        <div className="nav-links">
          {links.map(([name, href]) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">

          <button
            type="button"
            className="language-switch"
            onClick={switchLanguage}
            aria-label="Change language"
          >
            <Globe size={15} />
            {isBn ? 'English' : 'বাংলা'}
          </button>

          <Link
            className="nav-login"
            href={user ? '/dashboard' : '/login'}
          >
            {user
              ? (isBn ? 'ড্যাশবোর্ড' : 'Dashboard')
              : (isBn ? 'লগইন' : 'Login')}
          </Link>

          <Link className="button button-small" href="/request">
            {isBn ? 'সেবা বুক করুন' : 'Get Started'}
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          className="menu-toggle"
          aria-label={isBn ? 'মেনু খুলুন' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu">
          {links.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
            >
              {name}
            </Link>
          ))}

          <button
            type="button"
            className="language-switch"
            onClick={switchLanguage}
          >
            <Globe size={16} />
            {isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
          </button>

          <Link
            href={user ? '/dashboard' : '/login'}
            onClick={() => setOpen(false)}
          >
            {user
              ? (isBn ? 'ড্যাশবোর্ড' : 'Dashboard')
              : (isBn ? 'লগইন' : 'Login')}
          </Link>

          <Link
            className="button"
            href="/request"
            onClick={() => setOpen(false)}
          >
            {isBn ? 'সেবা বুক করুন' : 'Get Started'}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
