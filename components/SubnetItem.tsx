'use clinet'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { showNumber, showTaoNumber } from '@/lib/main'
import { useState } from 'react'
import { GithubIcon } from 'lucide-react'
type Props = {
    subnet_id: number
    active: number
    bittensor_id: string
    description: string
    emission: number
    emissionRate: number
    github: string
    history: any
    image_url: string
    maxAllowedUids: number
    maxAllowedValidators: number
    name: string
    otheruid: number
    price: number
    subnetAlphaIn: number
    subnetTAO: number
}

const SubnetItem = (props: Props) => {
    const router = useRouter()
    const [src, setSrc] = useState(props.image_url || './default.png')
    return (
        <div className='w-full rounded-md border border-slate-500 cursor-pointer flex flex-col gap-0 hover:scale-[1.01] transition-all relative' onClick={() => router.push(`/my-status/${props.subnet_id}`)}>
            <div className="absolute inset-0 bg-gray-200 opacity-0 hover:opacity-40 transition-opacity duration-300" />
            <Image className='w-full h-56 bg-slate-500 rounded-t-md' src={src} width="500" height="500" alt='' onError={() => setSrc('./default.png')} />
            <div className='py-2 flex flex-col gap-1'>
                <div className='flex flex-row justify-between items-center px-4 pb-2'>
                    <div className='text-xl font-bold'>Subnet {props.subnet_id}</div>
                    <div className='text-sm px-2 bg-red-500 rounded-full'>{props.active} / {props.maxAllowedUids}</div>
                </div>
                <div className='flex flex-row justify-between items-center px-4'>
                    <div className='text-sm'>Name: {props.name}</div>
                    <div className='text-sm'>Emission: {showNumber(props.emissionRate, 4)} %</div>
                </div>
                <div className='flex flex-row justify-between items-center px-4'>
                    <div className='text-sm'>Alpha In Pool: {showTaoNumber(props.subnetAlphaIn)} 𝞃</div>
                    <div className='text-sm'>TAO In Pool: {showTaoNumber(props.subnetTAO)} 𝞃</div>
                </div>
                <div className='flex flex-row gap-2'>
                    <div className='text-sm'>Price: {showNumber(props.price, 4)} 𝞃</div>
                    {props.github && <button className='hover:scale-[1.2] transition-all' onClick={() => router.push(props.github)}><GithubIcon size={18} /></button>}
                </div>
            </div>
        </div>
    )
}

export default SubnetItem