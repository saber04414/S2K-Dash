import {  NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export const revalidate = 0;
export async function GET() {
  try {
    const response = await fetch("https://api.dev.taomarketcap.com/internal/v1/subnets/?limit=129neurons/50/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
  }
}
