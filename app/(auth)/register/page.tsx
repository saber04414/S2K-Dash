'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [coldkey, setColdkey] = useState('')
    const [uid, setUid] = useState(0)
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [net, setNet] = useState(0)
    const handleUIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUid(Number(e.target.value))
    }
    const handleNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNet(Number(e.target.value))
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleColdkeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColdkey(e.target.value)
    }
    const handleSubnetRegister = async () => {
        setLoading3(true)
        await axios.post("/api/setNewSubnet", { net }).then(() => {
            toast.success("Successfully added")
        }).catch(() => {
            toast.error("Failed to save subnet")
        });
        setLoading3(false)
    }
    const handleColdkeyRegister = async () => {
        setLoading1(true)
        await axios.post("/api/setNewColdkey", { name, coldkey }).then(() => {
            toast.success("Successfully added")
        }).catch(() => {
            toast.error("Failed to save coldkey")
        });
        setLoading1(false)
    }
    const handleSynthRegister = async () => {
        setLoading2(true)
        await axios.post("/api/setNewUID", { uid }).then(() => {
            toast.success("Successfully added")
        }).catch(() => {
            toast.error("Failed to save uid")
        });
        setLoading2(false)
    }
    return (
        <div className="w-full flex flex-col gap-5 items-center justify-center">
            <div className="text-2xl font-bold text-center">Register</div>
            <div className='grid grid-cols-3 gap-5 w-full'>
                <div className='flex flex-col gap-5 w-full items-center justify-center border border-slate-700 rounded-2xl p-7'>
                    <div className='flex flex-row gap-2 items-center justify-center text-lg'>Coldkey Registration: </div>
                    <input type="text" placeholder="Name" className='w-full px-4 py-2 border border-slate-700 rounded-2xl text-slate-900' onChange={handleNameChange} />
                    <input type="text" placeholder="Coldkey" className='w-full px-4 py-2 border border-slate-700 rounded-2xl text-slate-900' onChange={handleColdkeyChange} />
                    <button className='w-full px-4 py-2 border border-slate-700 rounded-2xl hover:bg-slate-500' onClick={handleColdkeyRegister}>{loading1 ? 'Loading...' : 'Register'}</button>
                </div>
                <div className='flex flex-col gap-5 w-full items-center justify-between border border-slate-700 rounded-2xl p-7'>
                    <div className='flex flex-row gap-2 items-center justify-center text-lg'>Synth Registration: </div>
                    <input type="text" placeholder="UID" className='w-full px-4 py-2 border border-slate-700 rounded-2xl text-slate-900' onChange={handleUIDChange} />
                    <span className='w-full px-4 py-2'></span>
                    <button className='w-full px-4 py-2 border border-slate-700 rounded-2xl hover:bg-slate-500' onClick={handleSynthRegister}>{loading2 ? 'Loading...' : 'Register'}</button>
                </div>
                <div className='flex flex-col gap-5 w-full items-center justify-between border border-slate-700 rounded-2xl p-7'>
                    <div className='flex flex-row gap-2 items-center justify-center text-lg'>Subnet Registration: </div>
                    <input type="text" placeholder="NetUID" className='w-full px-4 py-2 border border-slate-700 rounded-2xl text-slate-900' onChange={handleNetChange} />
                    <span className='w-full px-4 py-2'></span>
                    <button className='w-full px-4 py-2 border border-slate-700 rounded-2xl hover:bg-slate-500' onClick={handleSubnetRegister}>{loading3 ? 'Loading...' : 'Register'}</button>
                </div>
            </div>
        </div >
    )
}

export default RegisterPage