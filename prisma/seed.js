const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { services, demos } = require('../lib/seed-data.cjs');
const prisma = new PrismaClient();
const categoryMap = {
  'Website Development':'website-development', 'E-commerce Development':'ecommerce-development',
  'Web Application Development':'web-applications', 'Mobile App Development':'mobile-app-development',
  'UI/UX & Graphic Design':'ui-ux-design', 'Domain, Hosting & Deployment':'hosting-deployment',
  'Website Maintenance and Security':'maintenance-security', 'SEO and Digital Marketing':'seo-marketing',
  'API and Automation Solutions':'api-automation', 'AI and Custom Digital Solutions':'ai-solutions'
};
async function main() {
  const categories = {};
  for (const [i, s] of services.entries()) {
    categories[s.slug] = await prisma.serviceCategory.upsert({ where: { slug: s.slug }, update: { ...s, sortOrder: i }, create: { ...s, sortOrder: i } });
  }
  for (const [i, d] of demos.entries()) {
    const categoryId = categories[categoryMap[d.category]]?.id;
    if (!categoryId) continue;
    await prisma.demoProject.upsert({ where: { slug: d.slug }, update: { title:d.title, description:d.description, image:d.image, technologies:d.tags || [], features:[], featured:!!d.featured, categoryId, sortOrder:i, concept:true }, create: { slug:d.slug, title:d.title, description:d.description, image:d.image, technologies:d.tags || [], features:[], featured:!!d.featured, categoryId, sortOrder:i, concept:true } });
  }
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({ where: { email }, update: { role: 'ADMIN', passwordHash }, create: { name: 'Administrator', email, passwordHash, role: 'ADMIN' } });
  }
  console.log('Seed complete.');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
