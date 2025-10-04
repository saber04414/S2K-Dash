import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiPromise, WsProvider } from "@polkadot/api";
import axios from "axios";
import { u64 } from "@polkadot/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// const networkEntryPoint = "ws://95.216.101.25:9944";
const networkEntryPoint = "wss://entrypoint-finney.opentensor.ai:443";

export async function GET(req: Request) {
  const url = new URL(req.url); // Create a URL object from the request URL
  const subnetId = Number(url.searchParams.get("subnet")) as number; // Get the 'day' query parameter
  const coldkeys = await prisma.coldkey.findMany();
  console.log("Hello1")
  const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
  const res = await axios.get(`https://api.dev.taomarketcap.com/internal/v1/subnets/?limit=129`);
  const subnet_data = await res.data.results;
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
    return NextResponse.json({ error: "Failed to fetch data" });
  }
  const resdata = await response.json();
  const taoPrice = resdata.price;

  try {
    const response = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/neurons/${subnetId}/`
    );
    const response_data = await response.data;
    const sidebar_res = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/${subnetId}/`
    );
    const sidebar_data = await sidebar_res.data.latest_snapshot;

    const filtered_data = response_data.filter((res_item: any) =>
      mycoldkeys.includes(res_item.owner)
    );
    const total_stake = filtered_data.reduce(
      (acc: number, item: any) => acc + item.alpha_stake / 1e9,
      0
    );
    const chartData = response_data
      .map((item: any) => {
        return {
          uid: item.uid,
          isMiner: item.validator_permit == false,
          incentive: item.incentive,
          daily: item.alpha_per_day,
          stake: item.alpha_stake / 1e9,
          immunity: item.block_number - item.block_at_registration < item.immunity_period,
          coldkey: item.owner,
          hotkey: item.hotkey,
          registerDuration: item.registration_block_time,
          owner: mycoldkeys.includes(item.owner) ? "Mine" : "Unknown",
        };
      })
      .filter((item: any) => item.isMiner)
      .sort((a: any, b: any) => b.daily - a.daily)
      .map((item: any, i: number) => ({ ...item, ranking: i + 1 }));
    const total_daily = filtered_data.reduce(
      (acc: number, item: any) => acc + item.alpha_per_day,
      0
    );
    const subnet_info = subnet_data.find(
      (subnet: any) => subnet.netuid === subnetId
    );

    const response_reg = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/burn/${subnetId}/?span=ALL`
    );

    //danger list
    const danger_list = response_data
      .filter(
        (res_item: any) =>
          res_item.validator_permit === false &&
          res_item.block_number - res_item.block_at_registration > res_item.immunity_period
      )
      .sort((a: any, b: any) => a.block_at_registration - b.block_at_registration)
      .sort((a: any, b: any) => a.incentive - b.incentive)
      .map((item: any, i: number) => ({
        ...item,
        ranking: i + 1,
      }))
      .slice(0, 6);
    const filtered_danger_list = danger_list.filter((item: any) =>
      mycoldkeys.includes(item.owner)
    );
    // registration list
    const registration_list = response_data
      .filter(
        (res_item: any) =>
          res_item.validator_permit === false &&
          res_item.block_number - res_item.block_at_registration >= res_item.immunity_period
      )
      .sort((a: any, b: any) => b.block_at_registration - a.block_at_registration)
      .sort((a: any, b: any) => a.block_at_registration - b.block_at_registration)
      .map((item: any, i: number) => ({
        ...item,
        ranking: i + 1,
      }))
      .slice(0, sidebar_data.burn_registrations_this_interval);

    const sorted_registration_list = registration_list.sort(
      (a: any, b: any) => a.block_at_registration - b.block_at_registration
    );

    const my_coldkeys = Array.from(
      new Set(filtered_data.map((item: any) => item.owner))
    );

    const final_data = filtered_data.map((item: any) => ({
      ...item,
      axon: item.axon ? item.axon:"0.0.0.0",
      danger:
        filtered_danger_list.find(
          (danger: any) => danger.hotkey === item.hotkey
        ) || null,
    }));
    const next_burn = calculateNextBurn(
      parseFloat(response_reg.data[response_reg.data.length - 1].burn) / 1e9,
      sidebar_data.registrations_this_interval,
      sidebar_data.target_registrations_per_interval,
      parseFloat(sidebar_data.adjustment_alpha) / 2**64
    );
    const data = {
      subnet: subnetId,
      total_stake,
      total_daily,
      name: subnet_info.latest_snapshot.subnet_identities_v3.subnetName,
      letter: subnet_info.latest_snapshot.token_symbol,
      taoInpool: subnet_info.latest_snapshot.subnet_tao,
      alphaInpool: subnet_info.latest_snapshot.subnet_alpha_in,
      emission: subnet_info.latest_snapshot.subnet_tao_in_emission,
      price: subnet_info.latest_snapshot.price,
      marketcap: subnet_info.latest_snapshot.dtao.marketCap,
      mydata: final_data,
      regcost: parseFloat(response_reg.data[response_reg.data.length - 1].burn) / 1e9,
      sidebar: sidebar_data,
      next_burn,
      mycoldkeys: my_coldkeys,
      reglist: sorted_registration_list,
    };
    const bittensor_data = await queryBittensorData([Number(subnetId)]);
    return NextResponse.json(
      { data, bittensor_data, taoPrice, chartData },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}

function calculateNextBurn(
  currentBurn: number,
  registrationsThisInterval: number,
  targetRegistrationsPerInterval: number,
  adjustmentAlpha: number
) {
  const registrations = BigInt(registrationsThisInterval);
  const target = BigInt(targetRegistrationsPerInterval);
  const current = currentBurn; // Assume currentBurn is a Number for now
  const updatedBurn =
    (current * Number(registrations + target)) / Number(target + target);
  const nextValue =
    adjustmentAlpha * current + (1 - adjustmentAlpha) * updatedBurn;

  return nextValue;
}

async function queryBittensorData(subnets: number[]) {
  const wsProvider = new WsProvider(networkEntryPoint);
  const api = await ApiPromise.create({ provider: wsProvider });
  const block_counts: number[] = await Promise.all(
    subnets.map(async (key) =>
      (
        (await api.query.subtensorModule.blocksSinceLastStep(key)) as u64
      ).toNumber()
    )
  );
  const incentive_res = [];
  for (let i = 0; i < block_counts.length; i++) {
    const remainedSeconds = (360 - block_counts[i]) * 12;
    const newres = {
      subnet_id: subnets[i],
      hour: Math.floor(remainedSeconds / 3600),
      minute: Math.floor((remainedSeconds % 3600) / 60),
      second: remainedSeconds % 60,
    };
    incentive_res.push(newres);
  }

  //registration
  const registration_res = [];
  const before_registration_block: number[] = await Promise.all(
    subnets.map(async (key) =>
      (
        (await api.query.subtensorModule.lastAdjustmentBlock(key)) as u64
      ).toNumber()
    )
  );
  const lastMechansimStepBlock = (
    (await api.query.subtensorModule.lastMechansimStepBlock(subnets[0])) as u64
  ).toNumber();
  const current_block = lastMechansimStepBlock + block_counts[0];
  for (let i = 0; i < before_registration_block.length; i++) {
    const next_epoch_start = before_registration_block[i] + 360;
    const remained_block = next_epoch_start - current_block;
    const current_time = new Date().getTime();
    const remained_time = remained_block * 12 - (current_time % 12);
    const newres = {
      subnet_id: subnets[i],
      hour: Math.floor(remained_time / 3600),
      minute: Math.floor((remained_time % 3600) / 60),
      second: remained_time % 60,
    };
    registration_res.push(newres);
  }
  return { incentive_res, registration_res };
}
