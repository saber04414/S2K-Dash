'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ValidatedData {
    name: string
    email: string
    status: number
}

const BidPage = () => {
    const [validateStatus, setValidateStatus] = useState<boolean | null>(null) // null = not started, false = validating, true = validated
    const [textareaValue, setTextareaValue] = useState('')
    const [validatedData, setValidatedData] = useState<ValidatedData[]>([])
    const [emails, setEmails] = useState<any[]>([])
    const [emailInput, setEmailInput] = useState('')
    const [seeStatus, setSeeStatus] = useState(false)
    const [myemails, setMyemails] = useState<any[]>([])
    const [secretPassword, setSecretPassword] = useState('')
    useEffect(() => {
        const fetchEmails = async () => {
            const response = await axios.get('/api/getEmails')
            setEmails(response.data.emails)
            const response2 = await axios.get('/api/getMyEmails')
            setMyemails(response2.data.myemails || [])
        }
        fetchEmails()
    }, [])
    const handleValidate = () => {
        setValidateStatus(false) // Show spinner (validating)

        // Parse and validate textarea content
        const lines = textareaValue.split('\n').filter(line => line.trim() !== '')
        const validated: ValidatedData[] = []

        lines.forEach((line, index) => {
            const trimmedLine = line.trim()
            // Check if line contains a comma
            if (trimmedLine.includes(',')) {
                const parts = trimmedLine.split(',').map(part => part.trim())
                if (parts.length >= 2) {
                    const name = parts[0]
                    const email = parts[1]
                    // Basic email validation
                    if (name && email && email.includes('@')) {
                        validated.push({ name, email, status: 0 })
                    }
                }
            }
        })

        setTimeout(() => {
            setValidatedData(validated)
            setValidateStatus(true)
        }, 2000)
    }

    const handleAdd = async () => {
        if (!emailInput && !secretPassword) {
            toast.error('Please enter an email and password')
            return
        } else {
            const response = await axios.post('/api/saveMyEmail', {
                email: emailInput,
                secretPassword: secretPassword
            })
            if (response.status === 200) {
                toast.success('Email added successfully')
                setEmailInput('')
                setSecretPassword('')
                setMyemails([...myemails, response.data.myemail])
            } else {
                toast.error('Failed to add email')
            }
        }
    }

    const handleSave = () => {
        validatedData.forEach(async (item) => {
            const response = await axios.post('/api/saveEmail', {
                name: item.name,
                email: item.email
            })
            if (response.status === 200) {
                item.status = 1
            } else {
                item.status = 2
            }
            setValidatedData([...validatedData])
        })
    }

    const handleClear = () => {
        setTextareaValue('')
        setValidatedData([])
        setValidateStatus(null)
        console.log('Clear')
    }
    return (
        <div className='w-full h-screen py-10 px-20 overflow-hidden'>
            <div className='flex flex-col gap-5 h-full min-h-0'>
                <div className='text-5xl font-bold text-center flex-shrink-0'>Bid Status</div>
                <div className='flex flex-row items-stretch gap-5 flex-1 min-h-0'>
                    <div className='flex flex-col flex-[2] gap-5 min-h-0'>
                        <div className='flex flex-row items-center gap-10'>
                            <div className='w-1/2 h-fit p-10 border border-[3px] border-slate-700 rounded-3xl flex flex-col items-center justify-center'>
                                <div className='text-7xl font-bold text-center mb-3'>{emails.length}</div>
                                <div className='text-sm text-slate-400 text-center'>Total</div>
                            </div>
                            <div className='w-1/2 h-fit p-10 border border-[3px] border-slate-700 rounded-3xl flex flex-col items-center justify-center'>
                                <div className='text-7xl font-bold text-center mb-3'>{emails.filter((email) => email.sender !== '').length}</div>
                                <div className='text-sm text-slate-400 text-center'>Sent</div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full flex-1 p-5 border border-[3px] border-slate-700 rounded-3xl min-h-0'>
                            <div className='w-full flex flex-col items-center gap-5 flex-1 min-h-0'>
                                <div className='text-3xl font-bold text-center flex-shrink-0'>Input</div>
                                <div className='flex flex-row gap-5 w-full flex-shrink-0'>
                                    <input type="text" placeholder='danielmatthew@gmail.com' className='w-full px-4 py-2 rounded-md text-black border border-slate-700' value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                                    <input type="password" placeholder='Password' className='w-full px-4 py-2 rounded-md text-black border border-slate-700' value={secretPassword} onChange={(e) => setSecretPassword(e.target.value)} />
                                    <button className='w-[100px] px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300' onClick={handleAdd}>Add</button>
                                    <button className='w-[100px] px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-0' onClick={() => setSeeStatus(!seeStatus)}>
                                        {seeStatus ? 'Hide' : 'See'}
                                    </button>
                                </div>
                                {!seeStatus ? <div className='w-full flex flex-row flex-1 gap-5 min-h-0 overflow-hidden'>
                                    <div className='w-full flex-1 border border-[3px] border-slate-700 rounded-3xl overflow-hidden flex flex-col min-h-0'>
                                        <textarea
                                            className='w-full h-full p-5 rounded-3xl text-black border-0 resize-none overflow-y-auto bg-white focus:outline-none'
                                            placeholder='Randi Zuckerberg,randi@thehug.xyz'
                                            value={textareaValue}
                                            onChange={(e) => setTextareaValue(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className='w-[150px] flex-shrink-0 p-5 border border-[3px] border-slate-700 rounded-3xl flex flex-col gap-5 items-center justify-center'>
                                        <button
                                            className='w-full px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                            onClick={handleValidate}
                                            disabled={validateStatus === false}
                                        >
                                            {validateStatus === false ? (
                                                <div className='flex items-center justify-center gap-2'>
                                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                </div>
                                            ) : validateStatus === true ? (
                                                'Validated'
                                            ) : (
                                                'Validate'
                                            )}
                                        </button>
                                        <button className='w-full px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-all duration-300' onClick={handleSave}>Save</button>
                                        <button className='w-full px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300' onClick={handleClear}>Clear</button>
                                    </div>
                                    <div className='w-full flex-1 border border-[3px] border-slate-700 rounded-3xl overflow-hidden flex flex-col min-h-0'>
                                        <div className='flex-1 overflow-y-auto min-h-0 w-full'>
                                            <table className='w-full table-fixed bg-white text-black border-collapse'>
                                                <thead className='sticky top-0 bg-slate-50 z-10 shadow-sm'>
                                                    <tr className='border-b-2 border-slate-400'>
                                                        <th className='w-10 py-3 px-2 text-left font-semibold border-r border-slate-300 text-center'>No.</th>
                                                        <th className='w-[30%] py-3 px-4 text-left font-semibold border-r border-slate-300'>Name</th>
                                                        <th className='w-[40%] py-3 px-4 text-left font-semibold border-r border-slate-300'>Email</th>
                                                        <th className='w-10 py-3 px-4 text-left font-semibold border-r border-slate-300 text-center'>S</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {validatedData.length > 0 ? (
                                                        validatedData.map((item, index) => (
                                                            <tr key={index} className='border-b border-slate-300 hover:bg-slate-50'>
                                                                <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>{index + 1}</td>
                                                                <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0' title={item.name}>{item.name}</td>
                                                                <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0' title={item.email}>{item.email}</td>
                                                                <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>{item.status === 1 ? '✅' : item.status === 2 ? '❌' : ''}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        Array.from({ length: 20 }).map((_, index) => (
                                                            <tr key={index} className='border-b border-slate-300 hover:bg-slate-50'>
                                                                <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>{index + 1}</td>
                                                                <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>&nbsp;</td>
                                                                <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>&nbsp;</td>
                                                                <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>&nbsp;</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> :
                                    <div className='w-full flex-1 gap-5 min-h-0 overflow-hidden rounded-3xl border border-[3px] border-slate-700 flex flex-col'>
                                        <div className='flex-1 overflow-y-auto min-h-0 w-full'>
                                            <table className='w-full table-fixed bg-white text-black border-collapse'>
                                                <thead className='sticky top-0 bg-slate-50 z-10 shadow-sm'>
                                                    <tr className='border-b-2 border-slate-400'>
                                                        <th className='w-10 py-3 px-2 text-left font-semibold border-r border-slate-300 text-center'>No.</th>
                                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300 text-center'>Email</th>
                                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300 text-center'>Secret</th>
                                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300 text-center'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myemails.map((email, index) => (
                                                        <tr key={index} className='border-b border-slate-300 hover:bg-slate-50'>
                                                            <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>{index + 1}</td>
                                                            <td className='py-2 px-4 border-r border-slate-300 text-ellipsis whitespace-nowrap max-w-0 text-center'>{email.email}</td>
                                                            <td className='py-2 px-4 border-r border-slate-300 text-ellipsis whitespace-nowrap max-w-0 text-center'>{email.secret}</td>
                                                            <td className='py-2 px-4 border-r border-slate-300 text-ellipsis whitespace-nowrap max-w-0 text-center'>
                                                                <button className='w-[100px] px-4 rounded-md transition-all duration-300 underline'>Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className='flex-[1] rounded-3xl border border-[3px] border-slate-700 overflow-hidden min-h-0 flex flex-col'>
                        <div className='flex-1 overflow-y-auto min-h-0'>
                            <table className='w-full table-fixed bg-white text-black border-collapse'>
                                <thead className='sticky top-0 bg-slate-50 z-10 shadow-sm'>
                                    <tr className='border-b-2 border-slate-400'>
                                        <th className='w-10 py-3 px-2 text-left font-semibold border-r border-slate-300 text-center rounded-tl-3xl'>No.</th>
                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300'>Name</th>
                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300'>Email</th>
                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300'>Sender</th>
                                        <th className='w-full py-3 px-4 text-left font-semibold border-r border-slate-300 rounded-tr-3xl'>Send At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emails.map((email, index) => (
                                        <tr key={index} className='border-b border-slate-300 hover:bg-slate-50'>
                                            <td className='w-10 py-2 px-2 border-r border-slate-300 text-center'>{index + 1}</td>
                                            <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>{email.name}</td>
                                            <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>{email.email}</td>
                                            <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>{email.sender}</td>
                                            <td className='py-2 px-4 border-r border-slate-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-0'>{email.sendAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidPage

