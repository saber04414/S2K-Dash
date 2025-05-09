import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function GET() {
    const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const subnets_ids = subnets.map((ss: any) => ss.subnet);
    return NextResponse.json({ data: subnets_ids }, { status: 201 });
}