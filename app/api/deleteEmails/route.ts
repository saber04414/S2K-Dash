import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function POST(req: Request) {
    try {
        const { ids } = await req.json();
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Invalid IDs provided' }, { status: 400 });
        }

        await prisma.clientEmail.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return NextResponse.json({ success: true, message: 'Emails deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting emails:', error);
        return NextResponse.json({ error: 'Failed to delete emails' }, { status: 500 });
    }
}

