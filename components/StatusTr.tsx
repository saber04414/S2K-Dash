"use client"
import React from 'react'
import clsx from 'clsx'
import { copyKey, showKey, showNumber, showTimestampToDateTime } from '@/lib/main'
import { Active, Danger, Immune } from './MinerIcon'
import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
type Props = {
    index: number,
    item: any,
    data: any,
    currency: string,
    blur: boolean,
}

const StatusTr = (props: Props) => {
    const [loading, setLoading] = React.useState(false)
    const { index, item, data, currency, blur } = props

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
    return (
        <tr key={index} className={clsx('transition-all cursor-pointer', index % 2 === 0 ? '' : 'bg-slate-700')}>
            <td className='text-center py-2'>{index + 1}</td>
            <td className={clsx('text-center py-2', blur ? 'blur-sm': 'blur-none')}>{item.uid}</td>
            <td className='text-center py-2'>{showTimestampToDateTime(item.registration_block_time)}</td>
            <td className='text-center py-2'>{item.danger == null && (item.block_number - item.block_at_registration < item.immunity_period ? <Immune /> : <Active />)} {item.danger != null ? <span className='text-red-500 text-sm flex flex-row justify-center items-center gap-1'><Danger /> -{item.danger.ranking}</span> : null}</td>
            {
                currency === 'TAO' ?
                <td className='text-center py-2'>{showNumber(item.stake * data.data.price, 2)} 𝞃 / {showNumber(item.stake, 2)} {data.data.letter}</td> :
                <td className='text-center py-2'>{showNumber(item.stake * data.data.price * data.taoPrice, 2)} $ / {showNumber(item.stake, 2)} {data.data.letter}</td>
            }
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.owner)}>{showKey(item.owner)}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.hotkey)}>{showKey(item.hotkey)}</td>
            <td className='text-center py-2'>{showNumber(item.incentive, 4)}</td>
            <td className='text-center py-2'>{showNumber(item.miner_performance, 2)}</td>
            <td className='text-center py-2'>{item.ip}</td>
            {
                currency === 'TAO' ?
                <td className='text-center py-2'>{showNumber(item.alpha_per_day * data.data.price, 3)} 𝞃 / {showNumber(item.alpha_per_day, 3)} {data.data.letter}</td> :
                <td className='text-center py-2'>{showNumber(item.alpha_per_day * data.data.price * data.taoPrice, 3)} $ / {showNumber(item.alpha_per_day, 3)} {data.data.letter}</td>
            }
            <td className='text-center py-2'>
                <button className={item.stake != 0 ? 'px-2 py-1 rounded-md hover:bg-slate-600 transition-all cursor-pointer' : 'px-2 py-1 rounded-md cursor-not-allowed'} onClick={() => unstake(item.coldkey, item.hotkey, data.data.subnet, item.stake)}>{loading ? <LoaderCircle className='animate-spin' /> : 'Unstake'}</button>
            </td>
        </tr>
    )
}

export default StatusTr