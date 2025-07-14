'use client'
import React from 'react'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
type Props = {
    miners: number[]
}
const Reward = ({ miners }: Props) => {
    const { data } = useSWR('/api/getRewards', fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 5000
    })
    if (data) {
        console.log({ data })
        const sortedData = data.sort((a: any, b: any) => b.incentive - a.incentive)
        const addedGrade = sortedData.map((item: any, index: number) => ({
            ...item,
            grade: index + 1,
        }))

        const filteredData = addedGrade.filter((item: any) =>
            miners?.includes(item.uid)
        );
        const Result = filteredData.map((item: any) => ({
            Grade: item.grade,
            UID: item.uid,
            Stake: item.stake,
            Incentive: item.incentive,
            Performance: item.miner_performance,
            daily: item.taoPerDay,
            Score: item.score,
        }));
        const total_stake = filteredData.reduce((acc: number, item: any) => acc + item.stake, 0);
        const total_daily = filteredData.reduce((acc: number, item: any) => acc + item.taoPerDay, 0);
        return (
            <div className='w-full p-10 border border-white rounded-2xl'>
                <div className='flex flex-col gap-5'>
                    <div className='text-2xl font-bold text-center'>Reward</div>
                    <table>
                        <thead>
                            <tr>
                                <th className='py-2'>UID</th>
                                <th className='py-2'>Grade</th>
                                <th className='py-2'>Stake</th>
                                <th className='py-2'>Incentive</th>
                                <th className='py-2'>Performance</th>
                                <th className='py-2'>Daily</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Result.map((item: any) => (
                                    <tr key={item.UID}>
                                        <td className='text-center blur-sm hover:blur-0 transition-all duration-300 cursor-pointer'>{item.UID}</td>
                                        <td className='text-center'>{item.Grade}</td>
                                        <td className='text-center'>{item.Stake}</td>
                                        <td className='text-center'>{item.Incentive}</td>
                                        <td className='text-center'>{item.Performance}</td>
                                        <td className='text-start'>{item.daily}</td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>
                    </table>
                    <div className='flex flex-col gap-2 mt-4 justify-center items-center'>
                        <span className='flex flex-row gap-2'>Total Daily: <span className="blur-sm hover:blur-0 transition-all duration-300 cursor-pointer">{total_daily}</span></span>
                        <span className='flex flex-row gap-2'>Total Stake: <span className="blur-sm hover:blur-0 transition-all duration-300 cursor-pointer">{total_stake}</span></span>
                    </div>
                </div>
            </div>
        )
    }

}

export default Reward