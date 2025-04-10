import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export const revalidate = 0;
import axios from 'axios';
export async function GET() {
    const data = []
    const subnets_res = await axios.get('https://taomarketcap.com/api/subnets')
    const subnets = await subnets_res.data
    console.log("Length: ", subnets.length)
    const subnets_slice = subnets.slice(50, subnets.length)
    try {
        for(const subnet of subnets_slice) {
            const response = await axios.post(`https://taomarketcap.com/api/subnets/${subnet.subnet}/burn`)
            const response_data = await response.data;
            const res = {
                netuid: subnet.subnet,
                name: subnet.name,
                letter: subnet.letter,
                registrationCost: [response_data[response_data.length-3].value, response_data[response_data.length-2].value, response_data[response_data.length-1].value]
            }
            data.push(res)
        }
        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    }
}
