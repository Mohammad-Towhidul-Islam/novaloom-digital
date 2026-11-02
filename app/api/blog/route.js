import {NextResponse} from 'next/server';import {prisma} from '@/lib/prisma';
export async function GET(){const posts=await prisma.blogPost.findMany({where:{published:true},select:{title:true,slug:true,excerpt:true,coverImage:true,publishedAt:true},orderBy:{publishedAt:'desc'}});return NextResponse.json({posts});}
