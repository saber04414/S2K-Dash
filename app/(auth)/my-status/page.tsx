'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { useRouter } from 'next/navigation'

const MySubnetsPage = () => {
    const router = useRouter()
    const { data, error, isLoading } = useSWR(`/api/mySubnetList`, fetcher, {
        refreshInterval: 12_000,
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
                    <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-8 w-full'>
                        {
                            data && data.subnets && data.subnets.map((subnet: any, index: number) => (
                                <div key={index} className='w-full cursor-pointer border text-center border-slate-500 rounded-2xl p-4 hover:bg-slate-500 hover:text-white' onClick={()=>router.push(`/my-status/${subnet}`)}>Subnet {subnet}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default MySubnetsPage