
'use client';

import { useEffect, useState } from 'react';
import SiteShell from '@/components/site-shell';
import { useSite } from '@/components/site-provider';
import { services } from '@/lib/catalog';

import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const options = [
  { value: 'ইউজার রেজিস্ট্রেশন ও লগইন', en: 'User Registration & Login' },
  { value: 'অ্যাডমিন ড্যাশবোর্ড', en: 'Admin Dashboard' },
  { value: 'কাস্টমার ড্যাশবোর্ড', en: 'Customer Dashboard' },
  { value: 'পেমেন্ট সিস্টেম', en: 'Payment System' },
  { value: 'পণ্য বা কনটেন্ট ব্যবস্থাপনা', en: 'Product & Content Management' },
  { value: 'বুকিং সিস্টেম', en: 'Booking System' },
  { value: 'সার্চ ও ফিল্টার', en: 'Search & Filter' },
  { value: 'ডেটাবেস ব্যবস্থাপনা', en: 'Database Management' },
  { value: 'এপিআই সংযুক্তকরণ', en: 'API Integration' },
  { value: 'নোটিফিকেশন', en: 'Notifications' },
  { value: 'এআই ফিচার', en: 'AI Features' },
  { value: 'অন্যান্য কাস্টম ফিচার', en: 'Other Custom Features' },
];

