import prisma from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET() {
    const coldkeys = await prisma.coldkey.findMany({
        where: {
            ghost: true,
        },
    });
    const data = []
    let total_staked = 0
    let total_free = 0
    for (const cold of coldkeys) {
        const { name, coldkey } = cold
        try {
            const result = await axios.get(`https://api.dev.taomarketcap.com/internal/v1/accounts/coldkeys/${coldkey}`, { headers: { "Content-Type": "application/json" } })
            const { free, tao_staked } = result.data
            const staked = tao_staked
            const returned_data = {
                staked: staked,
                free: free,
                total: staked + free,
                coldkey: coldkey,
                name: name
            }
            total_staked += staked
            total_free += free
            data.push(returned_data)
        } catch (error) {
            console.error(error)
        }
    }
    return NextResponse.json({ data, total_staked, total_free });
}
