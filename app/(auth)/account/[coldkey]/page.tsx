'use client'
import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Active, Validator } from '@/components/MinerIcon'
import { copyKey, showKey, showNumber } from '@/lib/main'

const AccountPage = () => {
    const router = useRouter()
    const params = useParams();
    const { data, error, isLoading } = useSWR(`/api/getAccount?coldkey_address=${params.coldkey}`, fetcher, {
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
                <div className='text-2xl font-bold text-center'>Account</div>
                {
                    data && data.data && data.data.numMiner && (
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row w-[650px] py-3 px-4 rounded-xl text-white bg-slate-800 gap-3'>Coldkey: <span>{params.coldkey}</span></div>
                                <div className='flex flex-row w-[650px] py-3 px-4 rounded-xl text-white bg-slate-800 gap-3'>Neurons: <span>{data.data.numMiner}</span></div>
                                <div className='flex flex-row w-[650px] py-3 px-4 rounded-xl text-white bg-slate-800 gap-3'>Daily Alpha: <span>{showNumber(data.total_daily_dtao, 2)}  {'/'} {showNumber(data.total_daily, 2)} {'𝞃   /   '} ${showNumber(data.total_daily_usd, 2)}</span></div>
                                <div className='flex flex-row w-[650px] py-3 px-4 rounded-xl text-white bg-slate-800 gap-3'>Subnets: <div className='flex flex-row gap-2'>{data.data.data.map((item: any) => <div>{item.netuid}</div>)}</div></div>
                            </div>
                            <div className='flex flex-col gap-10'>
                                {
                                    data.data.data.map((subnets: any) => (
                                        <div className='flex flex-col gap-2'>
                                            <div className='text-xl flex flex-row gap-5 items-center'><span className='underline'>Subnet {subnets.netuid}</span> <span className='text-slate-700 text-[14px]'>{"( "}{subnets.neuron_count} miners{" )"}</span></div>
                                            <table className='w-full'>
                                                <thead>
                                                    <tr className='bg-slate-700'>
                                                        <th className='text-center py-3'>UID</th>
                                                        <th className='text-center py-3'>Type</th>
                                                        <th className='text-center py-3'>Stake Weights</th>
                                                        <th className='text-center py-3'>VTrust</th>
                                                        <th className='text-center py-3'>Trust</th>
                                                        <th className='text-center py-3'>Consensus</th>
                                                        <th className='text-center py-3'>Incentive</th>
                                                        <th className='text-center py-3'>Dividens</th>
                                                        <th className='text-center py-3'>Emission{"("}p{")"}</th>
                                                        <th className='text-center py-3'>Updated</th>
                                                        <th className='text-center py-3'>Axon</th>
                                                        <th className='text-center py-3'>Hotkey</th>
                                                        <th className='text-center py-3'>Coldkey</th>
                                                        <th className='text-center py-3'>Daily</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        subnets.neurons.map((miner: any, index: number) => (
                                                            <tr key={index} className={clsx('transition-all', index % 2 === 0 ? '' : 'bg-slate-800')}>
                                                                <td className='text-center py-3'>{miner.uid}</td>
                                                                <td className='text-center'>{miner.validator_permit ? <Validator /> : <Active />}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.total_stake.rao / 1e9, 2)}</td>
                                                                <td className='text-center py-3'>{miner.validator_trust}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.trust, 2)}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.consensus, 2)}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.incentive, 2)}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.dividends, 2)}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.emission, 2)}</td>
                                                                <td className='text-center py-3'>{miner.last_update}</td>
                                                                <td className='text-center py-3'>{miner.axon_info.ip}{miner.axon_info.port ? <span>{":"} {miner.axon_info.port}</span> : ''}</td>
                                                                <td className='text-center py-3 cursor-pointer' onClick={() => copyKey(miner.hotkey)}>{showKey(miner.hotkey)}</td>
                                                                <td className='text-center py-3 cursor-pointer' onClick={() => copyKey(miner.coldkey)}>{showKey(miner.coldkey)}</td>
                                                                <td className='text-center py-3'>{showNumber(miner.emission * 20, 2)}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default AccountPage