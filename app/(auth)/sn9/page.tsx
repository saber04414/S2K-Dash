"use client"
import ImageLoadingSpinner from "@/components/ImageLoadingSpinner";
import { fetcher } from "@/utils/fetcher";
import useSWR from 'swr';
import { copyKey, showStatusKey } from "@/lib/main";
import clsx from "clsx";
import { useState } from "react";

export default function Subnet9() {
  const { data, error, isLoading } = useSWR('/api/getIOTA', fetcher);

  const [sortKey, setSortKey] = useState("uid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const numericFields = ["uid", "layer", "backwards_since_reset", "processed_activations"];

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = data?.data ? [...data.data].sort((a: any, b: any) => {
    const isNumeric = numericFields.includes(sortKey);

    const parse = (val: any) => {
      if (isNumeric) {
        const num = Number(val);
        return isNaN(num) ? -Infinity : num;
      }
      return val || "";
    };

    const aVal = parse(a[sortKey]);
    const bVal = parse(b[sortKey]);

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  }) : [];

  if (isLoading) return (
    <div className='w-full h-full'>
      <ImageLoadingSpinner />
    </div>
  );

  if (error) return (
    <div className='w-full h-full flex flex-col gap-3 items-center justify-center'>
      <img src="/mark.png" className='w-32 h-24' alt='' />
      Data Fetching Error
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-5 justify-center">
      <div className="text-2xl font-bold text-center">IOTA Dashboard</div>
      <div className="w-full flex flex-col gap-3 justify-center">
      <input
        type="text"
        placeholder="Search coldkey or hotkey..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 w-full max-w-md bg-transparent border border-gray-300 rounded-lg text-white"
      />

      <table className="w-full">
        <thead>
          <tr className="bg-slate-700">
            <th className="text-center py-2 cursor-pointer">Grade</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("uid")}>UID</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("coldkey")}>Coldkey</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("hotkey")}>Hotkey</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("layer")}>Layer</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("backwards_since_reset")}>Backward Activation</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("processed_activations")}>Total Activation</th>
            <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("score")}>Score</th>
          </tr>
        </thead>
        <tbody>
          {
            sortedData
              .filter((item: any) => {
                const term = searchTerm.toLowerCase();
                return (
                  item.coldkey?.toLowerCase().includes(term) ||
                  item.hotkey?.toLowerCase().includes(term)
                );
              })
              .map((item: any, index: number) => (
                <tr key={index} className={clsx(index % 2 !== 0 ? "bg-slate-700" : "")}>
                  <td className="text-center py-2">{index + 1}</td>
                  <td className="text-center py-2">{item.uid}</td>
                  <td className='text-center py-2' onClick={() => copyKey(item.coldkey)}>{showStatusKey(item.coldkey)}</td>
                  <td className='text-center py-2' onClick={() => copyKey(item.hotkey)}>{showStatusKey(item.hotkey)}</td>
                  <td className='text-center py-2'>{item.layer}</td>
                  <td className='text-center py-2'>{item.backwards_since_reset}</td>
                  <td className='text-center py-2'>{item.processed_activations}</td>
                  <td className='text-center py-2'>{item.score}</td>
                </tr>
              ))
          }
          <tr>
            <td colSpan={9}><div className='h-[2px] w-full bg-slate-700'></div></td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
}
