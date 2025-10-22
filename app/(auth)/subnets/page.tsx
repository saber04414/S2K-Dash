"use client";
import ImageLoadingSpinner from "@/components/ImageLoadingSpinner";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import clsx from "clsx";

export default function SubnetsPage() {
  const { data, error, isLoading } = useSWR("/api/getSubnetLists", fetcher);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-5 justify-center">
        <div className="text-2xl font-bold text-center">Bittensor Dashboard</div>
        <div className="flex justify-center">
          <ImageLoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-5 justify-center">
        <div className="text-2xl font-bold text-center">Bittensor Dashboard</div>
        <div className="text-center text-red-500">Error loading data</div>
      </div>
    );
  }

  // Data is wrapped in a data property from the API
  const subnets: any[] = data?.data || [];

  return (
    <div className="w-full flex flex-col gap-5 justify-center">
      <div className="text-2xl font-bold text-center">Bittensor Subnet Information</div>

      <div className="w-full flex flex-col gap-3 justify-center">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700">
              <th className="text-center py-2">NetUID</th>
              <th className="text-center py-2">Adjustment Alpha</th>
              <th className="text-center py-2">Max Burn</th>
              <th className="text-center py-2">Min Burn</th>
              <th className="text-center py-2">Burn Rate</th>
              <th className="text-center py-2">Registration Allowed</th>
            </tr>
          </thead>

          <tbody>
            {subnets.map((subnet: any, index: number) => {
              const hyperparams = subnet?.subnet_info?.hyperparameters;
              return (
                <tr key={subnet?.netuid || index} className={clsx(index % 2 !== 0 ? "bg-slate-700" : "bg-slate-600")}>
                  <td className="text-center py-2 font-semibold">{subnet?.netuid || "N/A"}</td>
                  <td className="text-center py-2">{(hyperparams?.adjustment_alpha / 2**64).toFixed(2) || "N/A"}</td>
                  <td className="text-center py-2">{(hyperparams?.max_burn / 10**9).toFixed(4) || "N/A"}</td>
                  <td className="text-center py-2">{(hyperparams?.min_burn / 10**9).toFixed(4) || "N/A"}</td>
                  <td className="text-center py-2">{subnet?.burn?.burn_rate || "N/A"}%  </td>
                  <td className="text-center py-2">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded text-xs",
                        hyperparams?.registration_allowed 
                          ? "bg-green-600/30 text-green-300" 
                          : "bg-red-600/30 text-red-300"
                      )}
                    >
                      {hyperparams?.registration_allowed ? "Allowed" : "Not Allowed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
