import axios from "axios";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET(req: Request) {
  const url = new URL(req.url); // Create a URL object from the request URL
  const subnetIDs = url.searchParams.get('subnetIDs') as string; // Get the 'day' query parameter
  const subnet_ids = subnetIDs.split(',').map((subnet: string) => parseInt(subnet.trim(), 10));
  try {
    const response = await fetch("https://api.dev.taomarketcap.com/internal/v1/subnets/?limit=129", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache"
    });

    const subnets_dd = await response.json();
    const subnets = subnets_dd.results
    const filteredSubnets = subnets.filter((subnet: any) => subnet_ids.includes(subnet.netuid));

    for (const id of subnet_ids) {
      const res = await axios.post(`https://taoxnet.io/api/v1/netuid/netinfo?network=mainnet`, { netuid: id }, { headers: { "Content-Type": "application/json" } })
      const data = await res.data;
      filteredSubnets.forEach((subnet: any) => {
        if (subnet.subnet === id) {
          subnet.reg_cost = Number(data.registrationCost)/10**9;
          subnet.emission = Number(data.emission)/10**7;
        }
      });
    }

    return NextResponse.json(filteredSubnets);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
  }
}