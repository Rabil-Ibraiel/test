"use client";
import { useEffect, useState } from "react";
import { getPartiesByRegion, getTopParties } from "../actions/getParties";
import PartyVotes from "./PartyVotes";

export default function PartyVotesWrapper({ selectedRegion }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!selectedRegion) {
      getTopParties().then((data) => {
        setParties(data);
        setLoading(false);
      });
    } else {
      const normalizedCode = selectedRegion.replace("-", "_");
      getPartiesByRegion(normalizedCode).then((data) => {
        setParties(data);
        setLoading(false);
      });
    }
  }, [selectedRegion]);
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
      {loading ? (
        <div
          role="status"
          className="w-full min-h-24 h-full flex items-center justify-center"
        >
          <svg
            aria-hidden="true"
            className="md:size-16 size-12 text-gray-200 animate-spin  fill-[rgb(53,94,157)]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        parties.map((party) => <PartyVotes key={party.id} party={party} />)
      )}
    </div>
  );
}
