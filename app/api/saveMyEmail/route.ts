import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { name, email } = await req.json();
    // Validate input
    if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Invalid data value' }, { status: 400 });
    }

    try {
        const savedEmail = await prisma.myEmail.create({
            data: { 
                email, 
            },
        });

        return NextResponse.json({ email: savedEmail }, { status: 200 });
    } catch (error) {
        console.error('Error saving email:', error);
        return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
    }
}
