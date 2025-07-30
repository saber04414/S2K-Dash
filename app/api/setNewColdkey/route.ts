import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { name, coldkey, ghost } = await req.json();
    // Validate input
    if (!name || typeof name !== 'string' || !coldkey || typeof coldkey !== 'string') {
        return NextResponse.json({ error: 'Invalid name or coldkey value' }, { status: 400 });
    }
    console.log({ name, coldkey, ghost })
    try {
        // Check if uid already exists
        const existingColdkey = await prisma.coldkey.findFirst({
            where: { coldkey },
        });

        let savedColdkey;

        if (existingColdkey) {
            return NextResponse.json({ coldkey: existingColdkey }, { status: 409 });
        } else {
            // Create new coldkey entry
            savedColdkey = await prisma.coldkey.create({
                data: { name, coldkey, ghost },
            });
        }

        return NextResponse.json({ coldkey: savedColdkey }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}
