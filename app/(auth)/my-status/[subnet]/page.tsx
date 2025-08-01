"use client";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { fetcher } from "@/utils/fetcher";
import {
  decodeS2kUrl,
  getS2kUrl,
  showNumber,
  showTaoNumber,
  isValidS2k,
} from "@/lib/main";
import ImageLoadingSpinner from "@/components/ImageLoadingSpinner";
import {
  ArrowLeft,
  Droplet,
  ChartNoAxesCombined,
  ChartSpline,
  RefreshCcw,
} from "lucide-react";
import MinersChart from "@/components/MinersChart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams, useRouter } from "next/navigation";
import StatusTr from "@/components/StatusTr";
import clsx from "clsx";
import PriceChart from "@/components/PriceChart";
import axios from "axios";

type AxonStatus = {
  axon: string,
  status: number
}

const MyStatusPage = () => {
  const router = useRouter();
  const params = useParams();
  const [sortKey, setSortKey] = useState("");
  const [blur, setBlur] = useState(true);
  const [price, setPrice] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  if (!isValidS2k(params.subnet as string)) {
    const numeric = parseInt(params.subnet as string, 10);
    if (!isNaN(numeric)) {
      const corrected = getS2kUrl(numeric);
      router.replace(`/my-status/${corrected}`);
    }
  } else {
    const { data, error, isLoading } = useSWR(
      `/api/myStatus?subnet=${decodeS2kUrl(params.subnet as string)}`,
      fetcher,
      {
        refreshInterval: 12_000,
        revalidateOnFocus: false, // optional: prevent refetch on tab focus
      }
    );
    const [incentive_countdowns, setIncentiveCountdowns] = useState(0);
    const [registration_countdowns, setRegistrationCountdowns] = useState(0);
    const [currency, setCurrency] = useState("TAO");
    const [showPopup, setShowPopup] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [subnets, setSubnets] = useState<number[]>([]);
    const [priceData, setPriceData] = useState<any[]>([]);
    const [axonList, setAxonList] = useState<AxonStatus[]>([])
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const fetchData = async () => {
        if (!isValidS2k(params.subnet as string)) {
          console.log("Invalid url");
          const numeric = parseInt(params.subnet as string, 10);
          if (!isNaN(numeric)) {
            const corrected = getS2kUrl(numeric);
            router.replace(`/my-status/${corrected}`);
          }
        }
        const response = await axios.post("/api/subnetInfo", {
          netuid: decodeS2kUrl(params.subnet as string),
        });
        const response_data = await response.data;
        if (response_data.subnets && response_data.priceData) {
          setSubnets(response_data.subnets);
          setPriceData(response_data.priceData);
        }
        return response_data;
      };
      fetchData();
    }, [params.subnet]);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popupRef.current &&
          !popupRef.current.contains(event.target as Node)
        ) {
          setShowPopup(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSort = (key: string) => {
      if (sortKey === key) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    };
    console.log("data: ", data)
    const sortedData = [...(data?.data?.mydata || [])]
      .filter(
        (item: any) => selected.length === 0 || selected.includes(item.owner)
      )
      .sort((a: any, b: any) => {
        const dir = sortOrder === "asc" ? 1 : -1;
        switch (sortKey) {
          case "uid":
            return dir * (a.uid - b.uid);
          case "registerAt":
            return (
              dir *
              (new Date(a.registration_block_time).getTime() -
                new Date(b.registration_block_time).getTime())
            );
          case "stake":
            return dir * (a.alpha_stake - b.alpha_stake);
          case "coldkey":
            return dir * a.owner.localeCompare(b.owner);
          case "hotkey":
            return dir * a.hotkey.localeCompare(b.hotkey);
          case "incentive":
            return dir * (a.incentive - b.incentive);
          case "performance":
            return dir * (a.miner_performance - b.miner_performance);
          case "axon":
            return dir * a.axon.localeCompare(b.axon);
          case "daily":
            return dir * (a.alpha_per_day - b.alpha_per_day);
          default:
            return 0;
        }
      });

    const toggleSelect = (key: string) => {
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    };
    const checkPing = async () => {
      const updatedList = await Promise.all(
        axonList.map(async (item: AxonStatus) => {
          try {
            const res = await axios.post(`/api/checkPing`, { axon: item.axon }, { method: 'GET' });
            const status = res.data.status
            return { ...item, status };
          } catch (err) {
            return { ...item, status: -1 }; // 0 = Closed/Offline
          }
        })
      );

      setAxonList(updatedList);
    };

    useEffect(() => {
      if (data?.bittensor_data) {
        const newIncentiveCountdowns = data.bittensor_data.incentive_res.map(
          (t: any) =>
            t.hour === -1 ? -1 : t.hour * 3600 + t.minute * 60 + t.second
        );
        setIncentiveCountdowns(newIncentiveCountdowns);
        const newRegistrationCountdowns =
          data.bittensor_data.registration_res.map((t: any) =>
            t.hour === -1 ? -1 : t.hour * 3600 + t.minute * 60 + t.second
          );
        setRegistrationCountdowns(newRegistrationCountdowns);
      }
      if (data?.data?.mydata) {
        setAxonList((prev) => {
          return data.data.mydata.map((item: any) => {
            const existing = prev.find(p => p.axon === item.axon);
            return {
              axon: item.axon,
              status: existing?.status ?? 0, // Keep 1 or -1, default to 0
            };
          });
        });
      }

    }, [data]);

    useEffect(() => {
      const timer = setInterval(() => {
        setIncentiveCountdowns((prev) => prev - 1);
        setRegistrationCountdowns((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }, []);

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
    if (data) {
      return (
        <div className="w-full flex flex-col gap-10 justify-center relative">
          <div
            className="absolute top-0 left-0 w-fit text-center p-2 cursor-pointer flex flex-row gap-2 items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Back
          </div>
          <div className="flex flex-row gap-2 bg-slate-500/30 backdrop-blur-md rounded-md cursor-pointer text-center z-10 fixed top-5 right-10 py-1 px-2">
            {subnets &&
              subnets.length > 0 &&
              subnets.map((item: number, index: number) => (
                <div
                  className="blur-sm hover:blur-none text-sm hover:scale-110 transition-transform duration-200"
                  key={index}
                  onClick={() => router.push(`/my-status/${getS2kUrl(item)}`)}
                >
                  {item}
                </div>
              ))}
          </div>
          <div className="fixed bottom-5 right-10 w-fit z-10 text-center p-2 cursor-pointer flex flex-row gap-2 bg-slate-500/30 backdrop-blur-md rounded-md">
            <a
              href={`https://taostats.io/subnets/${data.data.subnet}/metagraph`}
              target="__blank"
            >
              <Image
                className="rounded-full w-6 h-6 transition-transform duration-200 hover:scale-125"
                src="/taostats.png"
                alt=""
                width={20}
                height={20}
              />
            </a>
            <a
              href={`https://taoxnet.io/subnets/${data.data.subnet}/metagraph`}
              target="__blank"
            >
              <Image
                className="rounded-full w-6 h-6 transition-transform duration-200 hover:scale-125"
                src="/taoxnet.png"
                alt=""
                width={20}
                height={20}
              />
            </a>
            <a
              href={`https://taomarketcap.com/subnets/${data.data.subnet}/miners`}
              target="__blank"
            >
              <Image
                className="rounded-full w-6 h-6 transition-transform duration-200 hover:scale-125"
                src="/taomarketcap.png"
                alt=""
                width={20}
                height={20}
              />
            </a>
          </div>
          <div className="text-2xl font-bold text-center">My Status</div>
          <div className="absolute top-0 right-0 w-fit text-center cursor-pointer flex flex-row gap-2 items-center py-1 px-2 border border-slate-500 rounded-md h-[50px]">
            <button
              onClick={() => setCurrency("TAO")}
              className={clsx(
                "flex flex-row gap-2 items-center justify-center px-2 h-full rounded-md border border-slate-500",
                currency === "TAO" && "border-white text-white"
              )}
            >
              <Image
                className="rounded-full w-5 h-5"
                src="/tao.png"
                alt=""
                width={20}
                height={20}
              />
              TAO
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={clsx(
                "flex flex-row gap-2 items-center justify-center px-2 h-full rounded-md border border-slate-500",
                currency === "USD" && "border-white text-white"
              )}
            >
              <Image
                className="rounded-full w-5 h-5"
                src="/dollar.png"
                alt=""
                width={20}
                height={20}
              />
              USD
            </button>
            <button
              className={clsx(
                "flex px-2 py-1 items-center justify-center rounded-md border transition-all h-full",
                blur ? "shadow-lg border-white" : "shadow-none border-slate-500"
              )}
              onClick={() => setBlur(!blur)}
            >
              <Droplet size={20} />
            </button>
            <button
              className={clsx(
                "flex px-2 py-1 items-center justify-center rounded-md border transition-all h-full",
                showChart
                  ? "shadow-lg border-white"
                  : "shadow-none border-slate-500"
              )}
              onClick={() => setShowChart(!showChart)}
            >
              <ChartNoAxesCombined size={20} />
            </button>
            <button
              className={clsx(
                "flex px-2 py-1 items-center justify-center rounded-md border transition-all h-full",
                price
                  ? "shadow-lg border-white"
                  : "shadow-none border-slate-500"
              )}
              onClick={() => setPrice(!price)}
            >
              <ChartSpline size={20} />
            </button>
            <button
              className={clsx(
                "flex px-2 py-1 items-center justify-center rounded-md border transition-all h-full",
                price
                  ? "shadow-lg border-white"
                  : "shadow-none border-slate-500"
              )}
              onClick={checkPing}
            >
              <RefreshCcw size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-10">
            {data && data.data && data.bittensor_data && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row justify-between items-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xl text-semibold text-left underline cursor-pointer">
                          Subnet{" "}
                          <span
                            className={clsx(blur ? "blur-sm" : "blur-none")}
                          >
                            {data.data.subnet}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="border-slate-500 border"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="text-base font-bold">
                            Subnet Information
                          </div>
                          <div className="flex flex-col gap-0">
                            <div className="text-sm">
                              Name: {data.data.name} {data.data.letter}
                            </div>
                            <div className="text-sm">
                              Emission: {showNumber(data.data.emission, 4)} %
                            </div>
                            <div className="text-sm">
                              Tao In Pool: {showTaoNumber(data.data.taoInpool)}{" "}
                              𝞃
                            </div>
                            <div className="text-sm">
                              Alpha In Pool:{" "}
                              {showTaoNumber(data.data.alphaInpool)} 𝞃
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-row gap-5 items-center">
                    <div className="text-sm pr-5">
                      Alpha: {showNumber(data.data.price, 4)} 𝞃 /{" "}
                      {showNumber(data.data.price * data.taoPrice, 4)} $
                    </div>
                    <div className="text-sm pr-3">
                      Reg Cost: {showNumber(data.data.regcost, 4)} 𝞃 /{" "}
                      {showNumber(data.data.regcost * data.taoPrice, 4)} $
                    </div>
                    <div className="text-sm pr-3">
                      Next Reg Cost: {showNumber(data.data.next_burn, 4)} 𝞃
                    </div>
                    <div className="text-sm pr-5 flex flex-row gap-1">
                      {Array.from({
                        length: data.data.sidebar.burn_registrations_this_interval,
                      }).map((_, i) => (
                        <TooltipProvider key={i}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-4 h-4 rounded-full bg-red-500 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="text-xs border border-slate-500 bg-slate-900 text-white flex flex-col"
                            >
                              <div>{`UID    : ${data.data.reglist[i].uid}`}</div>
                              <div>{`Coldkey: ${data.data.reglist[i].owner}`}</div>
                              <div>{`Hotkey : ${data.data.reglist[i].hotkey}`}</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {Array.from({
                        length:
                          data.data.sidebar.maxRegsPerInterval -
                          data.data.sidebar.burnRegistrationsThisInterval,
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full bg-green-400"
                        />
                      ))}
                    </div>
                    <div className="text-sm pr-5">
                      Mechanism:{" "}
                      {incentive_countdowns === -1
                        ? "-1"
                        : `${Math.floor(
                          incentive_countdowns / 3600
                        )}h ${Math.floor(
                          (incentive_countdowns % 3600) / 60
                        )}m ${incentive_countdowns % 60}s`}
                    </div>
                    <div className="text-sm pr-5">
                      Registration:{" "}
                      {registration_countdowns === -1
                        ? "-1"
                        : `${Math.floor(
                          registration_countdowns / 3600
                        )}h ${Math.floor(
                          (registration_countdowns % 3600) / 60
                        )}m ${registration_countdowns % 60}s`}
                    </div>
                  </div>
                </div>
                {showChart && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <MinersChart chartData={data.chartData} />
                  </div>
                )}
                {price && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <PriceChart data={priceData} />
                  </div>
                )}
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700">
                      <th className="text-center py-2 cursor-pointer">No</th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("uid")}
                      >
                        UID
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("registerAt")}
                      >
                        Register At
                      </th>
                      <th className="text-center py-2">Status</th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("stake")}
                      >
                        Stake
                      </th>
                      <th className="relative text-center py-2">
                        <div
                          className="flex items-center justify-center gap-1 cursor-pointer"
                          onClick={() => setShowPopup((prev) => !prev)}
                        >
                          <span className="font-semibold">Coldkey</span>
                          <span className="text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {data.data.mycoldkeys.length}
                          </span>
                        </div>

                        {showPopup && (
                          <div
                            className="absolute top-full mt-2 right-0 bg-slate-900 shadow-lg border border-slate-500 rounded-md p-2 z-10 w-48 max-h-60 overflow-y-auto"
                            ref={popupRef}
                          >
                            {data.data.mycoldkeys.map((key: string) => (
                              <label
                                key={key}
                                className="flex items-center space-x-2 text-sm py-1 cursor-pointer group justify-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected.includes(key)}
                                  onChange={() => toggleSelect(key)}
                                  className="peer hidden"
                                />
                                <div className="w-4 h-4 rounded border-2 border-gray-400 flex items-center justify-center peer-checked:border-white peer-checked:bg-white transition-all">
                                  <svg
                                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                                <span className="truncate select-none text-white group-hover:text-slate-500">
                                  {key}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("hotkey")}
                      >
                        Hotkey
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("incentive")}
                      >
                        Incentive
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("performance")}
                      >
                        Performance
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("axon")}
                      >
                        Axon
                      </th>
                      <th
                        className="text-center py-2"
                      >
                        Ping
                      </th>
                      <th
                        className="text-center py-2 cursor-pointer"
                        onClick={() => handleSort("daily")}
                      >
                        Daily
                      </th>
                      <th className="text-center py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData &&
                      sortedData
                        .filter(
                          (item: any) =>
                            selected.length === 0 ||
                            selected.includes(item.owner)
                        )
                        .map((item: any, index: number) => (
                          <StatusTr
                            key={index}
                            index={index}
                            item={item}
                            data={data}
                            currency={currency}
                            blur={blur}
                            axons={axonList}
                          />
                        ))}
                    <tr>
                      <td colSpan={13}>
                        <div className="h-[2px] w-full bg-slate-700"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center py-2">Total</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      {currency === "TAO" ? (
                        <td className="text-center py-2">
                          {showNumber(
                            data.data.total_stake * data.data.price,
                            2
                          )}{" "}
                          𝞃 / {showNumber(data.data.total_stake, 2)}{" "}
                          {data.data.letter}
                        </td>
                      ) : (
                        <td className="text-center py-2">
                          {showNumber(
                            data.data.total_stake *
                            data.data.price *
                            data.taoPrice,
                            2
                          )}{" "}
                          $ / {showNumber(data.data.total_stake, 2)}{" "}
                          {data.data.letter}
                        </td>
                      )}
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      {currency === "TAO" ? (
                        <td className="text-center py-2">
                          {showNumber(
                            data.data.total_daily * data.data.price,
                            2
                          )}{" "}
                          𝞃 / {showNumber(data.data.total_daily, 2)}{" "}
                          {data.data.letter}
                        </td>
                      ) : (
                        <td className="text-center py-2">
                          {showNumber(
                            data.data.total_daily *
                            data.data.price *
                            data.taoPrice,
                            2
                          )}{" "}
                          $ / {showNumber(data.data.total_daily, 2)}{" "}
                          {data.data.letter}
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
};

export default MyStatusPage;
