"use client";
import { useEffect, useState } from "react";
import { getPartiesByRegion, getTopParties } from "../actions/getParties";
import PartyVotes from "./PartyVotes";

export default function PartyVotesWrapper({ selectedRegion }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setParties([]);

    (async () => {
      try {
        if (!selectedRegion) {
          const data = await getTopParties();
          if (alive) setParties(data || []);
        } else {
          const normalizedCode = selectedRegion.replace("-", "_");
          const data = await getPartiesByRegion(normalizedCode);
          if (alive) setParties(data || []);
          console.log(data);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedRegion]);

  const skeletonCount = 6;

  return (
    <div className="lg:w-2/3 md:w-8/12 w-full rounded overflow-hidden flex flex-col lg:gap-3 gap-2">
      <div className="w-full min-h-10 border transition-all duration-300 ease-in-out overflow-hidden bg-linear-to-t from-[#275394] to-[#4169A5] text-[rgb(241,240,240)] hidden md:flex items-center justify-between lg:px-4 rounded font-bold">
        <div className="flex items-center md:w-6/12 overflow-hidden pr-2 ">
          <span>اسم الحزب</span>
        </div>
        <div className="lg:w-3/12 w-[25%] flex items-center justify-center">
          <span>عدد الأصوات</span>
        </div>
        <div className="lg:w-3/12 w-[25%] flex items-center justify-center ">
          <span>عدد المقاعد</span>
        </div>
      </div>

      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <PartyVotes.Skeleton key={`sk-${i}`} />
          ))
        : parties.map((party) => <PartyVotes key={party.id} party={party} />)}
    </div>
  );
}
