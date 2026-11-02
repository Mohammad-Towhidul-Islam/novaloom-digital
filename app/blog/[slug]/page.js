
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteShell from '@/components/site-shell';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const sampleArticle = {
  title: 'আপনার ব্যবসার জন্য কেন একটি Professional Website প্রয়োজন?',
  slug: 'business-website-guide',
  excerpt:
    'ডিজিটাল যুগে একটি ওয়েবসাইট আপনার ব্যবসার বিশ্বাসযোগ্যতা ও অনলাইন পরিচয় তৈরি করে।',
  publishedAt: new Date('2026-11-03'),
  content: [
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
};

export default async function BlogArticle({ params }) {
  const { slug } = await params;

  let post = null;

  if (slug === sampleArticle.slug) {
    post = sampleArticle;
  } else {
    try {
      post = await prisma.blogPost.findFirst({
        where: { slug, published: true },
      });
    } catch (error) {
      console.error('Blog article database error:', error);
    }
  }

  if (!post) notFound();

  const isSample = slug === sampleArticle.slug;

  return (
    <SiteShell>
      <main className="container blog-article nl-article">

        <Link href="/blog" className="text-link">
          ← সব আর্টিকেল
        </Link>

        <span className="eyebrow article-eyebrow">
          NOVALOOM JOURNAL · INSIGHTS
        </span>

        <h1>{post.title}</h1>

        <p className="blog-excerpt">{post.excerpt}</p>

        <div className="article-info">
          <span>NovaLoom Editorial Team</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString('bn-BD')}
          </span>
          <span>৫ মিনিট পড়তে</span>
        </div>

        <div className="article-cover-design">
          <span>BUILD YOUR DIGITAL FUTURE</span>
          <strong>YOUR BUSINESS.<br />YOUR NEXT MOVE.</strong>
          <small>NOVALOOM DIGITAL SOLUTIONS</small>
        </div>

        <article className="blog-content nl-article-content">

          <p>
            একটি সফল ব্যবসার জন্য ভালো পণ্য বা সেবার পাশাপাশি
            একটি শক্তিশালী ডিজিটাল পরিচয়ও প্রয়োজন।
          </p>

          {isSample ? (
            post.content.map((section, index) => (
              <section key={index}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))
          ) : (
            post.content.split('\n').map((line, index) =>
              line.trim() ? <p key={index}>{line}</p> : null
            )
          )}

          <div className="article-conclusion">
            <h2>আপনার ডিজিটাল যাত্রা শুরু করুন</h2>
            <p>
              আপনার ব্যবসার জন্য একটি প্রফেশনাল ওয়েবসাইট বা
              কাস্টম ডিজিটাল সমাধান প্রয়োজন হলে NovaLoom-এর সঙ্গে
              যোগাযোগ করুন।
            </p>
            <Link href="/request" className="button">
              আপনার প্রজেক্ট নিয়ে আলোচনা করুন ↗
            </Link>
          </div>

        </article>
      </main>
    </SiteShell>
  );
}
