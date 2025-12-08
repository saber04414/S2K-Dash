import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET() {
    try {
        const result = await axios.get(`http://88.99.66.154:41410/subnets`);
        const data = result.data;
        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get asset list' }, { status: 500 });
    }
}
