'use client'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { fetcher } from '@/utils/fetcher'
import React from 'react'
import useSWR from 'swr'

const DistributionPage = () => {
    const { data, error, isLoading } = useSWR('/api/getSubnetsPrice', fetcher);
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
                <div className='text-2xl font-bold text-center'>Registration</div>
                <div className='flex flex-col gap-10 w-full'>
                    {
                        data && data.result_data.length > 0 && data.result_data.map((item: any) => (
                            <div className='flex flex-col gap-5 items-center justify-center w-full'>
                                <div className='bg-slate-700 flex flex-row justify-between py-2 px-3 w-full'>
                                    <div className='text-lg'>Subnet {item.netuid}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default DistributionPage