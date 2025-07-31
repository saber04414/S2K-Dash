"use client"
import React from 'react'
import clsx from 'clsx'
import { copyKey, showKey, showTaoNumber } from '@/lib/main'
import { LoaderCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Active } from './MinerIcon'
import { useRouter } from 'next/navigation'
type Props = {
    index: number,
    item: any,
    price: any[]
}

const AssetTr = (props: Props) => {
    const [loading, setLoading] = React.useState(false)
    const { index, item, price } = props
    const router = useRouter()

    const unstake = async (coldkey: string, hotkey: string, netuid: string, amount: number) => {
        setLoading(true)
        await axios.post("/api/unstake", { coldkey_address: coldkey, hotkey_address: hotkey, netuid: netuid, amount: amount }).then(() => {
            toast.success("Successfully unstaked")
        }).catch((e) => {
            setLoading(false)
            console.log({e})
            toast.error("Failed to unstake")
        });
        setLoading(false)
    }
    return (
        <tr key={index} className={clsx('transition-all cursor-pointer', index % 2 === 0 ? '' : 'bg-slate-700')}>
            <td className='text-center py-2'>{index + 1}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.coldkey_ss58)}>{showKey(item.coldkey_ss58)}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.hotkey_ss58)}>{showKey(item.hotkey_ss58)}</td>
            <td className='text-center py-2'>{item.is_registered ? <Active /> : ''}</td>
            <td className='text-center py-2 underline' onClick={() => router.push(`https://s2k-labs.vercel.app/my-status/${item.netuid}`)}>{item.netuid}</td>
            <td className='text-center py-2'>{showTaoNumber(item.stake.rao * price[item.netuid+1].latest_snapshot.price)} 𝞃 / {showTaoNumber(item.stake.rao)} {price[item.netuid].letter}</td>
            <td className='text-center py-2'>
                <button className={item.stake != 0 ? 'px-2 py-1 rounded-md hover:bg-slate-600 transition-all cursor-pointer' : 'px-2 py-1 rounded-md cursor-not-allowed'} onClick={() => unstake(item.coldkey_ss58, item.hotkey_ss58, item.stake.netuid, item.stake.rao)}>{loading ? <LoaderCircle className='animate-spin' /> : 'Unstake'}</button>
            </td>
        </tr>
    )
}

export default AssetTr