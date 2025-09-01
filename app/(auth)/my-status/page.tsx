'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import SubnetItem from '@/components/SubnetItem'

const MySubnetsPage = () => {
    const { data, error, isLoading } = useSWR(`/api/mySubnetList`, fetcher, {
        refreshInterval: 36_000,
        revalidateOnFocus: false, // optional: prevent refetch on tab focus
    })

    if (isLoading) return <div className='w-full h-full'>
        <ImageLoadingSpinner />
    </div>
    if (error) return <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
        <img src="/mark.png" className='w-32 h-24' alt='' />
        Data Fetching Error
    </div>
    if (data) {
        console.log(data)
        return (
            <div className='w-full flex flex-col gap-5 justify-center'>
                <div className='text-2xl font-bold text-center'>My Main Subnets</div>
                <div className='flex justify-center items-center w-full'>
                    <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-8 w-full'>
                        {
                            data && data.data && data.data.map((subnet: any, index: number) => (
                                // <SubnetItem key={index} {...subnet} />
                                <SubnetItem key={index} subnet={subnet} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default MySubnetsPage