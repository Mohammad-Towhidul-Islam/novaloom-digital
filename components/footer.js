
'use client';

import Link from 'next/link';
import { ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { useSite } from '@/components/site-provider';

export default function Footer() {
  const { lang } = useSite();
  const en = lang === 'en';

  const wa = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801XXXXXXXXX')
    .replace(/\D/g, '');

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand footer-brand">
              <span className="brand-mark">
                <Sparkles size={18} />
              </span>

              <span>
                nova<span className="brand-accent">loom</span>
                <small>
                  {en ? 'Digital Solutions' : 'ডিজিটাল সলিউশনস'}
                </small>
              </span>
            </Link>

            <p>
              {en
                ? 'Your reliable partner for all digital needs.'
                : 'আপনার সব ডিজিটাল প্রয়োজনের নির্ভরযোগ্য সহযোগী.'}
              <br />
              {en
                ? 'We turn your ideas into effective digital experiences.'
                : 'আপনার আইডিয়াকে কার্যকর ডিজিটাল অভিজ্ঞতায় রূপ দিই।'}
            </p>
          </div>

          <div className="footer-cta">
            <span className="eyebrow">
              {en ? 'HAVE A BIG IDEA?' : 'বড় কোনো পরিকল্পনা আছে?'}
            </span>

            <h2>
              {en ? "Let's Build It" : 'চলুন একসঙ্গে'}
              <br />
              <em>{en ? 'Together.' : 'বাস্তবায়ন করি।'}</em>
            </h2>

            <Link className="button" href="/request">
              {en ? 'Tell Us About Your Project' : 'আপনার কাজের কথা জানান'}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} NovaLoom Digital.{' '}
            {en ? 'All rights reserved.' : 'সর্বস্বত্ব সংরক্ষিত।'}
          </span>

          <div>
            <Link href="/services">
              {en ? 'Services' : 'সেবাসমূহ'}
            </Link>

            <Link href="/work">
              {en ? 'Our Work' : 'আমাদের কাজ'}
            </Link>

            <Link href="/blog">
              {en ? 'Blog' : 'ব্লগ'}
            </Link>

            <Link href="/contact">
              {en ? 'Contact' : 'যোগাযোগ'}
            </Link>

            <Link href="/privacy">
              {en ? 'Privacy' : 'গোপনীয়তা'}
            </Link>

            <Link href="/terms">
              {en ? 'Terms' : 'শর্তাবলি'}
            </Link>

            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
