
import SiteShell from '@/components/site-shell';
import BlogPageContent from '@/components/blog-page-content';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog — NovaLoom Digital',
  description:
    'Explore useful insights about websites, software, digital marketing, and technology.',
};

const sampleArticle = {
  id: 'sample-1',
  title: 'আপনার ব্যবসার জন্য কেন একটি Professional Website প্রয়োজন?',
  titleEn: 'Why Does Your Business Need a Professional Website?',
  slug: 'business-website-guide',

  excerpt:
    'ডিজিটাল যুগে একটি ওয়েবসাইট আপনার ব্যবসার বিশ্বাসযোগ্যতা ও অনলাইন পরিচয় তৈরি করে। জানুন কীভাবে একটি Professional Website আপনার ব্যবসাকে এগিয়ে নিতে পারে।',

  excerptEn:
    'In the digital age, a website builds your business credibility and online identity. Discover how a professional website can help your business grow.',

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

  const hasSample = posts.some(
    (post) => post.slug === sampleArticle.slug
  );

  const allPosts = hasSample
    ? posts.map((post) =>
        post.slug === sampleArticle.slug
          ? { ...post, titleEn: sampleArticle.titleEn, excerptEn: sampleArticle.excerptEn }
          : post
      )
    : [sampleArticle, ...posts];

  return (
    <SiteShell>
      <BlogPageContent posts={allPosts} />
    </SiteShell>
  );
}
