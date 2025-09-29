import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET(req: Request) {
    try {
        const url = new URL(req.url); // Create a URL object from the request URL
        const coldkey_address = url.searchParams.get('coldkey_address'); // Get the 'day' query parameter
        const result = await axios.get(`http://2.56.179.136:41410/metagraph/coldkey/${coldkey_address}`);
        const data = result.data;
        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get asset list' }, { status: 500 });
    }
}
