import axios from 'axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const res = await axios.get('http://195.201.240.242:5000/api/results');
        return NextResponse.json(
            { data: res.data },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Surrogate-Control': 'no-store',
                },
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch proteins' }, { status: 500 });
    }
}
