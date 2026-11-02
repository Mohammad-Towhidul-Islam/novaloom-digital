import {NextResponse} from 'next/server';import {prisma} from '@/lib/prisma';
export async function GET(_req,{params}){const post=await prisma.blogPost.findFirst({where:{slug:params.slug,published:true}});if(!post)return NextResponse.json({error:'Article not found.'},{status:404});return NextResponse.json({post});}
