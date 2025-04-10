"use client"
import React, { useState } from 'react'
import Price from '@/components/Price'
import TaoXnet from '@/components/TaoXnet'
import TaoSubnets from '@/components/TaoSubnets'
const MinePage = () => {
    const coldkeys = [
        "5C8AE3XAGmx9vRMYGdcLYwdSXbk6EAsmhtVCnkFhjV4XxJKq",
        "5HMXMVrzXKMScqJwSZ1GrVSLY2JcmugZv6ZsU3S98Nd88ZLh",
        "5CcWZNTzcziL1AXrKLLX7RDTuYW54gh5QpJgj9M67TtorWzr",
        "5FH86a6kwcvWPA2WRCiQU17FbUTYauYRvjugYwx1J7KTpYrT",
        "5GTFJrbEXr1x19HwTLG93Swb3JSWsXs5jkSNfBadydVaf9ag",
        "5FUduioEDfg1DWEUf2xYQ7ULo9hAM1fPp3thyitUybDCitpK",
        "5FvV6vtap12HyEy6P3WSVoCFPti6Fc3y3k3vj5Ng5TXgPhVD",
        "5GZME2m32VyM5fUt3APGL5YGTqSSex6B3K1kDPoEi6dKvbaH"
        // "5DZRvMceSTUjErFGajCkTVe8Ubahq1dHVSM3A7VFVewhszqW"
    ]
    const [pass, setPassed] = useState(false)
    const [pass2, setPassed2] = useState(false)
    return (
        <div className='w-screen px-10'>
            <div className='flex flex-col gap-2 w-full'>
                <Price />
                <table>
                    <thead>
                        <tr>
                            <th>SNID</th>
                            <th>UID</th>
                            <th>STAKE</th>
                            <th>INCENTIVE</th>
                            <th>DIVIDENDS</th>
                            <th>EMISSION</th>
                            <th>AXON</th>
                            <th onClick={() => setPassed(!pass)}>COLDKEY</th>
                            <th onClick={() => setPassed2(!pass2)}>HOTKEY</th>
                            <th>DAILY</th>
                        </tr>
                    </thead>
                    {pass && pass2 && <tbody>
                        {
                            coldkeys.map((coldkey, index) => (
                                <TaoXnet coldkey={coldkey} key={index} />
                            ))
                        }
                    </tbody>}
                </table>
                <TaoSubnets />
            </div>
        </div>
    )
}

export default MinePage