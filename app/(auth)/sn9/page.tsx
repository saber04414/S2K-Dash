"use client";
import ImageLoadingSpinner from "@/components/ImageLoadingSpinner";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { copyKey, showStatusKey } from "@/lib/main";
import clsx from "clsx";
import { useMemo, useState } from "react";

type MinerRow = {
  timestamp: number;
  layer: number;
  miner_uid: number;
  unique_miner_id: string;
  coldkey: string;
  hotkey: string;
  activation_count: number;
  ip_address: string;
  throughput: number;
  incentive: number;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  registration_time: number;
  is_active: boolean;
  run_id?: string;
};

export default function Subnet9() {
  const { data, error, isLoading } = useSWR("/api/getIOTA", fetcher);

  const [sortKey, setSortKey] = useState<keyof MinerRow | "location_name" | "uptime">("miner_uid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const rows: MinerRow[] = useMemo(() => {
    if (Array.isArray(data)) return data as MinerRow[];
    if (data?.data && Array.isArray(data.data)) return data.data as MinerRow[];
    return [];
  }, [data]);

  const numericFields: (keyof MinerRow | "uptime")[] = [
    "miner_uid",
    "layer",
    "activation_count",
    "throughput",
    "incentive",
    "timestamp",
    "latitude",
    "longitude",
    "uptime",
  ];

  const handleSort = (key: keyof MinerRow | "location_name" | "uptime") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const formatNum = (n: number | undefined, digits = 0) => {
    if (n === undefined || n === null || Number.isNaN(n as number)) return "-";
    return Number(n).toLocaleString(undefined, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  };

  const formatDate = (secs?: number) => {
    if (!secs && secs !== 0) return "-";
    const d = new Date(secs * 1000);
    return d.toLocaleString();
  };

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
  
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || parts.length === 0) parts.push(`${m}m`); // always show minutes if everything else is 0
  
    return parts.join(" ");
  };
  

  const sortedData = useMemo(() => {
    const arr = rows.map((r) => {
      const now = Math.floor(Date.now() / 1000);
      const uptime = now - r.registration_time;
      return { ...r, uptime };
    });

    const isNumeric = (k: keyof MinerRow | "location_name" | "uptime") =>
      numericFields.includes(k);

    const parse = (val: any, k: keyof MinerRow | "location_name" | "uptime") => {
      if (isNumeric(k)) {
        const num = Number(val);
        return Number.isNaN(num) ? -Infinity : num;
      }
      return (val ?? "").toString().toLowerCase();
    };

    arr.sort((a, b) => {
      const aVal = parse((a as any)[sortKey], sortKey);
      const bVal = parse((b as any)[sortKey], sortKey);

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [rows, sortKey, sortOrder, numericFields]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sortedData;
    return sortedData.filter((r) =>
      [
        r.coldkey,
        r.hotkey,
        r.unique_miner_id,
        r.location_name,
        r.ip_address,
        String(r.miner_uid),
        String(r.layer),
      ]
        .filter(Boolean)
        .some((v) => v!.toString().toLowerCase().includes(term))
    );
  }, [sortedData, searchTerm]);

  if (isLoading)
    return (
      <div className="w-full h-full">
        <ImageLoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
        <img src="/mark.png" className="w-32 h-24" alt="" />
        Data Fetching Error
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-5 justify-center">
      <div className="text-2xl font-bold text-center">IOTA Dashboard</div>

      <div className="w-full flex flex-col gap-3 justify-center">
        <input
          type="text"
          placeholder="Search coldkey, hotkey, miner id, location, IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full max-w-md bg-transparent border border-gray-300 rounded-lg text-white"
        />

        <table className="w-full">
          <thead>
            <tr className="bg-slate-700">
              <th className="text-center py-2">#</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("miner_uid")}>UID</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("unique_miner_id")}>Miner ID</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("coldkey")}>Coldkey</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("hotkey")}>Hotkey</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("layer")}>Layer</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("activation_count")}>Activations</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("throughput")}>Throughput</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("incentive")}>Incentive</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("location_name")}>Location</th>
              <th className="text-center py-2">Active</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("uptime")}>Uptime</th>
              <th className="text-center py-2 cursor-pointer" onClick={() => handleSort("timestamp")}>Updated</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, index) => (
              <tr key={`${item.unique_miner_id}-${index}`} className={clsx(index % 2 !== 0 ? "bg-slate-700" : "")}>
                <td className="text-center py-2">{index + 1}</td>
                <td className="text-center py-2">{item.miner_uid}</td>
                <td className="text-center py-2">{item.unique_miner_id}</td>
                <td className="text-center py-2 cursor-pointer" onClick={() => copyKey(item.coldkey)}>
                  {showStatusKey(item.coldkey)}
                </td>
                <td className="text-center py-2 cursor-pointer" onClick={() => copyKey(item.hotkey)}>
                  {showStatusKey(item.hotkey)}
                </td>
                <td className="text-center py-2">{item.layer}</td>
                <td className="text-center py-2">{formatNum(item.activation_count)}</td>
                <td className="text-center py-2">{formatNum(item.throughput)}</td>
                <td className="text-center py-2">{formatNum(item.incentive, 6)}</td>
                <td className="text-center py-2">{item.location_name ?? "-"}</td>
                <td className="text-center py-2">
                  <span className={clsx("px-2 py-1 rounded text-xs", item.is_active ? "bg-green-600/30 text-green-300" : "bg-red-600/30 text-red-300")}>
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-center py-2">{formatUptime(item.uptime)}</td>
                <td className="text-center py-2">{formatDate(item.timestamp)}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={13}>
                <div className="h-[2px] w-full bg-slate-700"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
