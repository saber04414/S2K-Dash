'use client'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner';
import { showTimestampToDateTime, showNumber } from '@/lib/main';
import { fetcher } from '@/utils/fetcher';
import React from 'react'
import useSWR from 'swr';
import { LineChart, Line, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        console.log("Time: ", payload[0])
        return (
            <div className="bg-black/60 border-white/5 shadow-md p-2 rounded text-xs">
                <p className="font-semibold">Time: {showTimestampToDateTime(payload[0].payload.timestamp)}</p>
                <p className="text-white">Cost: {showNumber(payload[0].payload.value, 5)}</p>
            </div>
        );
    }

    return null;
};


const RegCostPage = () => {
    const { data, error, isLoading } = useSWR('/api/getRegistrationCost', fetcher, { revalidateOnFocus: false });
    if (isLoading) return <div className='w-full h-full'>
        <ImageLoadingSpinner />
    </div>
    if (error) return <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
        <img src="/mark.png" className='w-32 h-24' alt='' />
        Data Fetching Error
    </div>
    if (data) {
        console.log({ data })
        return (
            <div className='w-full flex flex-col gap-5 justify-center'>
                <div className='text-2xl font-bold text-center'>Reg Cost History</div>
                <table className='w-full table-auto'>
                    <thead>
                        <tr className='bg-slate-700'>
                            <th className='text-center py-2'>NetUID</th>
                            <th className='text-center py-2'>Registration Cost</th>
                            <th className='text-center py-2'>History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.data && data.data.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className='text-center py-2'>{item.netuid}</td>
                                    <td className='text-center py-2'>{showNumber(item.registrationCost[item.registrationCost.length - 1].value, 5)}</td>
                                    <td className='flex flex-row justify-center'>
                                        <LineChart
                                            width={250}
                                            height={50}
                                            data={item.registrationCost}
                                            margin={{
                                                top: 10,
                                                right: 0,
                                                left: 0,
                                                bottom: 10,
                                            }}
                                        >
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line type="monotone" dataKey="value" stroke={
                                                item.registrationCost?.[item.registrationCost.length - 1]?.value >
                                                    item.registrationCost?.[0]?.value
                                                    ? '#22c55e' // green for increase
                                                    : '#ef4444' // red for decrease
                                            } activeDot={false} dot={false} />
                                        </LineChart>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default RegCostPage