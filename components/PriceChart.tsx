"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  type UTCTimestamp,
  type CandlestickData,
} from "lightweight-charts";

type RawCandleData = {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: string; // ISO string
  block_number: number;
  subnet: number;
  volume: number;
};

interface PriceChartProps {
  data: RawCandleData[];
}

function convertToCandleData(data: RawCandleData[]): CandlestickData[] {
  // 1) map → epoch-seconds
  const candles = data.map((item) => ({
    time : Math.floor(new Date(item.timestamp).getTime() / 1000) as UTCTimestamp,
    open : +item.open .toFixed(4),
    high : +item.high .toFixed(4),
    low  : +item.low  .toFixed(4),
    close: +item.close.toFixed(4),
  }));

  // 2) sort ascending
  candles.sort((a, b) => a.time - b.time);

  // 3) deduplicate by keeping the last candle for each time key
  const dedup: Record<number, CandlestickData> = {};
  for (const c of candles) dedup[c.time] = c;

  // 4) return values() already in ascending order
  return Object.values(dedup);
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#00000000" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#363C4E" },
      },
      timeScale: {
        borderColor: "#485c7b",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#485c7b",
      },
      watermark: {
        visible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceFormat: {
        type: "price",
        precision: 4,
        minMove: 0.0001,
      },
    });

    candlestickSeries.setData(convertToCandleData(data));

    return () => chart.remove();
  }, [data]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default PriceChart;
