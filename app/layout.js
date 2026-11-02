import './globals.css';
import { SiteProvider } from '@/components/site-provider';
export const metadata = {
  title: 'NovaLoom Digital — আপনার সব ডিজিটাল সমাধান এক জায়গায়',
  description: 'ওয়েবসাইট, অ্যাপ, সফটওয়্যার, ডিজাইন, অটোমেশন ও এআই সেবা—আপনার প্রয়োজন অনুযায়ী।',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};
export default function RootLayout({ children }) {
  return <html lang="bn"><body><SiteProvider>{children}</SiteProvider></body></html>;
}
