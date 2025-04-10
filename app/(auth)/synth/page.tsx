"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SynthPage = () => {
    const [uid, setUid] = useState(0);
    const [synths, setSynths] = useState([]);

    const handleAdd = async () => {
        const response = await axios.post("/api/setNewUID", { uid });
        console.log(response.data);
    };

    useEffect(() => {
        const fetchSynth = async () => {
            const response = await axios.get("/api/getAllSynth");
            setSynths(response.data.synth);
        };
        fetchSynth();
    }, []);

    // Function to handle changes in input fields
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
        <div className="w-full flex flex-col gap-3 px-16">
            <div className="w-full flex flex-row gap-3 justify-between">
                <div className="flex flex-row gap-3 w-fit">
                    <input
                        type="text"
                        placeholder="UID"
                        className="w-[150px] px-2 py-2 text-sm rounded-md text-black"
                        onChange={(e) => setUid(Number(e.target.value))}
                    />
                    <button
                        className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white"
                        onClick={handleAdd}
                    >
                        Add
                    </button>
                </div>
                <a className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white text-center flex justify-center items-center w-fit" href="/synth/overview">Overview</a>
            </div>
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
    );
};

export default SynthPage;
