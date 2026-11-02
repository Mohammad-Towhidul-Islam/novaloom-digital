import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
const schema=z.object({clientName:z.string().min(2),email:z.string().email(),phone:z.string().optional(),businessName:z.string().optional(),serviceSlugs:z.array(z.string()).min(1),projectType:z.string().optional(),features:z.array(z.string()).default([]),title:z.string().min(2),description:z.string().min(10),referenceUrl:z.string().optional(),deadline:z.string().optional(),communication:z.string().optional()});
export async function POST(req){try{const body=schema.parse(await req.json());const session=await getSession();const requestCode=`NL-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;const saved=await prisma.projectRequest.create({data:{...body,requestCode,userId:session?.sub||null}});await sendEmail({to:process.env.ADMIN_EMAIL,subject:`New project request ${saved.requestCode}`,html:`<p>New request from ${body.clientName}</p><p>${body.title}</p><p>${body.description}</p>`});await sendEmail({to:body.email,subject:`We received your NovaLoom request ${saved.requestCode}`,html:`<p>Hello ${body.clientName},</p><p>We received your project request. Our team will review it and contact you soon.</p><p>Reference: ${saved.requestCode}</p>`});return NextResponse.json({ok:true,requestCode:saved.requestCode},{status:201});}catch(e){return NextResponse.json({error:e.issues?.[0]?.message||'Invalid request. Please check the form and try again.'},{status:400});}}

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// Request validation schema
const schema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, 'আপনার নাম কমপক্ষে ২ অক্ষরের হতে হবে।'),

  email: z
    .string()
    .trim()
    .email('সঠিক ইমেইল ঠিকানা লিখুন।'),

  phone: z.string().optional(),

  businessName: z.string().optional(),

  serviceSlugs: z
    .array(z.string())
    .min(1, 'অন্তত একটি সেবা নির্বাচন করুন।'),

  projectType: z.string().optional(),

  features: z.array(z.string()).default([]),

  title: z
    .string()
    .trim()
    .min(2, 'প্রজেক্টের নাম কমপক্ষে ২ অক্ষরের হতে হবে।'),

  description: z
    .string()
    .trim()
    .min(10, 'কাজের বিস্তারিত কমপক্ষে ১০ অক্ষরে লিখুন।'),

  referenceUrl: z.string().optional(),

  deadline: z.string().optional(),

  communication: z.string().optional(),
});

export async function POST(req) {
  try {
    // 1. Read request body
    const body = await req.json();

    // 2. Validate submitted data
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.issues[0]?.message ||
            'আপনার দেওয়া তথ্য সঠিক নয়।',
          fieldErrors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. Get logged-in user session
    const session = await getSession();

    // 4. Generate unique request code
    const requestCode = `NL-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // 5. Save project request to database
    const saved = await prisma.projectRequest.create({
      data: {
        ...data,
        requestCode,
        userId: session?.sub || null,
      },
    });

    // 6. Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New project request ${saved.requestCode}`,
          html: `
            <h2>New NovaLoom Project Request</h2>
            <p><strong>Request ID:</strong> ${saved.requestCode}</p>
            <p><strong>Client:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Project:</strong> ${data.title}</p>
            <p><strong>Description:</strong> ${data.description}</p>
          `,
        });
      } catch (emailError) {
        console.error('Admin notification email failed:', emailError);
      }
    }

    // 7. Send confirmation email to client
    try {
      await sendEmail({
        to: data.email,
        subject: `We received your NovaLoom request ${saved.requestCode}`,
        html: `
          <h2>Thank you for contacting NovaLoom Digital Solutions!</h2>
          <p>Hello ${data.clientName},</p>
          <p>We have successfully received your project request.</p>
          <p>Our team will review your request and contact you soon.</p>
          <p><strong>Reference Number:</strong> ${saved.requestCode}</p>
          <p>Thank you for choosing NovaLoom Digital Solutions.</p>
        `,
      });
    } catch (emailError) {
      console.error('Client confirmation email failed:', emailError);
    }

    // 8. Return success response
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

    // Invalid JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'সঠিক Request Data পাঠানো হয়নি।' },
        { status: 400 }
      );
    }

    // Database or server error
    return NextResponse.json(
      {
        error: 'দুঃখিত, আপনার অনুরোধ জমা দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      },
      { status: 500 }
    );
  }
}
