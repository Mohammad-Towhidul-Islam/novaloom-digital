import SiteShell from '@/components/site-shell';
import {services,demos} from '@/lib/catalog';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,CheckCircle2} from 'lucide-react';
import DemoCard from '@/components/demo-card';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return services.map(s=>({slug:s.slug}));}
export default function ServiceDetail({params}){
 const s=services.find(x=>x.slug===params.slug); if(!s)return notFound();
 const related=demos.filter(d=>d.categorySlug===s.slug);
 return <SiteShell><main className="inner-page">
  <section className="service-detail-hero container"><div><span className="eyebrow"><span className="eyebrow-line"/> {s.number} / আমাদের সেবাসমূহ</span><h1>{s.title}</h1><p>{s.description}</p><div className="hero-actions"><Link href={`/request?service=${s.slug}`} className="button">এই সেবাটি বুক করুন <ArrowUpRight size={16}/></Link><Link href="/contact" className="button button-ghost">আমাদের সঙ্গে কথা বলুন</Link></div></div><div className="service-detail-image"><Image src={s.image} alt={s.title} fill priority sizes="(max-width: 800px) 100vw, 50vw"/></div></section>
  <section className="container detail-content"><div><span className="eyebrow">এই সেবার অন্তর্ভুক্ত কাজ</span><h2>আপনার প্রয়োজন<br/><em>অনুযায়ী তৈরি।</em></h2></div><div className="feature-list">{s.features.map(f=><div key={f}><CheckCircle2 size={19}/>{f}</div>)}</div></section>
  {related.length>0&&<section className="container related-work"><div className="section-heading"><div><span className="eyebrow">নমুনা কাজ</span><h2>কিছু উদাহরণ <em>দেখে নিন।</em></h2></div><p>এগুলো নমুনা ডিজাইন, যা আমাদের কাজের ধরন ও সম্ভাবনা বুঝতে সাহায্য করবে।</p></div><div className="work-grid">{related.map(d=><DemoCard key={d.slug} demo={d}/>)}</div></section>}
  <section className="container detail-cta"><h2>আপনার কি অন্য কোনো<br/><em>প্রয়োজন আছে?</em></h2><p>আপনার কাজের বিস্তারিত জানান। আপনার লক্ষ্য অনুযায়ী সমাধান তৈরি করব।</p><Link href={`/request?service=${s.slug}`} className="button">বুকিং অনুরোধ পাঠান <ArrowUpRight size={16}/></Link></section>
 </main></SiteShell>;
}
