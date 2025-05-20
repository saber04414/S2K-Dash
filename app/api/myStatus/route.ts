import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ApiPromise, WsProvider } from "@polkadot/api";
import axios from "axios";
import { u64 } from '@polkadot/types';

export const dynamic = 'force-dynamic'
export const revalidate = 0;
const networkEntryPoint = "ws://95.216.101.25:9944";

export async function GET(req: Request) {
    const url = new URL(req.url); // Create a URL object from the request URL
    const subnetId = Number(url.searchParams.get('subnet')) as number; // Get the 'day' query parameter
    const coldkeys = await prisma.coldkey.findMany();
    const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
    const res = await axios.get(`https://taomarketcap.com/api/subnets`)
    const subnet_data = await res.data;
    const response = await fetch("https://api.mexc.com/api/v3/ticker/price?symbol=TAOUSDT", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-cache"
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" });
    }
    const resdata = await response.json();
    const taoPrice = resdata.price
    try {
        const response = await axios.get(`https://taomarketcap.com/api/subnets/${subnetId}/metagraph`)
        const response_data = await response.data;
        const sidebar_res = await axios.get(`https://taomarketcap.com/api/subnets/${subnetId}/sidebar`)
        const sidebar_data = await sidebar_res.data;
        const filtered_data = response_data.filter((res_item: any) => mycoldkeys.includes(res_item.coldkey));
        const total_stake = filtered_data.reduce((acc: number, item: any) => acc + item.stake, 0);
        const total_daily = filtered_data.reduce((acc: number, item: any) => acc + item.alphaPerDay, 0);
        const subnet_info = subnet_data.find((subnet: any) => subnet.subnet === subnetId);
        const taox_api = await axios.post(`https://taoxnet.io/api/v1/netuid/netinfo?network=mainnet`, { netuid: subnetId })
        const price = await taox_api.data
        const response_reg = await axios.post(`https://taomarketcap.com/api/subnets/${subnetId}/burn`)

        //danger list
        const danger_list = response_data.filter((res_item: any) => res_item.miner === true && res_item.immunityPeriod < 0 && res_item.validator === false).sort((a: any, b: any) => a.registeredAt - b.registeredAt).sort((a: any, b: any) => a.incentive - b.incentive).map((item: any, i: number) => ({
            ...item, ranking: i + 1
        })).slice(0, 6);
        const filtered_danger_list = danger_list.filter((item: any) => mycoldkeys.includes(item.coldkey));
        const final_data = filtered_data.map((item: any) => ({
            ...item, danger: filtered_danger_list.find((danger: any) => danger.hotkey === item.hotkey) || null
        }));
        const data = { subnet: subnetId, total_stake, total_daily, name: subnet_info.name, letter: subnet_info.letter, taoInpool: price.subnetTAO, alphaInpool: price.subnetAlphaIn, emission: price.emissionRate, price: price.price, marketcap: subnet_info.marketcap, mydata: final_data, regcost: response_reg.data[response_reg.data.length - 1].value, sidebar: sidebar_data };
        const bittensor_data = await queryBittensorData([Number(subnetId)]);
        return NextResponse.json({ data, bittensor_data, taoPrice }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}

async function queryBittensorData(subnets: number[]) {
    const wsProvider = new WsProvider(networkEntryPoint);
    const api = await ApiPromise.create({ provider: wsProvider });
    const block_counts: number[] = await Promise.all(
        subnets.map(async (key) =>
            (await api.query.subtensorModule.blocksSinceLastStep(key) as u64).toNumber()
        )
    );
    const incentive_res = [];
    for (let i = 0; i < block_counts.length; i++) {
        const remainedSeconds = (360 - block_counts[i]) * 12
        const newres = {
            subnet_id: subnets[i],
            hour: Math.floor(remainedSeconds / 3600),
            minute: Math.floor((remainedSeconds % 3600) / 60),
            second: remainedSeconds % 60
        }
        incentive_res.push(newres);
    }

    //registration
    const registration_res = [];
    const before_registration_block: number[] = await Promise.all(
        subnets.map(async (key) =>
            (await api.query.subtensorModule.lastAdjustmentBlock(key) as u64).toNumber()
        )
    )
    const lastMechansimStepBlock = (await api.query.subtensorModule.lastMechansimStepBlock(subnets[0]) as u64).toNumber();
    const current_block = lastMechansimStepBlock + block_counts[0];
    for (let i = 0; i < before_registration_block.length; i++) {
        const next_epoch_start = before_registration_block[i] + 360;
        const remained_block = next_epoch_start - current_block;
        const current_time = new Date().getTime();
        const remained_time = remained_block * 12 - current_time % 12;
        const newres = {
            subnet_id: subnets[i],
            hour: Math.floor(remained_time / 3600),
            minute: Math.floor((remained_time % 3600) / 60),
            second: remained_time % 60
        }
        registration_res.push(newres);
    }
    return { incentive_res, registration_res };
}