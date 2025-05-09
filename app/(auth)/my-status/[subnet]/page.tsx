'use client'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import { showKey, copyKey, showNumber, showTaoNumber, showTimestampToDateTime } from '@/lib/main'
import { Immune, Active, Danger } from '@/components/MinerIcon'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const MyStatusPage = () => {
    const router = useRouter()
    const params = useParams();
    const { data, error, isLoading } = useSWR(`/api/myStatus?subnet=${params.subnet}`, fetcher, {
        refreshInterval: 12_000,
        revalidateOnFocus: false, // optional: prevent refetch on tab focus
    })
    const [incentive_countdowns, setIncentiveCountdowns] = useState(0)
    const [registration_countdowns, setRegistrationCountdowns] = useState(0)

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
                prev - 1
            );
            setRegistrationCountdowns(prev =>
                prev - 1
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
        console.log({ data })
        return (
            <div className='w-full flex flex-col gap-10 justify-center relative'>
                <div className='absolute top-0 left-0 w-fit text-center p-2 cursor-pointer flex flex-row gap-2 items-center' onClick={() => router.back()}><ArrowLeft size={18} />Back</div>
                <div className='text-2xl font-bold text-center'>My Status</div>
                <div className='flex flex-col gap-10'>
                    {
                        data && data.data && data.bittensor_data && (
                            <div className='flex flex-col gap-1'>
                                <div className='flex flex-row justify-between items-end'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className='text-xl text-semibold text-left underline cursor-pointer'>Subnet {data.data.subnet}</div>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className='border-slate-500 border'>
                                                <div className='flex flex-col gap-2'>
                                                    <div className='text-base font-bold'>Subnet Information</div>
                                                    <div className='flex flex-col gap-0'>
                                                        <div className='text-sm'>Name: {data.data.name} {data.data.letter}</div>
                                                        <div className='text-sm'>Emission: {showNumber(data.data.emission, 4)} %</div>
                                                        <div className='text-sm'>Tao In Pool: {showTaoNumber(data.data.taoInpool)} 𝞃</div>
                                                        <div className='text-sm'>Alpha In Pool: {showTaoNumber(data.data.alphaInpool)} 𝞃</div>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <div className='flex flex-row gap-5 items-center'>
                                        <div className='text-sm pr-5'>Alpha: {showNumber(data.data.price, 4)} 𝞃 / {showNumber(data.data.price * data.taoPrice, 4)} $</div>
                                        <div className='text-sm pr-5'>Registration: {showNumber(data.data.regcost, 4)} 𝞃</div>

                                        <div className='text-sm pr-5'>Mechanism: {incentive_countdowns === -1
                                            ? '-1'
                                            : `${Math.floor(incentive_countdowns / 3600)}h ${Math.floor((incentive_countdowns % 3600) / 60)}m ${incentive_countdowns % 60}s`
                                        }</div>
                                        <div className='text-sm pr-5'>Registration: {registration_countdowns === -1
                                            ? '-1'
                                            : `${Math.floor(registration_countdowns / 3600)}h ${Math.floor((registration_countdowns % 3600) / 60)}m ${registration_countdowns % 60}s`
                                        }</div>
                                    </div>
                                </div>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-slate-700'>
                                            <th className='text-center py-2'>No</th>
                                            <th className='text-center py-2'>UID</th>
                                            <th className='text-center py-2'>Register At</th>
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
                                            data.data && data.data.mydata && data.data.mydata && data.data.mydata.map((item: any, index: number) => (
                                                <tr key={index} className='hover:bg-slate-600 transition-all cursor-pointer'>
                                                    <td className='text-center py-2'>{index + 1}</td>
                                                    <td className='text-center py-2'>{item.uid}</td>
                                                    <td className='text-center py-2'>{showTimestampToDateTime(item.registeredAt)}</td>
                                                    <td className='text-center py-2'>{item.danger == null && (item.immunityPeriod > 0 ? <Immune /> : <Active />)} {item.danger != null ? <span className='text-red-500 text-sm flex flex-row justify-center items-center gap-1'><Danger /> -{item.danger.ranking}</span> : null}</td>
                                                    <td className='text-center py-2'>{showNumber(item.stake * data.data.price, 2)} 𝞃 / {showNumber(item.stake, 2)} {data.data.letter}</td>
                                                    <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.coldkey)}>{showKey(item.coldkey)}</td>
                                                    <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.hotkey)}>{showKey(item.hotkey)}</td>
                                                    <td className='text-center py-2'>{showNumber(item.incentive, 2)}</td>
                                                    <td className='text-center py-2'>{showNumber(item.minerPerformance, 2)}</td>
                                                    <td className='text-center py-2'>{showNumber(item.alphaPerDay * data.data.price, 3)} 𝞃 / {showNumber(item.alphaPerDay, 3)} {data.data.letter}</td>
                                                </tr>
                                            ))
                                        }
                                        <tr>
                                            <td colSpan={10}><div className='h-[2px] w-full bg-slate-700'></div></td>
                                        </tr>
                                        <tr>
                                            <td className='text-center py-2'>Total</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-center py-2'>{showNumber(data.data.total_stake * data.data.price, 2)} 𝞃 / {showNumber(data.data.total_stake, 2)} {data.data.letter} {`( $ ${showNumber(data.data.total_stake / data.taoPrice, 2)} )`}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className='text-center py-2'>{showNumber(data.data.total_daily * data.data.price, 2)} 𝞃 / {showNumber(data.data.total_daily, 2)} {data.data.letter} {`( $ ${showNumber(data.data.total_daily / data.taoPrice, 2)} )`}</td>
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

export default MyStatusPage