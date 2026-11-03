
'use client';

import Link from 'next/link';
import { useSite } from '@/components/site-provider';

const sampleContent = {
  bn: [
    {
      heading: '১. অনলাইনে আপনার ব্যবসার পরিচয় তৈরি করুন',
      body: 'বর্তমানে মানুষ কোনো পণ্য বা সেবা নেওয়ার আগে অনলাইনে সেটি সম্পর্কে জানতে চায়। একটি সুন্দর ও প্রফেশনাল ওয়েবসাইট আপনার ব্যবসাকে অনলাইনে পরিচিত করে তোলে।',
    },
    {
      heading: '২. কাস্টমারের বিশ্বাস অর্জন করুন',
      body: 'একটি সুপরিকল্পিত ওয়েবসাইটে আপনার সার্ভিস, কাজের নমুনা, যোগাযোগের তথ্য এবং কাস্টমারদের অভিজ্ঞতা তুলে ধরতে পারেন। এতে নতুন কাস্টমারের আস্থা তৈরি হয়।',
    },
    {
      heading: '৩. সার্ভিস ও কাজের নমুনা প্রদর্শন করুন',
      body: 'আপনার ব্যবসার সব সার্ভিস, প্রজেক্ট এবং কাজের উদাহরণ একটি জায়গায় সুন্দরভাবে সাজিয়ে রাখা যায়। ফলে কাস্টমার সহজেই বুঝতে পারে আপনি কী ধরনের কাজ করেন।',
    },
    {
      heading: '৪. নতুন কাস্টমার পাওয়ার সুযোগ বাড়ান',
      body: 'SEO এবং ভালো কনটেন্টের মাধ্যমে Google Search থেকে নতুন ভিজিটর আপনার ওয়েবসাইটে আসতে পারে। এতে আপনার ব্যবসার পরিচিতি ও সম্ভাব্য কাস্টমারের সংখ্যা বাড়তে পারে।',
    },
    {
      heading: '৫. আপনার ব্যবসার ভবিষ্যতের জন্য বিনিয়োগ করুন',
      body: 'একটি ওয়েবসাইট শুধু বর্তমানের প্রয়োজন নয়। সময়ের সঙ্গে নতুন সার্ভিস, ফিচার এবং অনলাইন সুবিধা যুক্ত করে আপনার ব্যবসাকে আরও বড় করার সুযোগ তৈরি হয়।',
    },
  ],
  en: [
    {
      heading: '1. Build Your Business Identity Online',
      body: 'Today, people often search online before choosing a product or service. A professional website helps introduce your business to the online world and creates a strong digital identity.',
    },
    {
      heading: '2. Earn Customer Trust',
      body: 'A well-designed website allows you to showcase your services, previous work, contact information, and customer experiences. This helps potential customers feel more confident about your business.',
    },
    {
      heading: '3. Showcase Your Services and Portfolio',
      body: 'You can organize all your services, projects, and examples of previous work in one place. This helps customers easily understand what you offer and how you can help them.',
    },
    {
      heading: '4. Increase Opportunities to Reach New Customers',
      body: 'With SEO and useful content, new visitors can discover your website through Google Search. This can increase your online visibility and help you reach potential customers.',
    },
    {
      heading: '5. Invest in the Future of Your Business',
      body: 'A website is not just a solution for today. You can add new services, features, and online capabilities over time to support your business growth.',
    },
  ],
};

export default function BlogArticleContent({ post, isSample }) {
  const { lang } = useSite();
  const en = lang === 'en';

  const sample = isSample;

  const content = sample
    ? sampleContent[en ? 'en' : 'bn']
    : null;

  const rawContent = !sample
    ? (en ? post.contentEn || post.content : post.content)
    : null;

  const articleText = typeof rawContent === 'string'
    ? rawContent
    : '';

  return (
    <main className="container blog-article nl-article">
      <Link href="/blog" className="text-link">
        {en ? '← All Articles' : '← সব আর্টিকেল'}
      </Link>

      <span className="eyebrow article-eyebrow">
        NOVALOOM JOURNAL · INSIGHTS
      </span>

      <h1>{en ? post.titleEn || post.title : post.title}</h1>

      <p className="blog-excerpt">
        {en ? post.excerptEn || post.excerpt : post.excerpt}
      </p>

      <div className="article-info">
        <span>
          {en ? 'NovaLoom Editorial Team' : 'NovaLoom Editorial Team'}
        </span>

        <span>
          {new Date(post.publishedAt).toLocaleDateString(
            en ? 'en-US' : 'bn-BD'
          )}
        </span>

        <span>
          {en ? '5 min read' : '৫ মিনিট পড়তে'}
        </span>
      </div>

      <div className="article-cover-design">
        <span>BUILD YOUR DIGITAL FUTURE</span>
        <strong>
          YOUR BUSINESS.
          <br />
          YOUR NEXT MOVE.
        </strong>
        <small>NOVALOOM DIGITAL SOLUTIONS</small>
      </div>

      <article className="blog-content nl-article-content">
        <p>
          {en
            ? 'A successful business needs more than a good product or service. It also needs a strong digital identity that helps customers discover, understand, and trust your brand.'
            : 'একটি সফল ব্যবসার জন্য ভালো পণ্য বা সেবার পাশাপাশি একটি শক্তিশালী ডিজিটাল পরিচয়ও প্রয়োজন।'}
        </p>

        {sample ? (
          content.map((section, index) => (
            <section key={index}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))
        ) : (
          articleText.split('\n').map((line, index) =>
            line.trim() ? <p key={index}>{line}</p> : null
          )
        )}

        <div className="article-conclusion">
          <h2>
            {en
              ? 'Start Your Digital Journey'
              : 'আপনার ডিজিটাল যাত্রা শুরু করুন'}
          </h2>

          <p>
            {en
              ? 'If you need a professional website or a custom digital solution for your business, get in touch with NovaLoom.'
              : 'আপনার ব্যবসার জন্য একটি প্রফেশনাল ওয়েবসাইট বা কাস্টম ডিজিটাল সমাধান প্রয়োজন হলে NovaLoom-এর সঙ্গে যোগাযোগ করুন।'}
          </p>

          <Link href="/request" className="button">
            {en
              ? 'Discuss Your Project'
              : 'আপনার প্রজেক্ট নিয়ে আলোচনা করুন'}
            ↗
          </Link>
        </div>
      </article>
    </main>
  );
}
