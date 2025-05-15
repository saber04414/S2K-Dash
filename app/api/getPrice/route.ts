import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
type EXPORT_DATA = {
  name: string;
  price: string;
}
export async function GET() {
  try {
    const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const mysubnets = subnets.map((subnet: any) => subnet.subnet);
    const response = await fetch("https://api.mexc.com/api/v3/ticker/price", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" });
    }
    const data = await response.json();
    const taoPrice = data.find((price: { symbol: string; }) => price.symbol === 'TAOUSDT').price
    const btcPrice = data.find((price: { symbol: string; }) => price.symbol === 'BTCUSDT').price
    const response_data: EXPORT_DATA[] = [
      {
        name: 'TAO',
        price: taoPrice
      },
      {
        name: 'BTC',
        price: btcPrice
      }
    ]
    // for (const subnet_uid of mysubnets) {
    //   const taox_api = await axios.post(`https://taoxnet.io/api/v1/netuid/netinfo?network=mainnet`, { netuid: subnet_uid })
    //   const price = await taox_api.data
    //   response_data.push({
    //     name: `Subnet ${subnet_uid}`,
    //     price: price.price
    //   })
    // }
    return NextResponse.json(response_data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
  }
}