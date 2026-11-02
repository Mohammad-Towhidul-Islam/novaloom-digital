import {NextResponse} from 'next/server';
import {getSession} from '@/lib/auth';
import {prisma} from '@/lib/prisma';
export async function GET(){const session=await getSession();if(!session?.sub)return NextResponse.json({error:'Sign in required.'},{status:401});const requests=await prisma.projectRequest.findMany({where:{userId:session.sub},orderBy:{createdAt:'desc'},include:{quotations:{orderBy:{createdAt:'desc'}},project:{include:{milestones:{orderBy:{sortOrder:'asc'}},tasks:{where:{status:{not:'DONE'}},select:{id:true,title:true,status:true,dueAt:true}}}}}});return NextResponse.json({requests});}
