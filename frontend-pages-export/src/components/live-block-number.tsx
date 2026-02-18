"use client";

import { useBlockNumber } from "wagmi";
import { polygon } from "wagmi/chains";

export function LiveBlockNumber() {
  const { data, isLoading } = useBlockNumber({
    chainId: polygon.id,
    watch: true,
  });

  return (
    <p className="mt-1 text-base font-semibold text-blue-300">
      {isLoading ? "Reading..." : `Polygon block #${data?.toString() ?? "n/a"}`}
    </p>
  );
}
