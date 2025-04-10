'use client'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import MinersChart from '@/components/MinersChart'
import { showNumber } from '@/lib/main'
import { fetcher } from '@/utils/fetcher'
import React from 'react'
import useSWR from 'swr'

const DistributionPage = () => {
    const { data, error, isLoading } = useSWR('/api/getDistributions', fetcher);
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
                <div className='text-2xl font-bold text-center'>Distribution</div>
                <div className='flex flex-col gap-10 w-full'>
                    {
                        data && data.result_data.length > 0 && data.result_data.map((item: any, index: number) => (
                            <div className='flex flex-col gap-5 items-center justify-center w-full' key={index}>
                                <div className='bg-slate-700 flex flex-row justify-between py-2 px-3 w-full'>
                                    <div className='text-lg'>Subnet {item.netuid} <span className='text-sm'>{`(${item.name} ${item.letter})`}</span></div>
                                    <div className='flex flex-row gap-2 text-sm items-center'>
                                        <span className=''>Price : {showNumber(item.price, 5)} 𝞃</span>
                                    </div>
                                </div>
                                <MinersChart chartData={item.chartData} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default DistributionPage