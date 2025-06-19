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
  timestamp: number;
  last_processed_block: number;
  start_block: number;
  subnet: number;
  volume: number;
};

interface PriceChartProps {
  data: RawCandleData[];
}

function convertToCandleData(data: RawCandleData[]): CandlestickData[] {
  return data.map((item) => ({
    time: Math.floor(item.timestamp / 1000) as UTCTimestamp,
    open: parseFloat(item.open.toFixed(4)),
    high: parseFloat(item.high.toFixed(4)),
    low: parseFloat(item.low.toFixed(4)),
    close: parseFloat(item.close.toFixed(4)),
  }));
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  console.log({ data });

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
