
import './globals.css';
import { SiteProvider } from '@/components/site-provider';

export const metadata = {
  title: 'NovaLoom Digital Solutions',
  description:
    'NovaLoom provides websites, apps, software, design, automation and AI solutions for your business.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <SiteProvider>
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
