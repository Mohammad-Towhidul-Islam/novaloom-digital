
import SiteShell from '@/components/site-shell';
import ServiceDetailContent from '@/components/service-detail-content';
import { services, demos } from '@/lib/catalog';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetail({ params }) {
  const service = services.find(
    (item) => item.slug === params.slug
  );

  if (!service) {
    notFound();
  }

  const related = demos.filter(
    (demo) => demo.categorySlug === service.slug
  );

  return (
    <SiteShell>
      <ServiceDetailContent
        service={service}
        related={related}
      />
    </SiteShell>
  );
}
