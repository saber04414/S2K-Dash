import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { ApiPromise, WsProvider } from "@polkadot/api";
import axios from "axios";
import { u64 } from '@polkadot/types';

export const dynamic = 'force-dynamic'
export const revalidate = 0;
const networkEntryPoint = "wss://entrypoint-finney.opentensor.ai:443";

export async function GET() {
    const coldkeys = await prisma.coldkey.findMany();
    const mycoldkeys = coldkeys.map((coldkey) => coldkey.coldkey);
    const subnets = await prisma.subnets.findMany({ orderBy: { subnet: 'asc' } });
    const mysubnets = subnets.map((subnet: any) => subnet.subnet);
    const data = [];
    const res = await axios.get(`https://taomarketcap.com/api/subnets`)
    const subnet_data = await res.data;
    try {
        for (const subnet_uid of mysubnets) {
            const response = await axios.get(`https://taomarketcap.com/api/subnets/${subnet_uid}/metagraph`)
            const response_data = await response.data;
            const filtered_data = response_data.filter((res_item: any) => mycoldkeys.includes(res_item.coldkey));
            const total_stake = filtered_data.reduce((acc: number, item: any) => acc + item.stake, 0);
            const total_daily = filtered_data.reduce((acc: number, item: any) => acc + item.alphaPerDay, 0);
            const subnet_info = subnet_data.find((subnet: any) => subnet.subnet === subnet_uid);
            data.push({ subnet: subnet_uid, total_stake, total_daily, name: subnet_info.name, letter: subnet_info.letter, price: subnet_info.price, marketcap: subnet_info.marketcap, mydata: filtered_data });
        }
        const bittensor_data = await queryBittensorData(mysubnets);
        return NextResponse.json({ data, bittensor_data }, { status: 201 });
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