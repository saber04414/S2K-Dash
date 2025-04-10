"use client"
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import axios from 'axios'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'

const BoardPage = () => {
    const { data, error, isLoading } = useSWR('/api/getTaoXNet', fetcher)
    const handleRowClick = async (item: any) => {
        const res = await axios.post('/api/getExtrinsic', { hotkey: item.hotkey })
        console.log(res)
    }
    if (isLoading) return <div className='w-full h-full'>
        <ImageLoadingSpinner />
    </div>
    if (error) return <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
        <img src="/mark.png" className='w-32 h-24' alt='' />
        Data Fetching Error
    </div>
    if (data) {
        // const filteredData = useMemo(() => {
        //     if(uid && coldkey) {
        //         return data.res.filter((item: any) => item.uid === uid || item.coldkey === coldkey)
        //     } else if(uid) {
        //         return data.res.filter((item: any) => item.uid === uid)
        //     } else if(coldkey) {
        //         return data.res.filter((item: any) => item.coldkey === coldkey)
        //     } else {
        //         return data.res
        //     }
        // }, [data, uid, coldkey])
        return (
            <div className='w-full flex flex-col gap-3'>
                <div className='flex flex-row gap-5 w-fit px-16'>
                    <input type="text" placeholder='UID' className='w-[150px] px-1 py-2 text-sm rounded-md' />
                    <input type="text" placeholder='Coldkey' className='w-[300px] px-1 py-2 text-sm rounded-md' />
                </div>
                <table className='w-full table-auto'>
                    <thead>
                        <tr>
                            <th className='text-center py-1'>UID</th>
                            <th className='text-center py-1'>Stake</th>
                            <th className='text-center py-1'>Hotkey</th>
                            <th className='text-center py-1'>Coldkey</th>
                            <th className='text-center py-1'>Tao/Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.res && data.res.map((item: any, index: number) => (
                                <>
                                    <tr key={index} className='cursor-pointer' onClick={() => handleRowClick(item)}>
                                        <td className='text-center py-1'>{item.uid}</td>
                                        <td className='text-center py-1'>{item.stake}</td>
                                        <td className='text-center py-1'>{item.hotkey}</td>
                                        <td className='text-center py-1'>{item.coldkey}</td>
                                        <td className='text-center py-1'>{item.taoPerDay}</td>
                                    </tr>
                                </>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default BoardPage