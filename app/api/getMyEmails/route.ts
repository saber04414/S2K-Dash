import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET() {
    const emails = await prisma.myEmail.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ myemails: emails }, { status: 201 });
}
