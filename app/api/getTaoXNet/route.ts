import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET() {
    try {
        const response = await axios.get(`https://api.dev.taomarketcap.com/internal/v1/subnets/neurons/68/`);
        const res = response.data
        return NextResponse.json({ res }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save protein' }, { status: 500 });
    }
}
