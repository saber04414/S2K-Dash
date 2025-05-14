import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const { coldkey_address, hotkey_address, netuid, amount } = await req.json();

        await axios.post("http://95.216.101.25:21802/api/v1/wallet/unstake", {
            coldkey_address,
            hotkey_address,
            netuid,
            amount
        });

        return NextResponse.json({ message: "Successfully unstaked" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
