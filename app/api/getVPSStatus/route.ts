import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function GET() {
    try {
        const response = await axios.get('http://88.99.66.154:31000/api/candles', {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });
        
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error fetching VPS status:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch VPS status',
                message: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}

