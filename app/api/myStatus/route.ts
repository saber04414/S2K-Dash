import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
import axios from 'axios';
export async function GET() {
    const coldkeys = await prisma.coldkey.findMany();
    const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
    const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const mysubnets = subnets.map((subnet: any) => subnet.subnet);
    const data = [];
    const res = await axios.get(`https://taomarketcap.com/api/subnets`)
    const subnet_data = await res.data;
    try {
        for (const subnet_uid of mysubnets) {
            const response = await axios.get(`https://taomarketcap.com/api/subnets/${subnet_uid}/metagraph`)
            const response_data = await response.data;
            const filtered_data = response_data.filter((res_item: any) => mycoldkeys.includes(res_item.coldkey));
            const total_stake = filtered_data.reduce((acc: number, item: any) => acc + item.stake, 0);
            const total_daily = filtered_data.reduce((acc: number, item: any) => acc + item.alphaPerDay, 0);
            const subnet_info = subnet_data.find((subnet: any) => subnet.subnet === subnet_uid);
            data.push({ subnet: subnet_uid, total_stake, total_daily, name: subnet_info.name, letter: subnet_info.letter, price: subnet_info.price, marketcap: subnet_info.marketcap, mydata: filtered_data });
        }
        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}
