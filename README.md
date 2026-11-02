# 🚀 NovaLoom Digital Solutions

> **আমাদের লাইভ ওয়েবসাইট:**  
> 🌐 [https://nova29.vercel.app/](https://nova29.vercel.app/)

**NovaLoom Digital Solutions** একটি আধুনিক ও পূর্ণাঙ্গ ডিজিটাল এজেন্সি ওয়েবসাইট। এটি Next.js 14, React, PostgreSQL এবং Prisma ব্যবহার করে তৈরি করা হয়েছে। ওয়েবসাইটটি সম্পূর্ণ Responsive এবং Mobile ও Desktop উভয় ডিভাইসের জন্য উপযোগী।

## 🌟 প্রজেক্ট পরিচিতি

NovaLoom Digital Solutions-এর মাধ্যমে গ্রাহকরা বিভিন্ন ধরনের ডিজিটাল সেবা দেখতে, প্রজেক্টের জন্য অনুরোধ পাঠাতে, কাস্টম কোটেশন গ্রহণ করতে এবং নিজেদের প্রজেক্টের অগ্রগতি পর্যবেক্ষণ করতে পারবেন।

এই প্রজেক্টে রয়েছে:

- আধুনিক ও Premium Homepage
- ১০টি ডিজিটাল সার্ভিস ক্যাটাগরি
- Concept-based Demo Project Gallery
- Multi-step Project Request Form
- WhatsApp যোগাযোগ ব্যবস্থা
- Client Registration ও Login
- Client Dashboard
- Invoice ও Payment Management
- Support Ticket ও Notification System
- Admin Dashboard
- Project ও Task Management
- Blog ও Journal Publishing
- SSLCommerz Payment Integration
- Protected API এবং Role-based Access Control

**বিশেষ দ্রষ্টব্য:** Demo Gallery-এর প্রজেক্টগুলো Concept Demonstration। এগুলোকে সম্পন্ন বাস্তব গ্রাহক প্রজেক্ট হিসেবে উপস্থাপন করা হয়নি। Public Pricing দেওয়া হয়নি; প্রতিটি গ্রাহকের জন্য আলাদাভাবে Custom Quotation তৈরি করা হয়।

## 🛠️ ব্যবহৃত প্রযুক্তি (Technology Stack)

| Technology | ব্যবহার |
|---|---|
| Next.js 14 | Full-stack Web Framework |
| React 18 | User Interface |
| JavaScript | Application Development |
| Tailwind CSS ও Custom CSS | Responsive Design |
| PostgreSQL | Database |
| Prisma ORM | Database Management |
| JWT ও JOSE | Authentication |
| bcryptjs | Password Hashing |
| Framer Motion | Animation |
| Lucide React | Icons |
| Vercel | Deployment |
| Neon | Cloud PostgreSQL Database |
| SSLCommerz | Online Payment Integration |

## 💻 System Requirements

প্রজেক্টটি চালানোর জন্য প্রয়োজন:

- Node.js 20 LTS
- npm
- PostgreSQL Database
- Git

Neon Cloud PostgreSQL ব্যবহার করা যাবে।

## ⚙️ Installation Guide

### ১. Repository Clone

```bash
git clone https://github.com/Mohammad-Towhidul-Islam/novaloom-digital.git
cd novaloom-digital
```

### ২. Dependencies Install

```bash
npm install
```

### ৩. Environment Configuration

প্রজেক্টের `.env.example` ফাইল কপি করে `.env` তৈরি করো।

```bash
cp .env.example .env
```

এরপর প্রয়োজনীয় Environment Variables সেট করো:

```env
DATABASE_URL="your_postgresql_connection_string"

AUTH_SECRET="your_long_random_secret"

NEXT_PUBLIC_WHATSAPP_NUMBER="your_whatsapp_number"

ADMIN_EMAIL="your_admin_email"

ADMIN_PASSWORD="your_secure_admin_password"
```

**গুরুত্বপূর্ণ:** Production ব্যবহারের আগে অবশ্যই নিজের Database URL, Secret, WhatsApp Number এবং Admin Credentials বসাতে হবে। কোনো Secret বা Password GitHub-এ প্রকাশ করবে না।

### ৪. Database Setup

Prisma Client তৈরি করো:

```bash
npx prisma generate
```

Database Schema Sync করো:

```bash
npx prisma db push
```

Initial Data Seed করো:

```bash
npm run db:seed
```

Seed Script-এর মাধ্যমে:

- ১০টি Service Category তৈরি হবে।
- প্রাথমিক Concept Demo Projects যুক্ত হবে।
- `ADMIN_EMAIL` এবং `ADMIN_PASSWORD` দেওয়া থাকলে প্রথম Admin Account তৈরি হবে।

### ৫. Local Development Server চালু

```bash
npm run dev
```

তারপর Browser-এ খোলো:

http://localhost:3000

## 📌 Website-এর গুরুত্বপূর্ণ পেজসমূহ

| Route | বিবরণ |
|---|---|
| `/` | Homepage |
| `/services` | সকল ডিজিটাল সেবা |
| `/services/[slug]` | Service Details |
| `/work` | Demo Project Gallery |
| `/work/[slug]` | Demo Project Details |
| `/request` | Project Request Form |
| `/contact` | যোগাযোগ ও Consultation |
| `/register` | Client Registration |
| `/login` | User Login |
| `/dashboard` | Client Dashboard |
| `/admin` | Admin Dashboard |
| `/admin/quotations` | Custom Quotation Management |
| `/admin/blog` | Blog Management |
| `/admin/team` | Team ও User Management |
| `/admin/finance` | Invoice ও Finance Management |
| `/admin/projects` | Project Management |
| `/admin/support` | Support Ticket Management |
| `/admin/consultations` | Consultation Management |
| `/admin/analytics` | Business Analytics |
| `/blog` | Public Journal |
| `/privacy` | Privacy Policy |
| `/terms` | Terms and Conditions |

## 🔌 API Features

প্রজেক্টে নিচের API Endpoints অন্তর্ভুক্ত রয়েছে:

- Project Request Management
- Consultation Request Management
- User Registration ও Authentication
- Admin Service Management
- Demo Project Management
- Project Request Inbox
- Invoice Management
- SSLCommerz Payment Initiation ও Callback Validation
- Support Ticket Management
- Project Messaging
- Client Notifications
- Project ও Task Management
- Blog Publishing
- Admin Analytics
- Activity Logs
- User ও Role Management

Protected API-গুলোতে Authentication ও Authorization ব্যবস্থা রয়েছে।

## 💳 Payment Integration

প্রজেক্টে SSLCommerz Payment Integration-এর ভিত্তি যুক্ত করা হয়েছে।

এর মধ্যে রয়েছে:

- Payment Initiation
- Hosted Checkout
- Server-side Transaction Validation
- Payment Status Management
- Transaction ID ও Amount Verification

**গুরুত্বপূর্ণ:** বাস্তব Payment চালুর আগে SSLCommerz Merchant Credentials যুক্ত করতে হবে এবং Sandbox Environment-এ Success, Failure, Cancel, IPN, Refund ও Duplicate Callback পরীক্ষা করতে হবে।

## 🚀 Deployment (Vercel + Neon)

NovaLoom Digital Solutions Vercel ও Neon PostgreSQL ব্যবহার করে Deploy করা যায়।

Deployment-এর ধাপ:

1. Project GitHub-এ Push করতে হবে।
2. Neon-এ PostgreSQL Database তৈরি করতে হবে।
3. Neon Connection String সংগ্রহ করতে হবে।
4. GitHub Repository Vercel-এ Import করতে হবে।
5. Vercel Environment Variables-এ প্রয়োজনীয় Configuration যোগ করতে হবে।
6. Production Database-এ Prisma Schema Sync করতে হবে।
7. Vercel থেকে Build ও Deploy করতে হবে।
8. Deployment URL এবং WhatsApp Configuration যাচাই করতে হবে।

Production Environment-এর জন্য প্রয়োজনীয় Variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

অতিরিক্ত Email ও Payment Integration ব্যবহার করলে সংশ্লিষ্ট API Keys এবং Credentials-ও যোগ করতে হবে।

Production-এ নিয়মিত Schema পরিবর্তনের জন্য Migration Workflow ব্যবহার করা উত্তম:

```bash
npx prisma migrate dev
npx prisma migrate deploy
```

## 🗄️ Database Modules

এই প্রজেক্টে Prisma-এর মাধ্যমে নিচের Database Models ব্যবহার করা হয়েছে:

- User
- ServiceCategory
- DemoProject
- ProjectRequest
- Quotation
- Project
- Milestone
- Consultation
- Invoice
- Payment
- SupportTicket
- Message
- Notification
- Task
- ActivityLog
- BlogPost
- Testimonial

## 🔐 Security Features

প্রজেক্টে রয়েছে:

- Password Hashing
- JWT-based Authentication
- HTTP-only Session Cookies
- Admin Protected Routes
- Role-based Access Control
- Server-side Payment Validation
- Project-scoped Messaging Access Control

তবে বাস্তব গ্রাহক ব্যবহারের আগে সম্পূর্ণ Security Review প্রয়োজন।

## ⚠️ Production-এর আগে আরও যেসব কাজ প্রয়োজন

এটি একটি পূর্ণাঙ্গ Project Foundation হলেও কিছু Production Feature-এর জন্য অতিরিক্ত Configuration ও Development প্রয়োজন।

১. Customer File Upload-এর জন্য Private S3/R2 Storage এবং Signed URL যুক্ত করতে হবে।

২. Public Forms ও Authentication-এর জন্য Rate Limiting এবং CAPTCHA/Bot Protection যুক্ত করতে হবে।

৩. Client ও Admin Email Notification-এর জন্য Resend API এবং Verified Sender Configuration করতে হবে।

৪. Staff Role-এর জন্য আরও বিস্তারিত Permission ও Project Assignment Security যুক্ত করতে হবে।

৫. Project Chat-এর জন্য উন্নত Inbox এবং Real-time WebSocket Delivery যুক্ত করতে হবে।

৬. Service ও Demo Management-এর জন্য সম্পূর্ণ Visual Admin Editor তৈরি করতে হবে।

৭. Privacy Policy, Terms এবং Data Retention Policy নিজের প্রতিষ্ঠানের প্রয়োজন অনুযায়ী সংশোধন করতে হবে।

৮. SSLCommerz Sandbox Testing সম্পন্ন করে তারপর Live Payment চালু করতে হবে।

৯. Automated Testing, Monitoring এবং Database Backup নিশ্চিত করতে হবে।

১০. Concept Demo-এর পরিবর্তে বাস্তব Portfolio Content ব্যবহারের আগে যথাযথ অনুমতি ও Licensed Assets নিশ্চিত করতে হবে।

## 📸 Images & Assets

প্রজেক্টে প্রাথমিক Visual Content-এর জন্য Unsplash-এর Remote Image URL ব্যবহার করা হয়েছে।

নিজস্ব ছবি ও Optimized Assets ব্যবহার করে Website-এর Visual Quality আরও উন্নত করা যাবে। Next.js Configuration-এ `images.unsplash.com` অনুমোদিত রয়েছে।

## 🎯 Project Vision

NovaLoom Digital Solutions-এর লক্ষ্য হলো একটি নির্ভরযোগ্য ডিজিটাল প্ল্যাটফর্ম তৈরি করা, যেখানে ব্যক্তি ও প্রতিষ্ঠান সহজেই তাদের প্রয়োজনীয় Website, Software, Mobile Application এবং অন্যান্য Digital Solutions পেতে পারে।

আমরা প্রযুক্তি, সৃজনশীলতা এবং আধুনিক ডিজাইনের সমন্বয়ে ডিজিটাল অভিজ্ঞতা উন্নত করতে কাজ করছি।

---

**Developed with ❤️ by NovaLoom Digital Solutions**

🌐 **Live Website:** [https://nova29.vercel.app/](https://nova29.vercel.app/)

💻 **GitHub Repository:** [NovaLoom Digital](https://github.com/Mohammad-Towhidul-Islam/novaloom-digital)
