'use client'
import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'

const APISPage = () => {
    const router = useRouter()
    return (
        <div className='w-full flex flex-col gap-10 justify-center relative'>
            <div className='absolute top-0 left-0 w-fit text-center p-2 cursor-pointer flex flex-row gap-2 items-center' onClick={() => router.back()}><ArrowLeft size={18} />Back</div>
            <div className='text-2xl font-bold text-center'>API Keys</div>
            <div className='flex flex-col gap-10 border rounded-md p-5'>
                <div>Click button to get api key</div>
                <div className='relative w-full'>
                    <div className='absolute right-2 top-0 translate-y-1/2 p-0'><Eye size={24} /></div>
                    <input type='text' className='border w-full bg-transparent text-white rounded-md text-[24px]'></input>
                </div>
            </div>
        </div>
    )
}

export default APISPage