
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSite } from '@/components/site-provider';
import DemoCard from '@/components/demo-card';

export default function ServiceDetailContent({ service, related }) {
  const { lang } = useSite();
  const en = lang === 'en';

  const title = en
    ? service.titleEn || service.title
    : service.title;

  const description = en
    ? service.descriptionEn || service.description
    : service.description;

  const features = en
    ? service.featuresEn || service.features
    : service.features;

  return (
    <main className="inner-page">

      {/* HERO SECTION */}
      <section className="service-detail-hero container">

        <div>
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {service.number} / {en ? 'Our Services' : 'আমাদের সেবাসমূহ'}
          </span>

          <h1>{title}</h1>

          <p>{description}</p>

          <div className="hero-actions">
            <Link
              href={`/request?service=${service.slug}`}
              className="button"
            >
              {en ? 'Book This Service' : 'এই সেবাটি বুক করুন'}
              <ArrowUpRight size={16} />
            </Link>

            <Link href="/contact" className="button button-ghost">
              {en ? 'Talk to Our Team' : 'আমাদের সঙ্গে কথা বলুন'}
            </Link>
          </div>
        </div>

        <div className="service-detail-image">
          <Image
            src={service.image}
            alt={title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="container detail-content">

        <div>
          <span className="eyebrow">
            {en ? "WHAT'S INCLUDED" : 'এই সেবার অন্তর্ভুক্ত কাজ'}
          </span>

          <h2>
            {en ? (
              <>Built Around<br /><em>Your Needs.</em></>
            ) : (
              <>আপনার প্রয়োজন<br /><em>অনুযায়ী তৈরি।</em></>
            )}
          </h2>
        </div>

        <div className="feature-list">
          {features.map((feature, index) => (
            <div key={index}>
              <CheckCircle2 size={19} />
              {feature}
            </div>
          ))}
        </div>

      </section>

      {/* RELATED WORK */}
      {related.length > 0 && (
        <section className="container related-work">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                {en ? 'OUR WORK' : 'নমুনা কাজ'}
              </span>

              <h2>
                {en ? (
                  <>Explore Some <em>Examples.</em></>
                ) : (
                  <>কিছু উদাহরণ <em>দেখে নিন।</em></>
                )}
              </h2>
            </div>

            <p>
              {en
                ? 'Explore these sample designs to understand our work and creative possibilities.'
                : 'এগুলো নমুনা ডিজাইন, যা আমাদের কাজের ধরন ও সম্ভাবনা বুঝতে সাহায্য করবে।'}
            </p>

          </div>

          <div className="work-grid">
            {related.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>

        </section>
      )}

      {/* CTA SECTION */}
      <section className="container detail-cta">

        <h2>
          {en ? (
            <>Have Another<br /><em>Requirement?</em></>
          ) : (
            <>আপনার কি অন্য কোনো<br /><em>প্রয়োজন আছে?</em></>
          )}
        </h2>

        <p>
          {en
            ? 'Tell us about your requirements. We will create a solution based on your goals.'
            : 'আপনার কাজের বিস্তারিত জানান। আপনার লক্ষ্য অনুযায়ী সমাধান তৈরি করব।'}
        </p>

        <Link
          href={`/request?service=${service.slug}`}
          className="button"
        >
          {en ? 'Send Booking Request' : 'বুকিং অনুরোধ পাঠান'}
          <ArrowUpRight size={16} />
        </Link>

      </section>

    </main>
  );
}
