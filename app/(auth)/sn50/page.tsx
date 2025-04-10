'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ValidateItem from '@/components/ValidateItem'
import Score from '@/components/Score'

const SynthPage = () => {
    const [miners, setMiners] = useState<number[]>([])
    const [synths, setSynths] = useState([]);

    useEffect(() => {
        const fetchSynth = async () => {
            const response = await axios.get("/api/getAllSynth");
            const synths = response.data.synth
            const uids = synths.map((synth: any) => synth.uid)
            setMiners(uids);
            setSynths(response.data.synth);
        };
        fetchSynth();

    }, [])

    const handleChange = (index: number, field: string, value: number) => {
        setSynths((prev: any) =>
            prev.map((synth: any, i: number) =>
                i === index ? { ...synth, [field]: value } : synth
            )
        );
    };

    const handleSave = async (uid: string, sigma: number, dt: number, flag: number) => {
        const response = await axios.post("/api/setUIDinfo", { uid, sigma, dt, flag });
        if (response.status === 200) {
            console.log("Data saved successfully");
        } else {
            console.log("Failed to save data");
        }
    }

    const handleDelete = async (uid: string) => {
        const response = await axios.post("/api/deleteSynth", { uid });
        if (response.status === 200) {
            console.log("Data deleted successfully");
        } else {
            console.log("Failed to delete data");
        }
    }
    return (
        <div className='w-full flex flex-col gap-5 justify-center'>
            <div className='text-2xl font-bold text-center'>Subnet 50</div>
            <div className='flex flex-start gap-1 w-full items-center overflow-x-auto'>
                {
                    miners?.map((miner, index) => <ValidateItem key={index} miner={miner} />)
                }
            </div>
            <div className='flex flex-row gap-10'>
                <Score miners={miners} />
                <div className='flex flex-row gap-10 w-full'>
                    <div className='h-full w-[3px] bg-slate-500 blur-sm'></div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="text-center py-1">UID</th>
                                <th className="text-center py-1">Sigma</th>
                                <th className="text-center py-1">DT</th>
                                <th className="text-center py-1">Flag</th>
                                <th className="text-center py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {synths.map((synth: any, index: number) => (
                                <tr key={synth.uid}>
                                    <td className="text-center py-1">{synth.uid}</td>
                                    <td className="text-center py-1">
                                        <input
                                            type="number"
                                            value={synth.sigma}
                                            onChange={(e) =>
                                                handleChange(index, "sigma", Number(e.target.value))
                                            }
                                            className="bg-transparent text-white text-center"
                                        />
                                    </td>
                                    <td className="text-center py-1">
                                        <input
                                            type="number"
                                            value={synth.dt}
                                            onChange={(e) =>
                                                handleChange(index, "dt", Number(e.target.value))
                                            }
                                            className="bg-transparent text-white text-center"
                                        />
                                    </td>
                                    <td className="text-center py-1">
                                        <input
                                            type="number"
                                            value={synth.flag}
                                            onChange={(e) =>
                                                handleChange(index, "flag", Number(e.target.value))
                                            }
                                            className="bg-transparent text-white text-center"
                                        />
                                    </td>
                                    <td className="text-center py-1 flex flex-row gap-2 justify-center">
                                        <button className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white" onClick={() => handleSave(synth.uid, synth.sigma, synth.dt, synth.flag)}>
                                            Save
                                        </button>
                                        <button className="px-3 py-1 text-sm rounded-md bg-red-500 text-white" onClick={() => handleDelete(synth.uid)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SynthPage