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
  const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
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
      `http://2.56.179.136:41410/metagraph/netuid/${subnetId}/`
    );
    const response_data = await response.data;
    const sidebar_res = await axios.get(
      `https://api.dev.taomarketcap.com/internal/v1/subnets/${subnetId}/`
    );
    const sidebar_data = await sidebar_res.data.latest_snapshot;

    const filtered_data = response_data.data.neurons.neurons.filter((res_item: any) =>
      mycoldkeys.includes(res_item.coldkey)
    );
    const total_stake = filtered_data.reduce(
      (acc: number, item: any) => acc + item.stake.rao / 1e9,
      0
    );
    const chartData = response_data.data.neurons.neurons
      .map((item: any) => {
        return {
          uid: item.uid,
          isMiner: item.validator_permit == false,
          incentive: item.incentive,
          daily: item.emission * 20,
          stake: item.stake.rao / 1e9,
          immunity: response_data.data.block - response_data.data.neurons.block_at_registration[item.uid] < response_data.data.neurons.hparams.immunity_period,
          coldkey: item.coldkey,
          hotkey: item.hotkey,
          axon: item.axon_info ? item.axon_info.ip + ":" + item.axon_info.port : "0.0.0.0",
          registerDuration: response_data.data.block - response_data.data.neurons.block_at_registration[item.uid],
          owner: mycoldkeys.includes(item.coldkey) ? "Mine" : "Unknown",
        };
      })
      .filter((item: any) => item.isMiner)
      .sort((a: any, b: any) => b.daily - a.daily)
      .map((item: any, i: number) => ({ ...item, ranking: i + 1 }));
    const total_daily = filtered_data.reduce(
      (acc: number, item: any) => acc + item.emission * 20,
      0
    );

    //danger list
    const danger_list = response_data.data.neurons.neurons
      .filter((n: any) => {
        const blockNow = response_data.data.block ?? 0;
        const regBlock = response_data.data.neurons.block_at_registration?.[n.uid] ?? Infinity;
        const immunity = response_data.data.neurons.hparams?.immunity_period ?? 0;

        return n?.validator_permit === false && (blockNow - regBlock) > immunity;
      })
      .sort((a: any, b: any) => {
        // 1) emission ascending
        const incA = Number(a.emission ?? Infinity);
        const incB = Number(b.emission ?? Infinity);
        if (incA !== incB) return incA - incB;

        // 2) registration block ascending (older first)
        const regA = response_data.data.neurons.block_at_registration?.[a.uid] ?? Infinity;
        const regB = response_data.data.neurons.block_at_registration?.[b.uid] ?? Infinity;
        if (regA !== regB) return regA - regB;

        // 3) uid ascending as final tie-breaker
        return Number(a.uid) - Number(b.uid);
      })
      .map((item: any, i: number) => ({
        ...item,
        ranking: i + 1,
      }))
      .slice(0, 6);
    const filtered_danger_list = danger_list.filter((item: any) =>
      mycoldkeys.includes(item.coldkey)
    );
    // registration list
    const registration_list = response_data.data.neurons.neurons
    .sort((a: any, b: any) => response_data.data.neurons.block_at_registration[a.uid] - response_data.data.neurons.block_at_registration[b.uid])
    .sort((a: any, b: any) => response_data.data.neurons.block_at_registration[b.uid] - response_data.data.neurons.block_at_registration[a.uid])
      .map((item: any, i: number) => ({
        ...item,
        ranking: i + 1,
      }))
      .slice(0, sidebar_data.burn_registrations_this_interval);

    console.log({registration_list})

    const my_coldkeys = Array.from(
      new Set(filtered_data.map((item: any) => item.coldkey))
    );
    const final_data = filtered_data.map((item: any) => ({
      ...item,
      axon: item.axon_info ? item.axon_info.ip + ":" + item.axon_info.port : "0.0.0.0",
      registration_block_time: response_data.data.block - response_data.data.neurons.block_at_registration[item.uid],
      block_number: response_data.data.block,
      block_at_registration: response_data.data.neurons.block_at_registration[item.uid],
      immunity_period: response_data.data.neurons.hparams.immunity_period,
      danger:
        filtered_danger_list.find(
          (danger: any) => danger.hotkey === item.hotkey
        ) || null,
    }));
    const next_burn = calculateNextBurn(
      parseFloat(response_data.data.neurons.hparams.burn),
      sidebar_data.registrations_this_interval,
      sidebar_data.target_registrations_per_interval,
      parseFloat(sidebar_data.adjustment_alpha) / 2 ** 64
    );
    const data = {
      subnet: subnetId,
      total_stake,
      total_daily,
      name: response_data.data.neurons.identity.subnet_name,
      letter: response_data.data.neurons.symbol,
      taoInpool: response_data.data.neurons.pool.tao_in,
      alphaInpool: response_data.data.neurons.pool.alpha_in,
      emission: response_data.data.neurons.emissions.tao_in_emission,
      price: response_data.data.price,
      marketcap: response_data.data.neurons.subnet_volume,
      mydata: final_data,
      regcost: parseFloat(response_data.data.neurons.hparams.burn),
      sidebar: sidebar_data,
      next_burn,
      mycoldkeys: my_coldkeys,
      reglist: registration_list,
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
