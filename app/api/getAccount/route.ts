import { NextResponse } from 'next/server';
import axios from 'axios';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET(req: Request) {
    try {
        const url = new URL(req.url); // Create a URL object from the request URL
        const coldkey_address = url.searchParams.get('coldkey_address'); // Get the 'day' query parameter
        const result = await axios.get(`http://2.56.179.136:41410/metagraph/coldkey/${coldkey_address}`);
        const response = await fetch(
            "https://api.mexc.com/api/v3/ticker/price?symbol=TAOUSDT",
            {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
                cache: "no-cache",
            }
            );
    
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
        }
        const resdata = await response.json();
        const taoPrice = resdata.price;
        console.log({ taoPrice })
        const data = result.data;
        let total_daily = 0;
        let total_daily_dtao = 0;
        for (const item of data.data) {
            for(const neuron of item.neurons) {
                total_daily += neuron.emission * 20 * item.price;
                total_daily_dtao += neuron.emission * 20;
            }
        }
        const total_daily_usd = total_daily * taoPrice;
        return NextResponse.json({ data, total_daily, total_daily_dtao, total_daily_usd }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get asset list' }, { status: 500 });
    }
}
