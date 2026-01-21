import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sender = searchParams.get('sender');

        // Get all client emails that haven't been sent yet (sender is null or empty)
        let whereClause: any = {
            OR: [
                { sender: null },
                { sender: '' }
            ]
        };

        // If sender parameter is provided, filter by sender
        if (sender) {
            whereClause = {
                sender: sender
            };
        }

        const emails = await prisma.clientEmail.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ emails }, { status: 200 });
    } catch (error) {
        console.error('Error fetching send emails:', error);
        return NextResponse.json({ error: 'Failed to fetch send emails' }, { status: 500 });
    }
}

