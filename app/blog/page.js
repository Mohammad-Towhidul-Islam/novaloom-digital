
import Link from 'next/link';
import SiteShell from '@/components/site-shell';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const sampleArticle = {
  id: 'sample-1',
  title: 'আপনার ব্যবসার জন্য কেন একটি Professional Website প্রয়োজন?',
  slug: 'business-website-guide',
  excerpt:
    'ডিজিটাল যুগে একটি ওয়েবসাইট আপনার ব্যবসার বিশ্বাসযোগ্যতা ও অনলাইন পরিচয় তৈরি করে। জানুন কীভাবে একটি Professional Website আপনার ব্যবসাকে এগিয়ে নিতে পারে।',
  publishedAt: new Date('2026-11-03'),
  coverImage: null,
};

export default async function Blog() {
  let posts = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (error) {
    console.error('Blog database error:', error);
  }

  // Sample article যেন সবসময় দেখা যায়
  const hasSample = posts.some(
    (post) => post.slug === sampleArticle.slug
  );

  const allPosts = hasSample
    ? posts
    : [sampleArticle, ...posts];

  return (
    <SiteShell>
      <main className="container inner-page">

        <section className="inner-hero">
          <span className="eyebrow">
            NOVALOOM JOURNAL
          </span>

          <h1>
            ডিজিটাল দুনিয়ার নতুন ধারণা ও <em>সম্ভাবনা</em>
          </h1>

          <p>
            ওয়েবসাইট, সফটওয়্যার, ডিজিটাল মার্কেটিং এবং
            প্রযুক্তি নিয়ে প্রয়োজনীয় পরামর্শ ও আইডিয়া
            জানুন NovaLoom-এর সঙ্গে।
          </p>
        </section>

        <section className="blog-grid">
          {allPosts.map((post) => (
            <article className="blog-card" key={post.id}>

              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                />
              )}

              <div>
                <span className="eyebrow">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('bn-BD')
                    : 'NOVALOOM JOURNAL'}
                </span>

                <h2>{post.title}</h2>

                <p>{post.excerpt}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-link"
                >
                  সম্পূর্ণ আর্টিকেল পড়ুন ↗
                </Link>
              </div>

            </article>
          ))}
        </section>

        {allPosts.length === 0 && (
          <div className="dash-empty">
            <h2>নতুন আর্টিকেল আসছে শীঘ্রই!</h2>
            <p>আমাদের সঙ্গে থাকুন।</p>
          </div>
        )}

      </main>
    </SiteShell>
  );
}
