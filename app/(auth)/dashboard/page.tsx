"use client"
import ImageLoadingSpinner from "@/components/ImageLoadingSpinner";
import PercentBar from "@/components/PercentBar";
import { copyKey, showKey, showTaoNumber } from "@/lib/main";
import { fetcher } from "@/utils/fetcher";
import { ArrowRight } from "lucide-react";
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()
    const { data, error, isLoading } = useSWR('/api/getDashboard', fetcher);
  if (isLoading) return <div className='w-full h-full'>
    <ImageLoadingSpinner />
  </div>
  if (error) return <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
    <img src="/mark.png" className='w-32 h-24' alt='' />
    Data Fetching Error
  </div>
  if (data) {
    return (
      <div className="w-full flex flex-col gap-5 items-center justify-center">
        <div className="text-2xl font-bold text-center">Dashboard</div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700">
              <th className="text-center py-2">ID</th>
              <th className='text-center py-2'>Name</th>
              <th className='text-center py-2'>Coldkey</th>
              <th className='text-center py-2'>Stake</th>
              <th className='text-center py-2'>Free</th>
              <th className='text-center py-2'>Rate</th>
              <th className='text-center py-2'>Total</th>
              <th className='text-center py-2'></th>
            </tr>
          </thead>
          <tbody>
            {
              data && data.data && data.data.length > 0 && data.data.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="text-center py-2">{index + 1}</td>
                  <td className='text-center py-2'>{item.name}</td>
                  <td className='text-center py-2 cursor-pointer' onClick={() => copyKey(item.coldkey)}>{showKey(item.coldkey)}</td>
                  <td className='text-center py-2'>{showTaoNumber(item.staked)} 𝞃</td>
                  <td className='text-center py-2'>{showTaoNumber(item.free)} 𝞃</td>
                  <td className='text-center py-2'><PercentBar stake={item.staked} free={item.free} /></td>
                  <td className='text-center py-2'>{showTaoNumber(item.total)} 𝞃</td>
                  <td className='text-center py-2 cursor-pointer' onClick={() => router.push(`/assets/${item.coldkey}`)}><ArrowRight size={18} /></td>
                </tr>
              ))
            }
            <tr>
              <td colSpan={9}><div className='h-[2px] w-full bg-slate-700'></div></td>
            </tr>
            <tr key="total">
              <td className="text-center py-2"></td>
              <td className='text-center py-2'></td>
              <td className='text-center py-2'></td>
              <td className='text-center py-2'>{showTaoNumber(data.total_staked)} 𝞃</td>
              <td className='text-center py-2'>{showTaoNumber(data.total_free)} 𝞃</td>
              <td className='text-center py-2'><PercentBar stake={data.total_staked} free={data.total_free} /></td>
              <td className='text-center py-2'>{showTaoNumber(data.total_staked + data.total_free)} 𝞃</td>
            </tr>
          </tbody>
        </table>
      </div >
    );
  }
}