export default function RequestPage() {
  const { lang } = useSite();
  const en = lang === 'en';

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceSlugs: [],
    projectType: '',
    features: [],
    title: '',
    description: '',
    referenceUrl: '',
    deadline: '',
    communication: 'WhatsApp',
  });

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('service');

    if (slug && services.some((service) => service.slug === slug)) {
      setForm((previous) => ({
        ...previous,
        serviceSlugs: [slug],
      }));
    }
  }, []);

  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError('');

    setFieldErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  const toggle = (key, value) => {
    update(
      key,
      form[key].includes(value)
        ? form[key].filter((item) => item !== value)
        : [...form[key], value]
    );
  };

  const fieldError = (field) => {
    const messages = fieldErrors[field];
    return Array.isArray(messages) ? messages[0] : '';
  };

  function validateStep() {
    setError('');

    if (step === 1 && !form.serviceSlugs.length) {
      setError(
        en
          ? 'Please select at least one service.'
          : 'অনুগ্রহ করে অন্তত একটি সেবা নির্বাচন করুন।'
      );
      return false;
    }

    if (step === 2) {
      if (form.title.trim().length < 2) {
        setError(
          en
            ? 'Project name must contain at least 2 characters.'
            : 'প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।'
        );
        return false;
      }

      if (form.description.trim().length < 10) {
        setError(
          en
            ? 'Please describe your project in at least 10 characters.'
            : 'কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।'
        );
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep((previous) => previous + 1);
  }

  function previousStep() {
    setError('');
    setFieldErrors({});
    setStep((previous) => previous - 1);
  }

  async function submit(e) {
    e.preventDefault();

    if (busy) return;

    const payload = {
      ...form,
      clientName: form.clientName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      businessName: form.businessName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      referenceUrl: form.referenceUrl.trim(),
      deadline: form.deadline.trim(),
      serviceSlugs: form.serviceSlugs,
      features: form.features,
    };

    // Frontend validation
    if (payload.clientName.length < 2) {
      setStep(3);
      setError(
        en
          ? 'Your full name must contain at least 2 characters.'
          : 'আপনার পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে।'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setStep(3);
      setError(
        en
          ? 'Please enter a valid email address.'
          : 'সঠিক ইমেইল ঠিকানা লিখুন।'
      );
      return;
    }

    if (!payload.serviceSlugs.length) {
      setStep(1);
      setError(
        en
          ? 'Please select at least one service.'
          : 'অন্তত একটি সেবা নির্বাচন করুন।'
      );
      return;
    }

    if (payload.title.length < 2) {
      setStep(2);
      setError(
        en
          ? 'Project name must contain at least 2 characters.'
          : 'প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।'
      );
      return;
    }

    if (payload.description.length < 10) {
      setStep(2);
      setError(
        en
          ? 'Project description must contain at least 10 characters.'
          : 'কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।'
      );
      return;
    }

    setBusy(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Validation Error:', {
          status: response.status,
          error: data.error,
          fieldErrors: data.fieldErrors,
          submittedData: payload,
        });

        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);

          const firstInvalidField = Object.keys(data.fieldErrors)[0];

          if (
            ['title', 'description', 'referenceUrl'].includes(
              firstInvalidField
            )
          ) {
            setStep(2);
          } else if (
            ['clientName', 'email', 'phone', 'businessName'].includes(
              firstInvalidField
            )
          ) {
            setStep(3);
          } else if (
            ['serviceSlugs', 'features', 'projectType'].includes(
              firstInvalidField
            )
          ) {
            setStep(1);
          }
        }

        const details = data.fieldErrors
          ? Object.entries(data.fieldErrors)
              .filter(([, messages]) => Array.isArray(messages))
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n')
          : '';

        throw new Error(
          details ||
            (en
              ? 'Unable to submit your request. Please try again.'
              : data.error || 'অনুরোধ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।')
        );
      }

      setDone(data.requestCode);
    } catch (err) {
      console.error('Request submission failed:', err);

      setError(
        err.message ||
          (en
            ? 'Something went wrong. Please try again.'
            : 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।')
      );
    } finally {
      setBusy(false);
    }
  }

  const whatsappNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801XXXXXXXXX'
  ).replace(/\D/g, '');

  return (
    <SiteShell>
      <main className="form-page">
        <div className="form-container">

          {/* LEFT INTRO */}
          <div className="form-intro">
            <span className="eyebrow">
              <span className="eyebrow-line" />
              {en ? 'SEND YOUR PROJECT REQUEST' : 'আপনার সেবার অনুরোধ পাঠান'}
            </span>

            <h1>
              {en ? 'Your Ideas' : 'আপনার আইডিয়াকে'}
              <br />
              <em>
                {en ? 'Into Reality.' : 'বাস্তব রূপ দিই।'}
              </em>
            </h1>

            <p>
              {en
                ? 'Tell us briefly what kind of work you need. We will review your request and get in touch with you.'
                : 'আপনার কী ধরনের কাজ প্রয়োজন, সংক্ষেপে জানান। আমরা অনুরোধটি পর্যালোচনা করে যোগাযোগ করব।'}
            </p>

            <div className="form-promise">
              <CheckCircle2 />
              {en
                ? 'No fixed package pricing. We will discuss your requirements and provide a customized quotation.'
                : 'এখানে নির্দিষ্ট প্যাকেজ মূল্য নেই। কাজের ধরন বুঝে আলোচনা করে কাস্টম মূল্য জানানো হবে।'}
            </div>
          </div>

          {/* FORM CARD */}
          <div className="request-card">

            {/* SUCCESS SCREEN */}
            {done ? (
              <div className="success-state">
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <span className="eyebrow">
                  {en ? 'REQUEST RECEIVED' : 'অনুরোধ গ্রহণ করা হয়েছে'}
                </span>

                <h2>
                  {en ? 'Thank You.' : 'ধন্যবাদ।'}
                  <em>
                    {en
                      ? ' We are reviewing your request.'
                      : ' আমরা আপনার অনুরোধটি দেখছি।'}
                  </em>
                </h2>

                <p>
                  {en ? 'Your Request Number:' : 'আপনার অনুরোধ নম্বর:'}
                  <b> {done}</b>
                </p>

                <a
                  className="button"
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    en
                      ? `Hello, I submitted project request ${done}. I'd like to discuss it.`
                      : `হ্যালো, আমি ${done} নম্বর প্রজেক্ট অনুরোধ জমা দিয়েছি। এ বিষয়ে আলোচনা করতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {en ? 'Contact Us on WhatsApp' : 'WhatsApp-এ কথা বলুন'}
                  <ArrowRight size={16} />
                </a>
              </div>
            ) : (
              <>
                {/* STEP HEADER */}
                <div className="step-head">
                  <div>
                    <span className="eyebrow">
                      {en ? 'PROJECT DETAILS' : 'কাজের বিবরণ'}
                    </span>

                    <h2>
                      {en ? 'Tell Us About Your Project' : 'কাজের বিস্তারিত জানি'}
                    </h2>
                  </div>

                  <span className="step-count">
                    0{step} <i>/ 03</i>
                  </span>
                </div>

                <div className="step-progress">
                  <span
                    style={{
                      width: `${step * 33.333}%`,
                    }}
                  />
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div
                    role="alert"
                    style={{
                      background: '#fff1f0',
                      color: '#b42318',
                      padding: '13px 16px',
                      borderRadius: '10px',
                      margin: '18px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <AlertCircle size={19} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={submit}>

                  {/* STEP 1: SERVICES */}
                  {step === 1 && (
                    <div className="form-step">
                      <label>
                        {en
                          ? 'What Services Do You Need?'
                          : 'আপনার কী ধরনের সেবা প্রয়োজন?'}

                        <small>
                          {en
                            ? 'Select one or more services'
                            : 'এক বা একাধিক বেছে নিন'}
                        </small>
                      </label>

                      <div className="service-select-grid">
                        {services.map((service) => (
                          <button
                            type="button"
                            key={service.slug}
                            className={
                              form.serviceSlugs.includes(service.slug)
                                ? 'service-option selected'
                                : 'service-option'
                            }
                            onClick={() =>
                              toggle('serviceSlugs', service.slug)
                            }
                          >
                            <span>{service.number}</span>

                            {en
                              ? service.titleEn || service.title
                              : service.title}

                            {form.serviceSlugs.includes(service.slug) && (
                              <CheckCircle2 size={16} />
                            )}
                          </button>
                        ))}
                      </div>

                      <label>
                        {en ? 'Project Type' : 'কাজের ধরন'}
                        <span> ({en ? 'optional' : 'ঐচ্ছিক'})</span>

                        <input
                          value={form.projectType}
                          onChange={(e) =>
                            update('projectType', e.target.value)
                          }
                          placeholder={
                            en
                              ? 'e.g. Business Website...'
                              : 'যেমন: ব্যবসায়িক ওয়েবসাইট...'
                          }
                        />
                      </label>
                    </div>
                  )}

                  {/* STEP 2: FEATURES */}
                  {step === 2 && (
                    <div className="form-step">
                      <label>
                        {en ? 'What Features Do You Need?' : 'কী কী ফিচার প্রয়োজন?'}

                        <small>
                          {en
                            ? 'Select all that apply'
                            : 'প্রযোজ্য সবগুলো বেছে নিন'}
                        </small>
                      </label>

                      <div className="feature-options">
                        {options.map((option) => (
                          <button
                            type="button"
                            key={option.value}
                            className={
                              form.features.includes(option.value)
                                ? 'feature-option selected'
                                : 'feature-option'
                            }
                            onClick={() =>
                              toggle('features', option.value)
                            }
                          >
                            {form.features.includes(option.value) ? '✓' : '+'}
                            {' '}
                            {en ? option.en : option.value}
                          </button>
                        ))}
                      </div>

                      <label>
                        {en ? 'Project Name' : 'প্রজেক্টের নাম'}

                        <input
                          required
                          minLength={2}
                          value={form.title}
                          onChange={(e) =>
                            update('title', e.target.value)
                          }
                          placeholder={
                            en
                              ? 'e.g. Business Website'
                              : 'যেমন: Business Website'
                          }
                        />

                        {fieldError('title') && (
                          <small style={{ color: '#b42318' }}>
                            {fieldError('title')}
                          </small>
                        )}
                      </label>

                      <label>
                        {en
                          ? 'Describe Your Project'
                          : 'আপনার কাজের বিস্তারিত লিখুন'}

                        <textarea
                          required
                          minLength={10}
                          rows="4"
                          value={form.description}
                          onChange={(e) =>
                            update('description', e.target.value)
                          }
                          placeholder={
                            en
                              ? 'Describe your goals, users, required features, and other details...'
                              : 'আপনার লক্ষ্য, ব্যবহারকারী, প্রয়োজনীয় ফিচার ও অন্যান্য তথ্য লিখুন...'
                          }
                        />

                        <small>
                          {en
                            ? 'Write at least 10 characters.'
                            : 'কমপক্ষে ১০টি অক্ষর লিখুন।'}
                          {' '}
                          {en ? 'Current characters:' : 'বর্তমান অক্ষর:'}
                          {' '}
                          {form.description.trim().length}
                        </small>

                        {fieldError('description') && (
                          <small style={{ color: '#b42318' }}>
                            {fieldError('description')}
                          </small>
                        )}
                      </label>

                      <label>
                        {en ? 'Reference Website' : 'উদাহরণ ওয়েবসাইট'}
                        <span> ({en ? 'optional' : 'ঐচ্ছিক'})</span>

                        <input
                          value={form.referenceUrl}
                          onChange={(e) =>
                            update('referenceUrl', e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </label>
                    </div>
                  )}

                  {/* STEP 3: CONTACT */}
                  {step === 3 && (
                    <div className="form-step">
                      <label>
                        {en
                          ? 'Your Contact Information'
                          : 'আপনার যোগাযোগের তথ্য'}
                      </label>

                      <div className="two-fields">
                        <label>
                          {en ? 'Full Name' : 'আপনার পুরো নাম'}

                          <input
                            required
                            minLength={2}
                            value={form.clientName}
                            onChange={(e) =>
                              update('clientName', e.target.value)
                            }
                            placeholder={
                              en ? 'Your full name' : 'আপনার নাম'
                            }
                          />

                          {fieldError('clientName') && (
                            <small style={{ color: '#b42318' }}>
                              {fieldError('clientName')}
                            </small>
                          )}
                        </label>

                        <label>
                          {en ? 'Email Address' : 'ইমেইল ঠিকানা'}

                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) =>
                              update('email', e.target.value)
                            }
                            placeholder="you@example.com"
                          />

                          {fieldError('email') && (
                            <small style={{ color: '#b42318' }}>
                              {fieldError('email')}
                            </small>
                          )}
                        </label>
                      </div>

                      <div className="two-fields">
                        <label>
                          {en ? 'Phone / WhatsApp' : 'ফোন / WhatsApp'}

                          <input
                            value={form.phone}
                            onChange={(e) =>
                              update('phone', e.target.value)
                            }
                            placeholder="+880..."
                          />
                        </label>

                        <label>
                          {en ? 'Company Name' : 'প্রতিষ্ঠানের নাম'}
                          <span> ({en ? 'optional' : 'ঐচ্ছিক'})</span>

                          <input
                            value={form.businessName}
                            onChange={(e) =>
                              update('businessName', e.target.value)
                            }
                            placeholder={
                              en
                                ? 'Your company name'
                                : 'আপনার প্রতিষ্ঠানের নাম'
                            }
                          />
                        </label>
                      </div>

                      <div className="two-fields">
                        <label>
                          {en
                            ? 'Expected Completion Time'
                            : 'কাজ শেষের সম্ভাব্য সময়'}

                          <span> ({en ? 'optional' : 'ঐচ্ছিক'})</span>

                          <input
                            value={form.deadline}
                            onChange={(e) =>
                              update('deadline', e.target.value)
                            }
                            placeholder={
                              en
                                ? 'e.g. Within 2 months'
                                : 'যেমন: ২ মাসের মধ্যে'
                            }
                          />
                        </label>

                        <label>
                          {en
                            ? 'Preferred Communication Method'
                            : 'যোগাযোগের পছন্দের মাধ্যম'}

                          <select
                            value={form.communication}
                            onChange={(e) =>
                              update('communication', e.target.value)
                            }
                          >
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                            <option value="Phone">
                              {en ? 'Phone' : 'ফোন'}
                            </option>
                            <option value="অনলাইন মিটিং">
                              {en ? 'Online Meeting' : 'অনলাইন মিটিং'}
                            </option>
                          </select>
                        </label>
                      </div>

                      <p className="privacy-note">
                        {en
                          ? 'Your information will only be used to contact you about your request. You do not need to provide a budget now.'
                          : 'এই তথ্য শুধু আপনার অনুরোধের বিষয়ে যোগাযোগের জন্য ব্যবহার করা হবে। এখনই বাজেট দেওয়ার প্রয়োজন নেই।'}
                      </p>
                    </div>
                  )}

                  {/* NAVIGATION BUTTONS */}
                  <div className="form-nav">
                    {step > 1 && (
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={previousStep}
                        disabled={busy}
                      >
                        <ArrowLeft size={16} />
                        {en ? 'Previous' : 'পেছনে যান'}
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        className="button"
                        onClick={nextStep}
                        disabled={
                          step === 1 &&
                          form.serviceSlugs.length === 0
                        }
                      >
                        {en ? 'Next Step' : 'পরবর্তী ধাপ'}
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="button"
                        disabled={busy}
                      >
                        {busy
                          ? en
                            ? 'Submitting...'
                            : 'জমা দেওয়া হচ্ছে...'
                          : en
                            ? 'Submit Request'
                            : 'অনুরোধ জমা দিন'}

                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
