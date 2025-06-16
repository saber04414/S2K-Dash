import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { netuid } = await req.json();
    // Validate input
    if (!netuid || typeof netuid !== 'number') {
        return NextResponse.json({ error: 'Invalid netuid value' }, { status: 400 });
    }

    try {
        // Check if netuid already exists
        const existingNETUID = await prisma.subnets.findFirst({
            where: { subnet: netuid },
        });

        let savedSubnet;

        if (existingNETUID) {
            if (netuid === existingNETUID.subnet) {
                savedSubnet = await prisma.subnets.delete({
                    where: { id: existingNETUID.id },
                });
            }
        } 

        return NextResponse.json({ subnet: savedSubnet }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete subnet' }, { status: 500 });
    }
}
