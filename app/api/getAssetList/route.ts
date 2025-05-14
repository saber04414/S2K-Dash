import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET(req: Request) {
    try {
        const url = new URL(req.url); // Create a URL object from the request URL
        const coldkey_address = url.searchParams.get('coldkey_address'); // Get the 'day' query parameter
        const result = await axios.get(`http://95.216.101.25:21802/api/v1/wallet/coldkey/${coldkey_address}/balance`);
        const price_res = await axios.get(`https://taomarketcap.com/api/subnets`)
        const price = price_res.data
        const data = result.data;
        return NextResponse.json({ data, price }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get asset list' }, { status: 500 });
    }
}
