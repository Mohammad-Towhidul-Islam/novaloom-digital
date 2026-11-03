
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from './icons';
import { ArrowUpRight } from 'lucide-react';
import { useSite } from '@/components/site-provider';

export default function ServiceCard({ service, index = 0 }) {
  const { lang } = useSite();
  const en = lang === 'en';

  const title = en
    ? service.titleEn || service.title
    : service.title;

  const description = en
    ? service.descriptionEn || service.description
    : service.description;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="service-card bn-service-card"
      style={{
        '--accent': service.accent || '#159b78',
      }}
    >
      <div className="service-card-top">
        <span className="service-index">
          {service.number || String(index + 1).padStart(2, '0')}
        </span>

        <span className="service-icon">
          <Icon name={service.icon} />
        </span>
      </div>

      <div className="service-image">
        <Image
          src={service.image}
          alt={title}
          fill
          priority={index < 3}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      <div className="service-card-copy">
        <h3>{title}</h3>

        <p>{description}</p>

        <span className="text-link">
          {en ? 'View Details' : 'বিস্তারিত দেখুন'}
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
