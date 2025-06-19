import { formattedTimeFromSeconds } from "@/utils/date";
import React from "react";
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
import { showStatusKey } from "@/lib/main";

const CustomizedBar = (props: any) => {
  const { formattedGraphicalItems } = props;
  if (!formattedGraphicalItems || !formattedGraphicalItems[0]?.props?.data)
    return null;
  const firstSeries = formattedGraphicalItems[0];
  return firstSeries?.props?.data?.map((item: any) => {
    return (
      <Rectangle
        key={item.uid}
        width={item.width}
        height={5}
        x={item.x}
        y={item.y - 5}
        fill={
          item.owner === "Mine"
            ? "#f34"
            : item.owner === "Unknown"
            ? item.immunity === true
              ? "#F90"
              : "#00DBBC"
            : "#ccc"
        }
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

const MinersChart = ({ chartData }: any) => {
  const data = chartData;
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  return (
    <div className="relative w-full h-[300px]">
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
          <Customized component={CustomizedBar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MinersChart;
