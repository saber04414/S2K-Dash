import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET(req: Request) {
    try {
        const url = new URL(req.url); // Create a URL object from the request URL
        const coldkey_address = url.searchParams.get('coldkey_address'); // Get the 'day' query parameter
        const result = await axios.post(`https://taoxnet.io/api/v1/transfer/address?network=mainnet`, {address: coldkey_address, skip: 0, take: 20});
        const data = result.data.data;
        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get asset list' }, { status: 500 });
    }
}
