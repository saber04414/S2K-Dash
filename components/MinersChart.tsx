"use client"
import { formattedTimeFromSeconds } from "@/utils/date";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Customized,
  Tooltip,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { X } from "lucide-react";
import { showStatusKey } from "@/lib/main";
import clsx from "clsx";

const CustomizedBar = (props: any) => {
  const { formattedGraphicalItems, search } = props;
  if (!formattedGraphicalItems || !formattedGraphicalItems[0]?.props?.data)
    return null;

  const firstSeries = formattedGraphicalItems[0];
  const searchLower = search.toLowerCase();

  return firstSeries?.props?.data?.map((item: any) => {
    let fillColor: string;

    if (search !== "") {
      const match =
        item.coldkey?.toLowerCase().includes(searchLower) ||
        item.hotkey?.toLowerCase().includes(searchLower) ||
        item.axon?.toLowerCase().includes(searchLower);
      fillColor = match ? "#00DBBC" : "#666666"; // Highlight or gray
    } else {
      // Original logic
      fillColor =
        item.owner === "Mine"
          ? "#f34"
          : item.owner === "Unknown"
          ? item.immunity === true
            ? "#F90"
            : "#00DBBC"
          : "#ccc";
    }

    return (
      <Rectangle
        key={item.uid}
        width={item.width}
        height={5}
        x={item.x}
        y={item.y - 5}
        fill={fillColor}
      />
    );
  });
};

const CustomTooltip = (props: any) => {
  if (props && props.active && props.payload && props.payload.length) {
    return (
      <div className="bg-slate-500/60 rounded-md border-white/5 border p-3 text-12">
        <div className="text-white">Ranking: {props?.label}</div>
        <div className="flex flex-col gap-2 mt-6">
          <div>UID: {props.payload[0].payload.uid}</div>
          <div>Owner: {props.payload[0].payload.owner}</div>
          <div>Coldkey: {showStatusKey(props.payload[0].payload.coldkey)}</div>
          <div>Hotkey: {showStatusKey(props.payload[0].payload.hotkey)}</div>
          <div>Axon: {props.payload[0].payload.axon}</div>
          <div>Daily: τ{props.payload[0].payload.daily.toLocaleString()}</div>
          <div>
            Register:{" "}
            {formattedTimeFromSeconds(
              props.payload[0].payload.registerDuration,
              true
            )}{" "}
            ago
          </div>
        </div>
      </div>
    );
  }

  return null;
};

type Result = {
  numMiners: number;
  dailyAlpha: number;
}

const MinersChart = ({ chartData }: any) => {
  const [search, setSearch] = useState("");
  const [search_result, setSearchResult] = useState<Result>({numMiners: 0, dailyAlpha: 0});

  const data = chartData;
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  useEffect(() => {
  if (!search) {
    setSearchResult({ numMiners: 0, dailyAlpha: 0 });
    return;
  }

  const lowerSearch = search.toLowerCase();

  const filtered = data.filter((item: any) => 
    item.coldkey?.toLowerCase().includes(lowerSearch) ||
    item.hotkey?.toLowerCase().includes(lowerSearch) ||
    item.axon?.toLowerCase().includes(lowerSearch)
  );

  const numMiners = filtered.length;
  const dailyAlpha = filtered.reduce((sum: number, item: any) => sum + (item.daily || 0), 0);

  setSearchResult({ numMiners, dailyAlpha });
}, [search, data]);

  return (
    <div className="relative w-full h-[300px]">
      <div className="absolute right-0 top-5 w-fit z-10">
        <input type="text" placeholder="Search..." className="px-2 py-1 text-sm text-white bg-slate-900 border border-slate-500 focus:border-slate-200 rounded-md" onChange={(e) => setSearch(e.target.value)} value={search} />
        {search && <X className="absolute right-2 z-10 translate-y-1/2 top-0 cursor-pointer" size={15} onClick={()=> setSearch("")}/>}
        <div className={clsx("w-full bg-slate-700 border border-slate-500 h-fit gap-1 mt-2 rounded-md p-2 transition-transform duration-200", search ? "flex flex-col" : "hidden")}>
          <div className="text-sm text-white">Total Miner: {search_result.numMiners}</div>
          <div className="text-sm text-white">Daily Alaha: {search_result.dailyAlpha.toFixed(2)} τ</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          barCategoryGap={0.4}
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -25,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="ranking"
            stroke="#fff2"
            fontSize={12}
            className="!fill-red-400"
            // padding={{ left: 5, right: 5 }}
          />
          <YAxis stroke="#fff2" fontSize={12} type="number" />
          <Tooltip cursor={{ fill: "#29f2" }} content={<CustomTooltip />} />
          <Bar dataKey="daily" fill="#0000" isAnimationActive={false} />
          <Customized component={<CustomizedBar search={search} />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MinersChart;
