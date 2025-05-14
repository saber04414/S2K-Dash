'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import AssetTr from '@/components/AssetTr'

const AssetPage = () => {
    const router = useRouter()
    const params = useParams();
    const { data, error, isLoading } = useSWR(`/api/getAssetList?coldkey_address=${params.asset}`, fetcher, {
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
        console.log({ data })
        return (
            <div className='w-full flex flex-col gap-10 justify-center relative'>
                <div className='absolute top-0 left-0 w-fit text-center p-2 cursor-pointer flex flex-row gap-2 items-center' onClick={() => router.back()}><ArrowLeft size={18} />Back</div>
                <div className='text-2xl font-bold text-center'>Asset</div>
                <div className='flex flex-col gap-10'>
                    {
                        data && data.data && data.price && (
                            <div className='flex flex-col gap-1'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-slate-700'>
                                            <th className='text-center py-2'>No</th>
                                            <th className='text-center py-2'>Coldkey</th>
                                            <th className='text-center py-2'>Hotkey</th>
                                            <th className='text-center py-2'>Status</th>
                                            <th className='text-center py-2'>Netuid</th>
                                            <th className='text-center py-2'>Stake</th>
                                            <th className='text-center py-2'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data && data.data.alpha_balance && data.data.alpha_balance.map((item: any, index: number) => (
                                                <AssetTr key={index} index={index} item={item} price={data.price} />
                                            ))
                                        }
                                        <tr>
                                            <td colSpan={7}><div className='h-[2px] w-full bg-slate-700'></div></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default AssetPage