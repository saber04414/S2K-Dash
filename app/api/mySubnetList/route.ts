import prisma from '@/lib/prisma';
import axios from 'axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function GET() {
    const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const subnets_ids = subnets.map((ss: any) => ss.subnet);
    const subnet_res = await axios.post('https://taoxnet.io/api/v1/netuid/info?network=mainnet');
    const subnet_data = subnet_res.data;
    try {
        const result = []
        for (const subnet in subnet_data) {
            if (subnets_ids.includes(Number(subnet))) {
                subnet_data[subnet].subnet_id = Number(subnet)
                result.push(subnet_data[subnet])
            }
        }
        return NextResponse.json({ data: result }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}