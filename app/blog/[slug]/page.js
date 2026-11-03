
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site-shell';
import BlogArticleContent from '@/components/blog-article-content';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const sampleArticle = {
  title: 'আপনার ব্যবসার জন্য কেন একটি Professional Website প্রয়োজন?',
  titleEn: 'Why Does Your Business Need a Professional Website?',

  slug: 'business-website-guide',

  excerpt:
    'ডিজিটাল যুগে একটি ওয়েবসাইট আপনার ব্যবসার বিশ্বাসযোগ্যতা ও অনলাইন পরিচয় তৈরি করে।',

  excerptEn:
    'In the digital age, a website builds your business credibility and online identity.',

  publishedAt: new Date('2026-11-03'),
  content: [],
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

  const articleData = {
    ...post,
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : new Date().toISOString(),
  };

  return (
    <SiteShell>
      <BlogArticleContent
        post={articleData}
        isSample={isSample}
      />
    </SiteShell>
  );
}
