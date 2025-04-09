"use client"
import { fetcher } from '@/utils/fetcher'
import React from 'react'
import useSWR from 'swr'
import { showNumber } from '@/lib/main'

const PriceBar = () => {
    const { data, error, isLoading } = useSWR('/api/getPrice', fetcher, { revalidateOnFocus: false, revalidateOnReconnect: false, revalidateOnBlur: false, revalidateIfStale: false, revalidateOnWindowFocus: false, refreshInterval: 1000 })
    if (isLoading) return <div className='w-full h-full'>
        ...
    </div>
    if (error) return <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
        <img src="/mark.png" className='w-32 h-24' alt='' />
        Data Fetching Error
    </div>
    if (data) {
        return (
            <div className='w-full flex flex-col gap-1 items-center text-sm'>
                {data && data.length > 0 && data.map((item: any) => (
                    <span key={item.name}>{item.name}: ${showNumber(item.price, 5)}</span>
                ))}
            </div>
        )
    }
}

export default PriceBar