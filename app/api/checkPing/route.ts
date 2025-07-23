import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { axon } = await req.json();
    console.log({ axon });

    const controller = new AbortController();
    const timeout = 3000; // 3 seconds timeout

    const timer = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const res = await fetch(`http://${axon}`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timer); // Stop the timeout
        const status = res.statusText ? 1 : -1;
        console.log({ status });

        return NextResponse.json({ status }, { status: 200 });
    } catch (error: any) {
        clearTimeout(timer);

        if (error.name === 'AbortError') {
            console.error('⏱️ Timeout fetching:', axon);
        } else {
            console.error('❌ Fetch error:', error);
        }

        return NextResponse.json({ status: -1 }, { status: 200 });
    }
}
