
import SiteShell from '@/components/site-shell';
import ServicesPageContent from '@/components/services-page-content';

export const metadata = {
  title: 'Our Services | NovaLoom Digital Solutions',
  description:
    'Explore website development, e-commerce, web applications, mobile apps, UI/UX design, SEO and AI solutions.',
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <ServicesPageContent />
    </SiteShell>
  );
}
