import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
import axios from "axios";
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
  const coldkeys = await prisma.coldkey.findMany();
  const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
  const subnets = await prisma.subnets.findMany({ orderBy: { subnet: "asc" } });
  const mysubnets = subnets.map((subnet: any) => subnet.subnet);
  const data = [];
  try {
    for (const subnet_uid of mysubnets) {
      const response = await axios.get(
        `https://api.dev.taomarketcap.com/internal/v1/subnets/neurons/${subnet_uid}/`
      );
      const response_data = await response.data;
      data.push({ netuid: subnet_uid, data: response_data });
    }
    const result_data: SubnetResult[] = [];

    data.map(async(subnet) => {
      const chartData = subnet.data
        .map((item: any) => {
          return {
            uid: item.uid,
            isMiner: item.validator_permit == false,
            incentive: item.incentive,
            daily: item.alpha_per_day,
            stake: item.alpha_stake,
            immunity: item.block_number - item.block_at_registration > item.immunity_period,
            coldkey: item.owner,
            hotkey: item.hotkey,
            registerDuration: item.registration_block_time,
            owner: mycoldkeys.includes(item.owner) ? "Mine" : "Unknown",
          };
        })
        .filter((item: any) => !item.validator_permit)
        .sort((a: any, b: any) => b.incentive - a.incentive)
        .map((item: any, i: number) => ({ ...item, ranking: i + 1 }));

      const res = await axios.get(`https://api.dev.taomarketcap.com/internal/v1/subnets/${subnet.netuid}/`);
      const subnet_info = await res.data

      result_data.push({
        netuid: subnet.netuid,
        name: subnet_info.subnet_identities_v3.subnetName,
        letter: subnet_info.token_symbol,
        price: subnet_info.price,
        marketcap: subnet_info.dtao.marketCap,
        chartData,
      });
    });
    return NextResponse.json({ result_data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}
