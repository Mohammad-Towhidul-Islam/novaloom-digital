
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

const schema = z.object({
  clientName: z.string().trim().min(2, 'আপনার নাম কমপক্ষে ২ অক্ষরের হতে হবে।'),
  email: z.string().trim().email('সঠিক ইমেইল ঠিকানা লিখুন।'),
  phone: z.string().optional().default(''),
  businessName: z.string().optional().default(''),

  serviceSlugs: z
    .array(z.string().min(1))
    .min(1, 'অন্তত একটি সেবা নির্বাচন করুন।'),

  projectType: z.string().optional().default(''),
  features: z.array(z.string()).default([]),

  title: z.string().trim().min(2, 'প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।'),

  description: z
    .string()
    .trim()
    .min(10, 'কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।'),

  referenceUrl: z.string().optional().default(''),
  deadline: z.string().optional().default(''),
  communication: z.string().optional().default('WhatsApp'),
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate form data
    const validation = schema.safeParse(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      console.error('Request validation failed:', fieldErrors);

      return NextResponse.json(
        {
          ok: false,
          error: validation.error.issues[0]?.message || 'তথ্য সঠিক নয়।',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify selected services against the database
    const validServices = await prisma.serviceCategory.findMany({
      where: {
        slug: { in: data.serviceSlugs },
      },
      select: {
        slug: true,
      },
    });

    const validSlugs = validServices.map((service) => service.slug);
    const invalidSlugs = data.serviceSlugs.filter(
      (slug) => !validSlugs.includes(slug)
    );

    if (invalidSlugs.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'নির্বাচিত সেবার তথ্য পাওয়া যায়নি। আবার সেবা নির্বাচন করুন।',
          fieldErrors: {
            serviceSlugs: ['এক বা একাধিক নির্বাচিত সেবা ডেটাবেসে নেই।'],
          },
        },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getSession();

    const requestCode = `NL-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // Save request
    const saved = await prisma.projectRequest.create({
      data: {
        ...data,
        requestCode,
        userId: session?.sub || null,
      },
    });

    // Admin notification
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New project request ${saved.requestCode}`,
          html: `
            <h2>New NovaLoom Project Request</h2>
            <p>Request ID: ${saved.requestCode}</p>
            <p>Client: ${data.clientName}</p>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone || 'Not provided'}</p>
            <p>Project: ${data.title}</p>
            <p>Description: ${data.description}</p>
          `,
        });
      } catch (error) {
        console.error('Admin email failed:', error);
      }
    }

    // Client confirmation
    try {
      await sendEmail({
        to: data.email,
        subject: `We received your NovaLoom request ${saved.requestCode}`,
        html: `
          <h2>Thank you for contacting NovaLoom Digital Solutions!</h2>
          <p>Hello ${data.clientName},</p>
          <p>Your project request has been received successfully.</p>
          <p>Reference Number: ${saved.requestCode}</p>
        `,
      });
    } catch (error) {
      console.error('Client email failed:', error);
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'আপনার প্রজেক্ট অনুরোধ সফলভাবে জমা হয়েছে।',
        requestCode: saved.requestCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Project request API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, error: 'সঠিক Request Data পাঠানো হয়নি।' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Server বা Database সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।',
      },
      { status: 500 }
    );
  }
}
