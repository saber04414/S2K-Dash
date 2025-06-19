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
  const res = await axios.get(`https://taomarketcap.com/api/subnets`);
  const subnet_data = await res.data;
  try {
    for (const subnet_uid of mysubnets) {
      const response = await axios.get(
        `https://taomarketcap.com/api/subnets/${subnet_uid}/metagraph`
      );
      const response_data = await response.data;
      data.push({ netuid: subnet_uid, data: response_data });
    }
    const result_data: SubnetResult[] = [];

    data.map((subnet) => {
      const chartData = subnet.data
        .map((item: any) => {
          return {
            uid: item.uid,
            isMiner: item.validator == false,
            incentive: item.incentive,
            daily: item.alphaPerDay,
            stake: item.stake,
            immunity: item.immunityPeriod > 0,
            coldkey: item.coldkey,
            registerDuration: item.registeredAt,
            owner: mycoldkeys.includes(item.coldkey) ? "Mine" : "Unknown",
          };
        })
        .filter((item: any) => item.isMiner)
        .sort((a: any, b: any) => b.incentive - a.incentive)
        .map((item: any, i: number) => ({ ...item, ranking: i + 1 }));
      const subnet_info = subnet_data.find(
        (item: any) => item.subnet === subnet.netuid
      );
      result_data.push({
        netuid: subnet.netuid,
        name: subnet_info.name,
        letter: subnet_info.letter,
        price: subnet_info.price,
        marketcap: subnet_info.marketcap,
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
