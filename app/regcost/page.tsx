'use client'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner';
import { showNumber } from '@/lib/main';
import { fetcher } from '@/utils/fetcher';
import React from 'react'
import useSWR from 'swr';


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
                <div className='text-2xl font-bold text-center'>My Status</div>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-slate-700'>
                            <th className='text-center py-2'>NetUID</th>
                            <th className='text-center py-2'>Registration Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.data && data.data.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className='text-center py-2'>{item.netuid}</td>
                                    <td className='text-center py-2'>{showNumber(item.registrationCost[0], 5)}, {showNumber(item.registrationCost[1], 5)}, {showNumber(item.registrationCost[2], 5)}</td>
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