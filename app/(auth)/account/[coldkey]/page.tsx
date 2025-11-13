'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher'
import ImageLoadingSpinner from '@/components/ImageLoadingSpinner'
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Active, Validator } from '@/components/MinerIcon'
import { copyKey, showKey, showNumber } from '@/lib/main'

const AccountPage = () => {
    const router = useRouter()
    const params = useParams();
    const [sortKey, setSortKey] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const { data, error, isLoading } = useSWR(`/api/getAccount?coldkey_address=${params.coldkey}`, fetcher, {
        refreshInterval: 12_000,
        revalidateOnFocus: false, // optional: prevent refetch on tab focus
    })

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const renderSortIcon = (key: string) => {
        if (sortKey !== key) return null;
        return sortOrder === "asc" ? <ArrowUp size={14} className="inline ml-1" /> : <ArrowDown size={14} className="inline ml-1" />;
    };

    const sortNeurons = (neurons: any[]) => {
        if (!sortKey) return neurons;
        
        return [...neurons].sort((a: any, b: any) => {
            const dir = sortOrder === "asc" ? 1 : -1;
            switch (sortKey) {
                case "uid":
                    return dir * (a.uid - b.uid);
                case "stakeWeights":
                    return dir * (a.total_stake.rao - b.total_stake.rao);
                case "vTrust":
                    return dir * (a.validator_trust - b.validator_trust);
                case "trust":
                    return dir * (a.trust - b.trust);
                case "consensus":
                    return dir * (a.consensus - b.consensus);
                case "incentive":
                    return dir * (a.incentive - b.incentive);
                case "dividens":
                    return dir * (a.dividends - b.dividends);
                case "emission":
                    return dir * (a.emission - b.emission);
                case "updated":
                    return dir * (a.last_update.localeCompare(b.last_update));
                case "axon":
                    const axonA = `${a.axon_info.ip}${a.axon_info.port ? `:${a.axon_info.port}` : ''}`;
                    const axonB = `${b.axon_info.ip}${b.axon_info.port ? `:${b.axon_info.port}` : ''}`;
                    return dir * axonA.localeCompare(axonB);
                case "hotkey":
                    return dir * a.hotkey.localeCompare(b.hotkey);
                case "coldkey":
                    return dir * a.coldkey.localeCompare(b.coldkey);
                case "daily":
                    return dir * (a.emission * 20 - b.emission * 20);
                default:
                    return 0;
            }
        });
    };
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
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('uid')}>
                                                            UID {renderSortIcon('uid')}
                                                        </th>
                                                        <th className='text-center py-3'>Type</th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('stakeWeights')}>
                                                            Stake Weights {renderSortIcon('stakeWeights')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('vTrust')}>
                                                            VTrust {renderSortIcon('vTrust')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('trust')}>
                                                            Trust {renderSortIcon('trust')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('consensus')}>
                                                            Consensus {renderSortIcon('consensus')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('incentive')}>
                                                            Incentive {renderSortIcon('incentive')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('dividens')}>
                                                            Dividens {renderSortIcon('dividens')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('emission')}>
                                                            Emission{"("}p{")"} {renderSortIcon('emission')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('updated')}>
                                                            Updated {renderSortIcon('updated')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('axon')}>
                                                            Axon {renderSortIcon('axon')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('hotkey')}>
                                                            Hotkey {renderSortIcon('hotkey')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('coldkey')}>
                                                            Coldkey {renderSortIcon('coldkey')}
                                                        </th>
                                                        <th className='text-center py-3 cursor-pointer hover:bg-slate-600 transition-colors' onClick={() => handleSort('daily')}>
                                                            Daily {renderSortIcon('daily')}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        sortNeurons(subnets.neurons).map((miner: any, index: number) => (
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