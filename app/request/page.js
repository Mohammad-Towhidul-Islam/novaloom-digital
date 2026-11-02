
'use client';

import { useEffect, useState } from 'react';
import SiteShell from '@/components/site-shell';
import { services } from '@/lib/catalog';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const options = [
  'ইউজার রেজিস্ট্রেশন ও লগইন',
  'অ্যাডমিন ড্যাশবোর্ড',
  'কাস্টমার ড্যাশবোর্ড',
  'পেমেন্ট সিস্টেম',
  'পণ্য বা কনটেন্ট ব্যবস্থাপনা',
  'বুকিং সিস্টেম',
  'সার্চ ও ফিল্টার',
  'ডেটাবেস ব্যবস্থাপনা',
  'এপিআই সংযুক্তকরণ',
  'নোটিফিকেশন',
  'এআই ফিচার',
  'অন্যান্য কাস্টম ফিচার',
];

export default function RequestPage() {
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

  function validateStep() {
    setError('');

    if (step === 1) {
      if (!form.serviceSlugs.length) {
        setError('অনুগ্রহ করে অন্তত একটি সেবা নির্বাচন করুন।');
        return false;
      }
    }

    if (step === 2) {
      if (form.title.trim().length < 2) {
        setError('প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।');
        return false;
      }

      if (form.description.trim().length < 10) {
        setError('কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।');
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
      setError('আপনার পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে।');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setStep(3);
      setError('সঠিক ইমেইল ঠিকানা লিখুন।');
      return;
    }

    if (!payload.serviceSlugs.length) {
      setStep(1);
      setError('অন্তত একটি সেবা নির্বাচন করুন।');
      return;
    }

    if (payload.title.length < 2) {
      setStep(2);
      setError('প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।');
      return;
    }

    if (payload.description.length < 10) {
      setStep(2);
      setError('কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।');
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
            ['title', 'description', 'referenceUrl'].includes(firstInvalidField)
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
          details || data.error || 'অনুরোধ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।'
        );
      }

      setDone(data.requestCode);
    } catch (err) {
      console.error('Request submission failed:', err);
      setError(err.message || 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setBusy(false);
    }
  }

  const fieldError = (field) => {
    const messages = fieldErrors[field];
    return Array.isArray(messages) ? messages[0] : '';
  };

  return (
    <SiteShell>
      <main className="form-page">
        <div className="form-container">
          <div className="form-intro">
            <span className="eyebrow">
              <span className="eyebrow-line" />
              আপনার সেবার অনুরোধ পাঠান
            </span>

            <h1>
              আপনার আইডিয়াকে
              <br />
              <em>বাস্তব রূপ দিই।</em>
            </h1>

            <p>
              আপনার কী ধরনের কাজ প্রয়োজন, সংক্ষেপে জানান।
              আমরা অনুরোধটি পর্যালোচনা করে যোগাযোগ করব।
            </p>

            <div className="form-promise">
              <CheckCircle2 />
              এখানে নির্দিষ্ট প্যাকেজ মূল্য নেই।
              কাজের ধরন বুঝে আলোচনা করে কাস্টম মূল্য জানানো হবে।
            </div>
          </div>

          <div className="request-card">
            {done ? (
              <div className="success-state">
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <span className="eyebrow">
                  অনুরোধ গ্রহণ করা হয়েছে
                </span>

                <h2>
                  ধন্যবাদ।
                  <em> আমরা আপনার অনুরোধটি দেখছি।</em>
                </h2>

                <p>
                  আপনার অনুরোধ নম্বর:
                  <b> {done}</b>
                </p>

                <a
                  className="button"
                  href={`https://wa.me/${(
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
                    '8801XXXXXXXXX'
                  ).replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello, I submitted project request ${done}. I'd like to discuss it.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp-এ কথা বলুন
                </a>
              </div>
            ) : (
              <>
                <div className="step-head">
                  <div>
                    <span className="eyebrow">কাজের বিবরণ</span>
                    <h2>কাজের বিস্তারিত জানি</h2>
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
                  {step === 1 && (
                    <div className="form-step">
                      <label>
                        আপনার কী ধরনের সেবা প্রয়োজন?
                        <small>এক বা একাধিক বেছে নিন</small>
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
                            {service.title}

                            {form.serviceSlugs.includes(service.slug) && (
                              <CheckCircle2 size={16} />
                            )}
                          </button>
                        ))}
                      </div>

                      <label>
                        কাজের ধরন <span>(optional)</span>

                        <input
                          value={form.projectType}
                          onChange={(e) =>
                            update('projectType', e.target.value)
                          }
                          placeholder="যেমন: ব্যবসায়িক ওয়েবসাইট..."
                        />
                      </label>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="form-step">
                      <label>
                        কী কী ফিচার প্রয়োজন?
                        <small>প্রযোজ্য সবগুলো বেছে নিন</small>
                      </label>

                      <div className="feature-options">
                        {options.map((option) => (
                          <button
                            type="button"
                            key={option}
                            className={
                              form.features.includes(option)
                                ? 'feature-option selected'
                                : 'feature-option'
                            }
                            onClick={() => toggle('features', option)}
                          >
                            {form.features.includes(option) ? '✓' : '+'}
                            {' '}{option}
                          </button>
                        ))}
                      </div>

                      <label>
                        প্রজেক্টের নাম

                        <input
                          required
                          minLength={2}
                          value={form.title}
                          onChange={(e) =>
                            update('title', e.target.value)
                          }
                          placeholder="যেমন: Business Website"
                        />

                        {fieldError('title') && (
                          <small style={{ color: '#b42318' }}>
                            {fieldError('title')}
                          </small>
                        )}
                      </label>

                      <label>
                        আপনার কাজের বিস্তারিত লিখুন

                        <textarea
                          required
                          minLength={10}
                          rows="4"
                          value={form.description}
                          onChange={(e) =>
                            update('description', e.target.value)
                          }
                          placeholder="আপনার লক্ষ্য, ব্যবহারকারী, প্রয়োজনীয় ফিচার ও অন্যান্য তথ্য লিখুন..."
                        />

                        <small>
                          কমপক্ষে ১০টি অক্ষর লিখুন।
                          বর্তমান অক্ষর: {form.description.trim().length}
                        </small>

                        {fieldError('description') && (
                          <small style={{ color: '#b42318' }}>
                            {fieldError('description')}
                          </small>
                        )}
                      </label>

                      <label>
                        উদাহরণ ওয়েবসাইট <span>(optional)</span>

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

                  {step === 3 && (
                    <div className="form-step">
                      <label>আপনার যোগাযোগের তথ্য</label>

                      <div className="two-fields">
                        <label>
                          আপনার পুরো নাম

                          <input
                            required
                            minLength={2}
                            value={form.clientName}
                            onChange={(e) =>
                              update('clientName', e.target.value)
                            }
                            placeholder="আপনার নাম"
                          />

                          {fieldError('clientName') && (
                            <small style={{ color: '#b42318' }}>
                              {fieldError('clientName')}
                            </small>
                          )}
                        </label>

                        <label>
                          ইমেইল ঠিকানা

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
                          ফোন / WhatsApp

                          <input
                            value={form.phone}
                            onChange={(e) =>
                              update('phone', e.target.value)
                            }
                            placeholder="+880..."
                          />
                        </label>

                        <label>
                          প্রতিষ্ঠানের নাম <span>(optional)</span>

                          <input
                            value={form.businessName}
                            onChange={(e) =>
                              update('businessName', e.target.value)
                            }
                            placeholder="আপনার প্রতিষ্ঠানের নাম"
                          />
                        </label>
                      </div>

                      <div className="two-fields">
                        <label>
                          কাজ শেষের সম্ভাব্য সময়
                          <span>(optional)</span>

                          <input
                            value={form.deadline}
                            onChange={(e) =>
                              update('deadline', e.target.value)
                            }
                            placeholder="যেমন: ২ মাসের মধ্যে"
                          />
                        </label>

                        <label>
                          যোগাযোগের পছন্দের মাধ্যম

                          <select
                            value={form.communication}
                            onChange={(e) =>
                              update('communication', e.target.value)
                            }
                          >
                            <option>WhatsApp</option>
                            <option>Email</option>
                            <option>Phone</option>
                            <option>অনলাইন মিটিং</option>
                          </select>
                        </label>
                      </div>

                      <p className="privacy-note">
                        এই তথ্য শুধু আপনার অনুরোধের বিষয়ে যোগাযোগের
                        জন্য ব্যবহার করা হবে। এখনই বাজেট দেওয়ার
                        প্রয়োজন নেই।
                      </p>
                    </div>
                  )}

                  <div className="form-nav">
                    {step > 1 && (
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={previousStep}
                        disabled={busy}
                      >
                        <ArrowLeft size={16} />
                        পেছনে যান
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
                        পরবর্তী ধাপ
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="button"
                        disabled={busy}
                      >
                        {busy
                          ? 'জমা দেওয়া হচ্ছে...'
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
