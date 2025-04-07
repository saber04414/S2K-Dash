import { showNumber } from '@/lib/main';
import React from 'react'

type Props = {
    stake: number;
    free: number
}

const PercentBar = ({ stake, free }: Props) => {
    const total = stake + free
    const stakePercent = (stake / total) * 100
    const freePercent = (free / total) * 100
    return (
        <div className='flex flex-row items-center justify-center'>
            <div className='w-1/4 text-sm'>{showNumber(stakePercent, 2)} %</div>
            <div className='w-1/2 h-2 bg-slate-700 flex flex-row gap-0 items-center'>
                <div className='h-4 bg-red-500' style={{ width: `${stakePercent}%` }}></div>
                <div className='h-4 bg-green-500' style={{ width: `${freePercent}%` }}></div>
            </div>
            <div className='w-1/4 text-sm'>{showNumber(freePercent, 2)} %</div>
        </div>
    )
}

export default PercentBar