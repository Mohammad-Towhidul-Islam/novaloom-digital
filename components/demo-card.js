
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Eye } from 'lucide-react';
import { useSite } from '@/components/site-provider';

export default function DemoCard({ demo }) {
  const { lang } = useSite();
  const en = lang === 'en';

  const title = en
    ? demo.titleEn || demo.title
    : demo.title;

  const category = en
    ? demo.categoryEn || demo.category
    : demo.category;

  const description = en
    ? demo.descriptionEn || demo.description
    : demo.description;

  return (
    <article className="demo-card">
      <Link
        href={`/work/${demo.slug}`}
        className="demo-image"
      >
        <Image
          src={demo.image}
          alt={title}
          fill
          sizes="(max-width: 700px) 90vw, 45vw"
        />

        <span className="demo-view">
          <Eye size={15} />
          {en ? 'View Demo' : 'নমুনা দেখুন'}
        </span>
      </Link>

      <div className="demo-info">
        <div>
          <span className="eyebrow">{category}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <Link
          href={`/work/${demo.slug}`}
          className="round-arrow"
          aria-label={`${title} ${en ? 'View' : 'দেখুন'}`}
        >
          <ArrowUpRight />
        </Link>
      </div>

      <div className="tag-row">
        {(demo.tags || demo.technologies || [])
          .slice(0, 3)
          .map((tag) => (
            <span key={tag}>{tag}</span>
          ))}

        {demo.concept !== false && (
          <span className="concept-tag">
            {en ? 'Demo Design' : 'নমুনা ডিজাইন'}
          </span>
        )}
      </div>
    </article>
  );
}
