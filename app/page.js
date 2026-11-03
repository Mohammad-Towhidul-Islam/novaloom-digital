
'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Layers3,
  Zap,
} from 'lucide-react';

import SiteShell from '@/components/site-shell';
import ServiceCard from '@/components/service-card';
import DemoCard from '@/components/demo-card';
import WhatsApp from '@/components/whatsapp';
import { services, demos } from '@/lib/catalog';
import { useSite } from '@/components/site-provider';

export default function Home() {
  const { lang } = useSite();
  const en = lang === 'en';

  const testimonials = [
    {
      name: 'Rahim Ahmed',
      role: en ? 'Business Owner' : 'ব্যবসার মালিক',
      initial: 'R',
      color: 'avatar-one',
      review: en
        ? 'NovaLoom created a website for my business. The design and overall experience were excellent.'
        : 'আমার ব্যবসার জন্য ওয়েবসাইট তৈরি করে দিয়েছে NovaLoom। ডিজাইন এবং পুরো কাজের অভিজ্ঞতা খুবই ভালো ছিল।',
    },
    {
      name: 'Sara Islam',
      role: en ? 'Entrepreneur' : 'উদ্যোক্তা',
      initial: 'S',
      color: 'avatar-two',
      review: en
        ? 'I received a beautiful design and excellent support. The entire project was completed according to plan.'
        : 'খুব সুন্দর ডিজাইন এবং চমৎকার সহযোগিতা পেয়েছি। পুরো প্রজেক্টটি পরিকল্পনা অনুযায়ী সম্পন্ন হয়েছে।',
    },
    {
      name: 'Tanvir Hasan',
      role: en ? 'Startup Founder' : 'স্টার্টআপ প্রতিষ্ঠাতা',
      initial: 'T',
      color: 'avatar-three',
      review: en
        ? 'The NovaLoom team understood my needs and created a great digital solution.'
        : 'NovaLoom-এর টিম আমার প্রয়োজন বুঝে একটি সুন্দর ডিজিটাল সমাধান তৈরি করেছে।',
    },
  ];

  const steps = en
    ? [
        ['01', 'Understand Your Needs', 'We listen to your ideas, ask the right questions, and understand your goals.'],
        ['02', 'Create a Plan', 'We prepare the scope, priorities, timeline, and a customized proposal.'],
        ['03', 'Design & Development', 'We build, test, and improve the solution with your feedback.'],
        ['04', 'Launch & Improve', 'We launch carefully and support you with future improvements.'],
      ]
    : [
        ['০১', 'প্রয়োজন বুঝি', 'আপনার কথা শুনি, প্রয়োজনীয় প্রশ্ন করি এবং লক্ষ্য বুঝে নিই।'],
        ['০২', 'পরিকল্পনা করি', 'কাজের পরিধি, অগ্রাধিকার, সময়সীমা ও কাস্টম প্রস্তাব তৈরি করি।'],
        ['০৩', 'ডিজাইন ও ডেভেলপমেন্ট', 'আপনার মতামত নিয়ে তৈরি, পরীক্ষা ও উন্নত করি।'],
        ['০৪', 'চালু ও উন্নয়ন', 'যত্নসহকারে চালু করি এবং পরবর্তী উন্নয়নেও পাশে থাকি।'],
      ];

  return (
    <SiteShell>
      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-grid container">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="pulse-dot" />
                {en
                  ? 'Digital solutions tailored to your needs'
                  : 'আপনার প্রয়োজন অনুযায়ী ডিজিটাল সমাধান'}
              </div>

              <h1>
                {en ? 'Everything' : 'এক জায়গায়'}
                <br />
                <span>{en ? 'Digital, All in' : 'সব ধরনের ডিজিটাল'}</span>
                <br />
                <em>{en ? 'One Place.' : 'সমাধান।'}</em>
              </h1>

              <p className="hero-lead">
                {en
                  ? 'Websites, online stores, software, mobile apps, and digital marketing — get the services your business needs, all in one place.'
                  : 'আপনার ব্যবসার জন্য ওয়েবসাইট, অনলাইন শপ, সফটওয়্যার, মোবাইল অ্যাপ কিংবা ডিজিটাল মার্কেটিং—প্রয়োজন অনুযায়ী সব সেবা পাবেন এক জায়গায়।'}
              </p>

              <div className="hero-actions">
                <Link href="/services" className="button">
                  {en ? 'Explore Services' : 'সেবাসমূহ দেখুন'}
                  <ArrowUpRight size={17} />
                </Link>

                <Link href="/request" className="button button-ghost">
                  {en ? 'Book a Service' : 'সেবা বুক করুন'}
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="hero-proof">
                <div className="proof-avatars">
                  <span>N</span>
                  <span>L</span>
                  <span>+</span>
                </div>

                <div>
                  <strong>
                    {en ? 'Solutions for Your Goals' : 'আপনার লক্ষ্য অনুযায়ী সমাধান'}
                  </strong>
                  <small>
                    {en
                      ? 'Smart planning · Quality work · Reliable support'
                      : 'সঠিক পরিকল্পনা · মানসম্মত কাজ · নির্ভরযোগ্য সহযোগিতা'}
                  </small>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-orbit orbit-one" />
              <div className="hero-orbit orbit-two" />
              <div className="hero-glow" />

              <div className="hero-window">
                <div className="window-bar">
                  <span />
                  <span />
                  <span />
                  <small>novaloom.digital</small>
                </div>

                <div className="window-content">
                  <div className="window-nav">
                    <b>n<span>.</span></b>
                    <div>
                      {en
                        ? 'Services   Our Work   Contact'
                        : 'সেবা   আমাদের কাজ   যোগাযোগ'}
                    </div>
                    <span className="window-menu">☰</span>
                  </div>

                  <div className="window-main">
                    <span>
                      {en
                        ? 'PLANNING / DESIGN / DEVELOPMENT'
                        : 'পরিকল্পনা / ডিজাইন / ডেভেলপমেন্ট'}
                    </span>

                    <h3>
                      {en ? 'Your' : 'আপনার'}
                      <br />
                      <i>{en ? 'Next Step.' : 'পরবর্তী পদক্ষেপ।'}</i>
                    </h3>

                    <div className="window-button">
                      {en ? 'Explore Services ↗' : 'সেবাসমূহ দেখুন ↗'}
                    </div>

                    <div className="window-blob" />
                  </div>

                  <div className="window-bottom">
                    <span>{en ? '01 — Planning' : '০১ — পরিকল্পনা'}</span>
                    <span>{en ? '02 — Experience' : '০২ — অভিজ্ঞতা'}</span>
                    <span>{en ? '03 — Technology' : '০৩ — প্রযুক্তি'}</span>
                  </div>
                </div>
              </div>

              <div className="float-card float-card-top">
                <span className="float-icon">
                  <Layers3 size={17} />
                </span>
                <div>
                  <b>{en ? 'All in One Place' : 'এক জায়গায়'}</b>
                  <small>{en ? 'All Digital Services' : 'সব ডিজিটাল সেবা'}</small>
                </div>
              </div>

              <div className="float-card float-card-bottom">
                <span className="float-icon green">
                  <Zap size={17} />
                </span>
                <div>
                  <b>{en ? 'Work Made Easy' : 'কাজ হবে সহজ'}</b>
                  <small>
                    {en ? 'Fast · Reliable · Modern' : 'দ্রুত · নির্ভরযোগ্য · আধুনিক'}
                  </small>
                </div>
              </div>

              <div className="hero-stamp">
                <Sparkles size={20} />
                <span>
                  {en ? 'From' : 'আইডিয়া'}
                  <br />
                  {en ? 'Idea' : 'থেকে'}
                  <br />
                  {en ? 'To Reality' : 'বাস্তবতা'}
                </span>
              </div>
            </div>
          </div>

          <div className="hero-scroll container">
            <span>
              {en ? 'Scroll down to explore more' : 'আরও সেবা দেখতে নিচে যান'}
            </span>
            <div />
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip">
          <div className="container trust-inner">
            <span>
              {en
                ? 'A reliable team for your digital journey'
                : 'আপনার ডিজিটাল যাত্রায় একটি নির্ভরযোগ্য টিম'}
            </span>

            <div>
              <b>{en ? 'Websites' : 'ওয়েবসাইট'}</b>
              <i />
              <b>{en ? 'Software' : 'সফটওয়্যার'}</b>
              <i />
              <b>{en ? 'Design' : 'ডিজাইন'}</b>
              <i />
              <b>{en ? 'AI' : 'এআই'}</b>
              <i />
              <b>{en ? 'Marketing' : 'মার্কেটিং'}</b>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {en ? 'OUR SERVICES' : 'আমাদের সেবাসমূহ'}
                </span>

                <h2>
                  {en ? 'Everything You Need' : 'আপনার প্রয়োজনীয় সবকিছু'}
                  <br />
                  <em>{en ? 'In One Place.' : 'এক জায়গায়।'}</em>
                </h2>
              </div>

              <div className="section-aside">
                <p>
                  {en
                    ? 'What would you like to build? Choose a service from the categories below and send a booking request.'
                    : 'আপনি কী তৈরি করতে চান? নিচের ক্যাটাগরি থেকে আপনার প্রয়োজনীয় সেবা বেছে নিন। প্রতিটি সেবার বিস্তারিত দেখে সরাসরি বুকিং অনুরোধ পাঠাতে পারবেন।'}
                </p>

                <Link href="/services" className="text-link">
                  {en ? 'Explore All Services' : 'সব সেবা দেখুন'}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="services-grid">
              {services.map((s, i) => (
                <ServiceCard key={s.slug} service={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* OUR WORK SECTION */}
        <section className="section work-section" id="work">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {en ? 'OUR WORK' : 'নমুনা কাজ'}
                </span>

                <h2>
                  {en ? 'Explore Some of' : 'কাজের কিছু উদাহরণ'}
                  <br />
                  <em>{en ? 'Our Projects.' : 'দেখে নিন।'}</em>
                </h2>
              </div>

              <div className="section-aside">
                <p>
                  {en
                    ? 'Explore our demo designs and projects to find the style that fits your needs.'
                    : 'আমাদের ডেমো ডিজাইন ও প্রজেক্ট দেখে আপনার পছন্দের কাজের ধরন বেছে নিতে পারবেন।'}
                </p>

                <Link href="/work" className="text-link">
                  {en ? 'View All Projects' : 'সব নমুনা কাজ দেখুন'}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="work-grid">
              {demos
                .filter((d) => d.featured)
                .slice(0, 4)
                .map((d) => (
                  <DemoCard key={d.slug} demo={d} />
                ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="section testimonials-section" id="testimonials">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {en ? 'CLIENT FEEDBACK' : 'ক্লায়েন্টদের মতামত'}
                </span>

                <h2>
                  {en ? 'What They Say' : 'আমাদের কাজ নিয়ে'}
                  <br />
                  <em>{en ? 'About Their Experience.' : 'তাদের অভিজ্ঞতা।'}</em>
                </h2>
              </div>

              <div className="section-aside">
                <p>
                  {en
                    ? 'Experiences and feedback about our services.'
                    : 'আমাদের সেবা সম্পর্কে ক্লায়েন্টদের অভিজ্ঞতা ও মতামত।'}
                </p>
              </div>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((review) => (
                <article className="testimonial-card" key={review.name}>
                  <div className="testimonial-top">
                    <span className="testimonial-quote">“</span>
                    <span className="testimonial-stars">★★★★★</span>
                  </div>

                  <p className="testimonial-content">{review.review}</p>

                  <div className="testimonial-client">
                    <div className={`testimonial-avatar ${review.color}`}>
                      {review.initial}
                    </div>

                    <div>
                      <h3>{review.name}</h3>
                      <span>{review.role}</span>
                    </div>

                    <div className="testimonial-check">✓</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="manifesto" id="about">
          <div className="container manifesto-grid">
            <div className="manifesto-art">
              <div className="manifesto-ring ring-a" />
              <div className="manifesto-ring ring-b" />

              <div className="manifesto-core">
                <Sparkles size={35} />
                <span>
                  {en ? 'Your' : 'আপনার'}
                  <br />
                  {en ? 'Ideas' : 'আইডিয়া'}
                  <br />
                  {en ? 'Our Reality' : 'বাস্তব করি'}
                </span>
              </div>

              <div className="manifesto-note note-a">
                {en ? 'Plan First.' : 'পরিকল্পনা আগে।'}
              </div>

              <div className="manifesto-note note-b">
                {en ? 'Quality Always.' : 'মান সবসময়।'}
              </div>
            </div>

            <div className="manifesto-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" />
                {en ? 'WHY NOVALOOM' : 'কেন NovaLoom'}
              </span>

              <h2>
                {en ? 'Technology Should' : 'প্রযুক্তি হোক'}
                <br />
                {en ? 'Make Your Work' : 'আপনার কাজের'}{' '}
                <em>{en ? 'Easier.' : 'সহজ সমাধান।'}</em>
              </h2>

              <p>
                {en
                  ? 'We first understand your needs, then create a suitable plan and build user-friendly digital solutions.'
                  : 'আমরা প্রথমে আপনার প্রয়োজন বুঝি, তারপর উপযুক্ত পরিকল্পনা করি এবং ব্যবহারবান্ধব ডিজিটাল সমাধান তৈরি করি।'}
              </p>

              <div className="value-list">
                <div>
                  <CheckCircle2 />
                  <span>
                    <b>{en ? 'A Skilled Team' : 'একটি দক্ষ টিম'}</b>
                    <small>
                      {en
                        ? 'Planning, design, and development — all in one place.'
                        : 'পরিকল্পনা, ডিজাইন ও ডেভেলপমেন্ট—সব এক জায়গায়।'}
                    </small>
                  </span>
                </div>

                <div>
                  <CheckCircle2 />
                  <span>
                    <b>{en ? 'Tailored to Your Needs' : 'আপনার প্রয়োজন অনুযায়ী'}</b>
                    <small>
                      {en
                        ? 'A customized plan and solution for every project.'
                        : 'প্রতিটি কাজের জন্য আলাদা পরিকল্পনা ও কাস্টম সমাধান।'}
                    </small>
                  </span>
                </div>

                <div>
                  <CheckCircle2 />
                  <span>
                    <b>{en ? 'Transparent Communication' : 'স্বচ্ছ যোগাযোগ'}</b>
                    <small>
                      {en
                        ? 'Clear updates about progress and next steps.'
                        : 'কাজের অগ্রগতি ও পরবর্তী ধাপ সম্পর্কে পরিষ্কার ধারণা।'}
                    </small>
                  </span>
                </div>
              </div>

              <Link href="/contact" className="text-link">
                {en ? 'Get in Touch' : 'আমাদের সঙ্গে যোগাযোগ করুন'}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION - ONLY FOUR WORK STEPS */}
        <section className="section process-section" id="process">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {en ? 'OUR PROCESS' : 'কাজের ধাপ'}
                </span>

                <h2>
                  {en ? 'From Idea to Reality' : 'আইডিয়া থেকে বাস্তবায়ন'}
                  <br />
                  <em>
                    {en ? 'Every Step, Planned.' : 'পরিকল্পিত প্রতিটি ধাপে।'}
                  </em>
                </h2>
              </div>

              <p className="process-intro">
                {en
                  ? 'We complete every project step by step, keeping your goals in focus.'
                  : 'আপনার লক্ষ্যকে গুরুত্ব দিয়ে ধাপে ধাপে কাজ সম্পন্ন করি।'}
              </p>
            </div>

            <div className="process-grid">
              {steps.map(([number, title, description]) => (
                <div className="process-step" key={number}>
                  <span>{number}</span>
                  <div className="process-line" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-band">
          <div className="container cta-inner">
            <div>
              <span className="eyebrow">
                {en ? 'START YOUR NEXT JOURNEY' : 'আপনার নতুন যাত্রা শুরু হোক'}
              </span>

              <h2>
                {en ? 'Do You Have a' : 'আপনার কি কোনো'}
                <br />
                <em>
                  {en ? 'Project in Mind?' : 'প্রজেক্টের পরিকল্পনা আছে?'}
                </em>
              </h2>
            </div>

            <div>
              <p>
                {en
                  ? 'Tell us what you need. We will help you find the right way to bring your idea to life.'
                  : 'আপনার প্রয়োজনটি আমাদের জানান। কীভাবে বাস্তবায়ন করা যায়, আমরা আপনাকে সাহায্য করব।'}
              </p>

              <Link href="/request" className="button button-light">
                {en ? 'Get Started' : 'সেবা বুক করুন'}
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="cta-spark">
              <Sparkles size={54} />
            </div>
          </div>
        </section>
      </main>

      <WhatsApp />
    </SiteShell>
  );
}
