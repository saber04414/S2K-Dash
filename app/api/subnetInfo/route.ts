import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(req: Request) {
  const { netuid } = await req.json();
  const subnets = await prisma.subnets.findMany({ orderBy: { subnet: "asc" } });
  const subnets_ids = subnets.map((ss: any) => ss.subnet);

  try {
    const price_res = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/${netuid}/candle-chart/?period=1h`
    );
    const price_data = await price_res.data.data;
    return NextResponse.json(
      { subnets: subnets_ids, priceData: price_data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ subnets: [], priceData: [] }, { status: 500 });
  }
}
