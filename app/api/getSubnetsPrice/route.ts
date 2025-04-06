import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
type EXPORT_ITEM = {
    block_number: number;
    timestamp: Date;
    value: number
}
type EXPORT_DATA = {
    netuid: number;
    reg: EXPORT_ITEM[];
}
export async function GET() {
    try {
        const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
        const mysubnets = subnets.map((subnet: any) => subnet.subnet);
        const res_data: EXPORT_DATA[] = []
        for (const subnet_uid of mysubnets) {
            const taomarket_api = await axios.get(`https://taomarketcap.com/api/subnets/${subnet_uid}/burn`)
            const regs = await taomarket_api.data
            res_data.push({
                netuid: subnet_uid,
                reg: regs
            })
        }
        return NextResponse.json(res_data);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
    }
}