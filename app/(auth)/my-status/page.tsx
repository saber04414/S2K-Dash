'use client'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { showKey, copyKey, showNumber } from '@/lib/main'
import { Immune, Active } from '@/components/MinerIcon'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'

const MyStatusPage = () => {
    const { data, error, isLoading } = useSWR(`/api/myStatus`, fetcher, {
        refreshInterval: 12_000,
        revalidateOnFocus: false, // optional: prevent refetch on tab focus
    })
    const [incentive_countdowns, setIncentiveCountdowns] = useState<number[]>([])
    const [registration_countdowns, setRegistrationCountdowns] = useState<number[]>([])

    useEffect(() => {
        if (data?.bittensor_data) {
            const newIncentiveCountdowns = data.bittensor_data.incentive_res.map((t: any) =>
                t.hour === -1 ? -1 : t.hour * 3600 + t.minute * 60 + t.second
            );
            setIncentiveCountdowns(newIncentiveCountdowns);
            const newRegistrationCountdowns = data.bittensor_data.registration_res.map((t: any) =>
                t.hour === -1 ? -1 : t.hour * 3600 + t.minute * 60 + t.second
            );
            setRegistrationCountdowns(newRegistrationCountdowns);
        }
    }, [data]);

    useEffect(() => {
        const timer = setInterval(() => {
            setIncentiveCountdowns(prev =>
                prev.map(sec => (sec > 0 ? sec - 1 : sec))
            );
            setRegistrationCountdowns(prev =>
                prev.map(sec => (sec > 0 ? sec - 1 : sec))
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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
                <div className='text-2xl font-bold text-center'>My Status</div>
                <div className='flex flex-col gap-10'>
                    {
                        data && data.data.length > 0 && data.bittensor_data && data.data.map((item: any, index: number) => (
                            <div key={index} className='flex flex-col gap-2 w-full'>
                                <div className='flex flex-row justify-between items-end'>
                                    <div className='text-xl text-semibold text-left underline'>Subnet {item.subnet}</div>
                                    <div className='flex flex-row gap-5 items-center'>
                                        <div className='text-sm pr-5'>Mechanism: {incentive_countdowns[index] === -1
                                            ? '-1'
                                            : `${Math.floor(incentive_countdowns[index] / 3600)}h ${Math.floor((incentive_countdowns[index] % 3600) / 60)}m ${incentive_countdowns[index] % 60}s`
                                        }</div>
                                        <div className='text-sm pr-5'>Registration: {registration_countdowns[index] === -1
                                            ? '-1'
                                            : `${Math.floor(registration_countdowns[index] / 3600)}h ${Math.floor((registration_countdowns[index] % 3600) / 60)}m ${registration_countdowns[index] % 60}s`
                                        }</div>
                                    </div>
                                </div>
                                <table key={index} className='w-full'>
                                    <thead>
                                        <tr className='bg-slate-700'>
                                            <th className='text-center py-2'>No</th>
                                            <th className='text-center py-2'>UID</th>
                                            <th className='text-center py-2'>Status</th>
                                            <th className='text-center py-2'>Stake</th>
                                            <th className='text-center py-2'>Coldkey</th>
                                            <th className='text-center py-2'>Hotkey</th>
                                            <th className='text-center py-2'>Incentive</th>
                                            <th className='text-center py-2'>Performance</th>
                                            <th className='text-center py-2'>Daily</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            item && item.mydata && item.mydata.map((subitem: any, subindex: number) => (
                                                <tr key={subindex}>
                                                    <td className='text-center py-2'>{subindex + 1}</td>
                                                    <td className='text-center py-2'>{subitem.uid}</td>
                                                    <td className='text-center py-2'>{subitem.immunityPeriod > 0 ? <Immune /> : <Active />}</td>
                                                    <td className='text-center py-2'>{showNumber(subitem.stake * item.price, 2)} 𝞃 / {showNumber(subitem.stake, 2)} {item.letter}</td>
                                                    <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(subitem.coldkey)}>{showKey(subitem.coldkey)}</td>
                                                    <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(subitem.hotkey)}>{showKey(subitem.hotkey)}</td>
                                                    <td className='text-center py-2'>{showNumber(subitem.incentive, 2)}</td>
                                                    <td className='text-center py-2'>{showNumber(subitem.minerPerformance, 2)}</td>
                                                    <td className='text-center py-2'>{showNumber(subitem.alphaPerDay * item.price, 3)} 𝞃 / {showNumber(subitem.alphaPerDay, 3)} {item.letter}</td>
                                                </tr>
                                            ))
                                        }
                                        <tr>
                                            <td colSpan={9}><div className='h-[2px] w-full bg-slate-700'></div></td>
                                        </tr>
                                        <tr>
                                            <td className='text-center py-2'>Total</td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-center py-2'>{showNumber(item.total_stake * item.price, 2)} 𝞃 / {showNumber(item.total_stake, 2)} {item.letter}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-center py-2'>{showNumber(item.total_daily * item.price, 2)} 𝞃 / {showNumber(item.total_daily, 2)} {item.letter}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default MyStatusPage