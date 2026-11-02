import SiteShell from '@/components/site-shell';
import ServiceCard from '@/components/service-card';
import {services} from '@/lib/catalog';
import {ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
export const metadata={title:'আমাদের সেবাসমূহ — NovaLoom Digital'};
export default function ServicesPage(){return <SiteShell><main className="inner-page"><section className="inner-hero container"><span className="eyebrow"><span className="eyebrow-line"/> আমাদের সেবাসমূহ</span><h1>আপনার প্রয়োজনীয় সব ডিজিটাল সেবা<br/><em>একটি নির্ভরযোগ্য টিমের সঙ্গে।</em></h1><p>নিচের ক্যাটাগরিগুলো থেকে আপনার প্রয়োজনীয় সেবাটি বেছে নিন। প্রতিটি কার্ডে বিস্তারিত, কী কী কাজ করা হয় এবং বুকিংয়ের সুযোগ পাবেন।</p><Link href="/request" className="button">আপনার প্রয়োজন জানান <ArrowUpRight size={16}/></Link></section><section className="container inner-services"><div className="services-grid">{services.map((s,i)=><ServiceCard key={s.slug} service={s} index={i}/>)}</div></section></main></SiteShell>}
