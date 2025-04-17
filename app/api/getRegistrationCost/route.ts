import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
import axios from 'axios';
import prisma from '@/lib/prisma';
export async function GET() {
    const data = []
    const subnets_res = await axios.get('https://taomarketcap.com/api/subnets')
    const subnets = await subnets_res.data
    const subnets_ids = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const mysubnets = subnets_ids.map((ss: any) => ss.subnet);
    const arr = Array.from({ length: subnets.length - 50 }, (_, i) => i + 50);
    const merged = Array.from(new Set([...arr, ...mysubnets])).sort((a, b) => a - b);
    const subnets_slice = subnets.filter((item:any)=> merged.includes(item.subnet))
    try {
        for(const subnet of subnets_slice) {
            const allowres = await axios.get(`https://taomarketcap.com/api/subnets/${subnet.subnet}/sidebar`)
            const allowdata = allowres.data.networkRegistrationAllowed
            console.log({allowdata})
            const response = await axios.post(`https://taomarketcap.com/api/subnets/${subnet.subnet}/burn`)
            const response_data = await response.data;
            const res = {
                netuid: subnet.subnet,
                name: subnet.name,
                letter: subnet.letter,
                registration: allowdata,
                registrationCost: response_data.slice(-5)
            }
            data.push(res)
        }
        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}
