
import Link from 'next/link';
import Image from 'next/image';
import Icon from './icons';
import { ArrowUpRight } from 'lucide-react';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="service-card bn-service-card"
      style={{ '--accent': service.accent || '#159b78' }}
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
          alt={service.title}
          fill
          priority={index < 3}
          sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>

      <div className="service-card-copy">
        <h3>{service.title}</h3>
        <p>{service.description}</p>

        <span className="text-link">
          বিস্তারিত দেখুন <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
