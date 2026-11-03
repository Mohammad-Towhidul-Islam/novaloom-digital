
'use client';

import { useSite } from '@/components/site-provider';
import ServiceCard from '@/components/service-card';
import { services } from '@/lib/catalog';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesPageContent() {
  const { lang } = useSite();
  const en = lang === 'en';

  return (
    <main className="services-page container">
      <section className="services-hero">
        <span className="eyebrow">
          {en ? 'NOVALOOM DIGITAL SERVICES' : 'NOVALOOM ডিজিটাল সেবা'}
        </span>

     <h1 className="services-main-title">
  {en
    ? 'Digital Solutions Built Around You.'
    : 'আপনার প্রয়োজনের স্মার্ট ডিজিটাল সমাধান।'}
</h1>

<div className="services-title-line"></div>

        <p>
          {en
            ? 'From websites and applications to AI and digital marketing, we help turn your ideas into reality.'
            : 'ওয়েবসাইট, অ্যাপ্লিকেশন থেকে শুরু করে এআই ও ডিজিটাল মার্কেটিং—আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা পাশে আছি।'}
        </p>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              {en ? 'WHAT WE DO' : 'আমাদের সেবাসমূহ'}
            </span>

            <h2>
              {en ? 'Explore Our Services' : 'আমাদের সকল সেবা'}
            </h2>
          </div>

          <p>
            {en
              ? 'Choose a service that matches your business goals.'
              : 'আপনার ব্যবসার প্রয়োজন অনুযায়ী সেবা বেছে নিন।'}
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug}
              service={service}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="services-cta">
        <span className="eyebrow">
          {en ? 'HAVE A PROJECT IN MIND?' : 'আপনার কি কোনো প্রজেক্ট আছে?'}
        </span>

        <h2>
          {en
            ? 'Let’s build something great together.'
            : 'চলুন একসাথে দারুণ কিছু তৈরি করি।'}
        </h2>

        <p>
          {en
            ? 'Tell us about your idea. We will help you find the right solution.'
            : 'আপনার আইডিয়া আমাদের জানান। আমরা সঠিক সমাধান খুঁজে দিতে সাহায্য করব।'}
        </p>

        <Link href="/request" className="button">
          {en ? 'Start Your Project' : 'প্রজেক্ট শুরু করুন'}
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}
