"use client"
import React from 'react'
import clsx from 'clsx'
import { copyKey, showKey, showNumber, diffblockToTime } from '@/lib/main'
import { Active, Danger, Immune } from './MinerIcon'
import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
type AxonStatus = {
    axon: string,
    status: number
}
type Props = {
    index: number,
    item: any,
    data: any,
    currency: string,
    blur: boolean,
    axons: AxonStatus[]
}

const StatusTr = (props: Props) => {
    const [immune, setImmune] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const { index, item, data, currency, blur, axons } = props

    const unstake = async (coldkey: string, hotkey: string, netuid: string, amount: number) => {
        setLoading(true)
        await axios.post("/api/unstake", { coldkey_address: coldkey, hotkey_address: hotkey, netuid: netuid, amount: amount }).then(() => {
            toast.success("Successfully unstaked")
        }).catch((e) => {
            setLoading(false)
            console.log({ e })
            toast.error("Failed to unstake")
        });
        setLoading(false)
    }
    const formatDHMS = (seconds: number): string => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }

    return (
        <tr key={index} className={clsx('transition-all cursor-pointer', index % 2 === 0 ? '' : 'bg-slate-700')}>
            <td className='text-center py-2'>{index + 1}</td>
            <td className={clsx('text-center py-2', blur ? 'blur-sm' : 'blur-none')}>{item.uid}</td>
            <td className='text-center py-2'>{diffblockToTime(item.registration_block_time)}</td>
            <td className='text-center py-2'>{item.danger == null && (item.block_number - item.block_at_registration < item.immunity_period ? <div className='flex flex-row gap-1 items-center justify-center'>
                <div onClick={() => setImmune(!immune)}><Immune /></div>
                {immune && <span className='text-sm'>{formatDHMS((item.immunity_period + item.block_at_registration - item.block_number) * 12)}</span>}</div>
                : <Active />)} {item.danger != null ? <span className='text-red-500 text-sm flex flex-row justify-center items-center gap-1'><Danger /> -{item.danger.ranking}</span> : null}</td>
            {
                currency === 'TAO' ?
                    <td className='text-center py-2'>{showNumber(item.alpha_stake / 1e9 * data.data.price, 2)} 𝞃 / {showNumber(item.alpha_stake / 1e9, 2)} {data.data.letter}</td> :
                    <td className='text-center py-2'>{showNumber(item.alpha_stake / 1e9 * data.data.price * data.taoPrice, 2)} $ / {showNumber(item.alpha_stake / 1e9, 2)} {data.data.letter}</td>
            }
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.coldkey)}>{showKey(item.coldkey)}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.hotkey)}>{showKey(item.hotkey)}</td>
            <td className='text-center py-2'>{showNumber(item.incentive, 4)}</td>
            <td className='text-center py-2'>{showNumber(item.miner_performance, 2)}</td>
            <td className='text-center py-2'>{item.axon}</td>
            <td className="text-center py-2">
                {
                    (() => {
                        const match = axons.find((items: AxonStatus) => items.axon === item.axon);
                        if (!match) return '❓';          // Not found
                        if (match.status === 1) return '🟢'; // Online
                        if (match.status === 0) return ''; // Offline
                        if (match.status === -1) return '🔴'; // Offline
                        return '⚪';                      // Unknown
                    })()
                }
            </td>

            {
                currency === 'TAO' ?
                    <td className='text-center py-2'>{showNumber(item.emission * 20 * data.data.price, 3)} 𝞃 / {showNumber(item.emission * 20, 3)} {data.data.letter}</td> :
                    <td className='text-center py-2'>{showNumber(item.emission * 20 * data.data.price * data.taoPrice, 3)} $ / {showNumber(item.emission * 20, 3)} {data.data.letter}</td>
            }
            <td className='text-center py-2'>
                <button className={item.alpha_stake / 1e9 != 0 ? 'px-2 py-1 rounded-md hover:bg-slate-600 transition-all cursor-pointer' : 'px-2 py-1 rounded-md cursor-not-allowed'} onClick={() => unstake(item.coldkey, item.hotkey, data.data.subnet, item.stake)}>{loading ? <LoaderCircle className='animate-spin' /> : 'Unstake'}</button>
            </td>
        </tr>
    )
}

export default StatusTr