import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // Next-JS route options
export const revalidate = 0;

type ChartItem = {
  uid: number;
  isMiner: boolean;
  incentive: number;
  daily: number;
  stake: number;
  coldkey: string;
  registerDuration: number;
  immunity: boolean;
  owner: string;
  ranking: number;
};

type SubnetResult = {
  name: string;
  letter: string;
  price: number;
  marketcap: number;
  chartData: ChartItem[];
  netuid: number;
};

export async function GET() {
  try {
    /* ──► 1. Load coldkeys & subnet IDs from your DB */
    const coldkeys = await prisma.coldkey.findMany();
    const mycoldkeys = coldkeys.map(c => c.coldkey);
    const infoRes = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/?limit=129`,
    );
    const info = infoRes.data.results;
    const subnets = await prisma.subnets.findMany({
      orderBy: { subnet: "asc" },
    });
    const subnetIds = subnets.map(s => s.subnet as number);

    /* ──► 2. Fetch neuron snapshots for all subnets in parallel */
    const neuronSnapshots = await Promise.all(
      subnetIds.map(async netuid => {
        const res = await axios.get(
          `https://api.dev.taomarketcap.com/internal/v1/subnets/neurons/${netuid}/`,
        );
        return { netuid, data: res.data };
      }),
    );

    /* ──► 3. Build the final result array, one subnet at a time */
    const result_data: SubnetResult[] = [];

    for (const snapshot of neuronSnapshots) {
      const chartData: ChartItem[] = snapshot.data
        .map((n: any) => ({
          uid: n.uid,
          isMiner: n.validator_permit === false,
          incentive: n.incentive,
          daily: n.alpha_per_day,
          stake: n.alpha_stake / 1e9,
          immunity:
            n.block_number - n.block_at_registration < n.immunity_period,
          coldkey: n.owner,
          registerDuration: n.registration_block_time,
          owner: mycoldkeys.includes(n.owner) ? "Mine" : "Unknown",
        }))
        .filter((n: any) => n.isMiner) // only miners, not validators
        .sort((a: any, b: any) => b.incentive - a.incentive)
        .map((n: any, i: number) => ({ ...n, ranking: i + 1 }));

      // fetch subnet-level stats
        const specific = info[snapshot.netuid+1].latest_snapshot

      result_data.push({
        netuid: snapshot.netuid,
        name: specific.subnet_identities_v3.subnetName,
        letter: specific.token_symbol,
        price: specific.price,
        marketcap: specific.dtao.marketCap,
        chartData,
      });
    }

    /* ──► 4. Send JSON response */
    return NextResponse.json({ result_data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to build subnet data" },
      { status: 500 },
    );
  }
}
