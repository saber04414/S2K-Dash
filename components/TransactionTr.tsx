"use client"
import React from 'react'
import clsx from 'clsx'
import { copyKey, showKey, showTaoNumber } from '@/lib/main'
type Props = {
    fromAddress: string,
    toAddress: string,
    amount: number,
    blockNumber: number,
    timestamp: string,
    index: number
}

const TransactionTr = (props: Props) => {
    const { fromAddress, toAddress, amount, blockNumber, timestamp, index } = props
    console.log({ fromAddress, toAddress, amount, blockNumber, timestamp, index })
    const type = amount > 0 ? "IN" : "OUT"
    return (
        <tr key={index} className={clsx('transition-all cursor-pointer', index % 2 === 0 ? '' : 'bg-slate-700')}>
            <td className='text-center py-2'>{index + 1}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(fromAddress)}>{showKey(fromAddress)}</td>
            <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(toAddress)}>{showKey(toAddress)}</td>
            <td className='text-center py-2'>{showTaoNumber(Math.abs(amount))} 𝞃</td>
            <td className='text-center py-2'><div className={clsx('font-bold border rounded-md text-center', type === "IN" ? 'border-green-600' : 'border-red-600', type === "IN" ? 'text-white' : 'text-white')}>{type}</div></td>
            <td className='text-center py-2'>{blockNumber}</td>
            <td className='text-center py-2'>{timestamp}</td>
        </tr>
    )
}

export default TransactionTr