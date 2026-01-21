import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, secretPassword } = await req.json();
    // Validate input
    if (!email || typeof email !== 'string' || !secretPassword || typeof secretPassword !== 'string') {
        return NextResponse.json({ error: 'Invalid data value' }, { status: 400 });
    }

    try {
        const savedEmail = await prisma.myEmail.create({
            data: { 
                email,
                secretPassword,
            },
        });

        return NextResponse.json({ myemail: savedEmail }, { status: 200 });
    } catch (error) {
        console.error('Error saving email:', error);
        return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
    }
}
