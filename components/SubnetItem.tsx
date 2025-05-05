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
    const [src, setSrc] = useState(props.image_url || '/default.png')
    return (
        <div className='w-full rounded-md border border-slate-500 cursor-pointer flex flex-col gap-0' onClick={() => router.push(`/my-status/${props.subnet_id}`)}>
            <Image className='w-full h-56 bg-slate-500 rounded-t-md' src={src} width="500" height="500" alt='' onError={() => setSrc('/fallback.jpg')} />
            <div className='flex flex-row justify-between items-center px-4 py-2'>
                <div className='text-xl font-bold'>Subnet {props.subnet_id}</div>
                <div className='text-sm'>UIDs: {props.active} / {props.maxAllowedUids}</div>
            </div>
            <div className='px-4'>
                <div className='text-sm'>Description: {props.description}</div>
            </div>
            <div className='flex flex-row justify-between items-center px-4'>
                <div className='text-sm'>Name: {props.name}</div>
                <div className='text-sm'>Emission: {showNumber(props.emission, 4)} %</div>
            </div>
            <div className='flex flex-row justify-between items-center px-4'>
                <div className='text-sm'>Alpha In Pool: {showTaoNumber(props.subnetAlphaIn)}</div>
                <div className='text-sm'>TAO In Pool: {showTaoNumber(props.subnetTAO)}</div>
            </div>
            {props.github && <div className='flex flex-end px-4'>
                <button onClick={() => router.push(props.github)}><GithubIcon size={18} /></button>
            </div>}
        </div>
    )
}

export default SubnetItem