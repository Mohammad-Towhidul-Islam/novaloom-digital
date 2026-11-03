
'use client';

import SiteShell from '@/components/site-shell';
import DemoCard from '@/components/demo-card';
import { demos, services } from '@/lib/catalog';
import { useMemo, useState } from 'react';
import { useSite } from '@/components/site-provider';

export default function WorkPage() {
  const [filter, setFilter] = useState('all');
  const { lang } = useSite();
  const en = lang === 'en';

  const items = useMemo(
    () =>
      filter === 'all'
        ? demos
        : demos.filter((demo) => demo.categorySlug === filter),
    [filter]
  );

  return (
    <SiteShell>
      <main className="inner-page">
        <section className="inner-hero container">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {en ? 'THE SHOWCASE' : 'আমাদের নমুনা কাজ'}
          </span>

          <h1>
            {en ? 'Ideas, made' : 'আইডিয়াকে'}
            {' '}
            <em>{en ? 'visible.' : 'বাস্তবে রূপ দিই।'}</em>
          </h1>

          <p>
            {en
              ? 'Explore a collection of concept demos across our services. These previews show the kinds of digital experiences we can create for your business.'
              : 'আমাদের বিভিন্ন সেবার নমুনা প্রজেক্টগুলো দেখুন। এই ডেমোগুলো থেকে বুঝতে পারবেন আপনার ব্যবসার জন্য কী ধরনের ডিজিটাল অভিজ্ঞতা তৈরি করা সম্ভব।'}
          </p>
        </section>

        <section className="container showcase-section">
          <div className="filter-row">
            <button
              className={filter === 'all' ? 'filter active' : 'filter'}
              onClick={() => setFilter('all')}
            >
              {en ? 'All Concepts' : 'সব নমুনা'}
            </button>

            {services.map((service) => (
              <button
                key={service.slug}
                className={
                  filter === service.slug ? 'filter active' : 'filter'
                }
                onClick={() => setFilter(service.slug)}
              >
                {en
                  ? service.titleEn || service.title
                  : service.title}
              </button>
            ))}
          </div>

          <div className="work-grid">
            {items.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="dash-empty">
              <h2>
                {en ? 'No projects found.' : 'কোনো প্রজেক্ট পাওয়া যায়নি।'}
              </h2>
              <p>
                {en
                  ? 'Please select another category.'
                  : 'অন্য একটি ক্যাটাগরি নির্বাচন করুন।'}
              </p>
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
