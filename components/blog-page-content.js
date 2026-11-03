
'use client';

import Link from 'next/link';
import { useSite } from '@/components/site-provider';

export default function BlogPageContent({ posts = [] }) {
  const { lang } = useSite();
  const en = lang === 'en';

  const sampleTitle = en
    ? 'Why Does Your Business Need a Professional Website?'
    : 'আপনার ব্যবসার জন্য কেন একটি Professional Website প্রয়োজন?';

  const sampleExcerpt = en
    ? 'In the digital age, a website builds your business credibility and online identity. Discover how a professional website can help your business grow.'
    : 'ডিজিটাল যুগে একটি ওয়েবসাইট আপনার ব্যবসার বিশ্বাসযোগ্যতা ও অনলাইন পরিচয় তৈরি করে। জানুন কীভাবে একটি Professional Website আপনার ব্যবসাকে এগিয়ে নিতে পারে।';

  return (
    <main className="container inner-page">
      <section className="inner-hero">
        <span className="eyebrow">NOVALOOM JOURNAL</span>

        <h1>
          {en
            ? 'Fresh Ideas and New Possibilities in the'
            : 'ডিজিটাল দুনিয়ার নতুন ধারণা ও '}
          <em>{en ? 'Digital World' : 'সম্ভাবনা'}</em>
        </h1>

        <p>
          {en
            ? 'Explore useful insights and ideas about websites, software, digital marketing, and technology with NovaLoom.'
            : 'ওয়েবসাইট, সফটওয়্যার, ডিজিটাল মার্কেটিং এবং প্রযুক্তি নিয়ে প্রয়োজনীয় পরামর্শ ও আইডিয়া জানুন NovaLoom-এর সঙ্গে।'}
        </p>
      </section>

      <section className="blog-grid">
        {posts.map((post) => {
          const isSample = post.slug === 'business-website-guide';

          const title = en
            ? (post.titleEn || (isSample ? sampleTitle : post.title))
            : post.title;

          const excerpt = en
            ? (post.excerptEn || (isSample ? sampleExcerpt : post.excerpt))
            : post.excerpt;

          const date = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString(
                en ? 'en-US' : 'bn-BD'
              )
            : 'NOVALOOM JOURNAL';

          return (
            <article className="blog-card" key={post.id}>
              {post.coverImage && (
                <img src={post.coverImage} alt={title} />
              )}

              <div>
                <span className="eyebrow">{date}</span>

                <h2>{title}</h2>

                <p>{excerpt}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-link"
                >
                  {en ? 'Read Full Article' : 'সম্পূর্ণ আর্টিকেল পড়ুন'} ↗
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {posts.length === 0 && (
        <div className="dash-empty">
          <h2>
            {en ? 'New articles coming soon!' : 'নতুন আর্টিকেল আসছে শীঘ্রই!'}
          </h2>
          <p>
            {en ? 'Stay connected with us.' : 'আমাদের সঙ্গে থাকুন।'}
          </p>
        </div>
      )}
    </main>
  );
}
