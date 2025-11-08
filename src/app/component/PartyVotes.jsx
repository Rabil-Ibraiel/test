"use client";

import { useState } from "react";
import PartyLogo from "./PartyLogo";
import Image from "next/image";

const normNum = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "bigint") {
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  const s = String(val).replace(/\s+/g, " ").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const formatVotes = (val) => {
  const n = normNum(val);
  if (n === null) return "—";
  if (n > 9) return Math.trunc(n).toLocaleString("en-US");
  return Math.trunc(n).toLocaleString("en-US").padStart(2, "0");
};

const formatChairs = (val) => {
  const n = normNum(val);
  if (n === null) return "—";
  const i = Math.trunc(n);
  if (i > 9) return String(i);
  return String(i).padStart(2, "0");
};

const safe = (s, fallback = "") =>
  typeof s === "string" && s.trim() ? s : fallback;

const SkeletonStyles = () => (
  <style jsx global>{`
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
    .skeleton {
      position: relative;
      overflow: hidden;
      background: #e3e6ec;
    }
    .skeleton::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer 1.15s ease-in-out infinite;
    }
  `}</style>
);

const Box = ({ className = "" }) => (
  <div className={`bg-slate-200 rounded animate-pulse ${className}`} />
);

const PartyVotesSkeleton = () => (
  <>
    {/* desktop/tablet row */}
    <div className="w-full lg:h-12 md:h-12 border border-white overflow-hidden md:flex hidden items-center lg:px-4 md:px-2 px-1 rounded relative bg-[rgb(238,241,255)]">
      <Box className="lg:w-1 md:w-[3px] h-full absolute top-0 right-0" />
      <div className="flex items-center gap-2 lg:w-6/12 md:w-[55%] overflow-hidden lg:pr-2">
        <Box className="lg:size-10 md:size-8 size-10" />
        <Box className="h-4 w-44" />
      </div>
      <div className="flex items-center justify-center lg:w-3/12 w-[25%]">
        <Box className="h-5 w-16" />
      </div>
      <div className="flex items-center justify-center lg:w-3/12 w-[25%]">
        <Box className="h-5 w-12" />
      </div>
    </div>

    {/* mobile row */}
    <div className="w-full md:hidden xs:min-h-16 max-xs:min-h-24 h-fit border border-white overflow-hidden flex gap-3 items-center sm:pr-3 px-1.5 rounded relative bg-[rgb(238,241,255)]">
      <Box className="w-1 h-full absolute top-0 right-0" />
      <Box className="min-size-12 xs:size-12 size-16" />
      <div className="w-full flex flex-col gap-2 my-2">
        <Box className="h-4 w-[60%]" />
        <Box className="h-3 w-[80%]" />
        <div className="flex gap-6">
          <Box className="h-3 w-20" />
          <Box className="h-3 w-16" />
        </div>
      </div>
    </div>
  </>
);

const PartyVotes = ({ party, isLoading = false }) => {
  const [hover, setHover] = useState(false);
  if (isLoading || !party) return <PartyVotesSkeleton />;

  const color = safe(party?.color, "rgb(241,240,240)");
  const barColor = safe(party?.color, "#1a286b");
  const abbr = safe(party?.abbr, "placeholder");
  const arabicName = safe(party?.arabicName, "");
  const votesRaw =
    party?.locations?.[0]?.numberOfVoting ?? party?.numberOfVoting ?? null;

  const votes = formatVotes(votesRaw);
  const chairs = formatChairs(party?.thisElecChairs);

  return (
    <>
      {/* Desktop / Tablet row */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-full lg:h-12 md:h-12 border transition-all duration-300 ease-in-out border-white overflow-hidden cursor-pointer text-[rgb(26,40,107)] hover:text-white md:flex hidden items-center lg:px-4 md:px-2 px-1 rounded relative"
        style={{ background: hover ? color : "rgb(241,240,240)" }}
      >
        <div
          className="lg:w-1 md:w-[3px] h-full absolute top-0 right-0 z-10"
          style={{ backgroundColor: barColor }}
        />
        <div className="flex items-center gap-2 lg:w-6/12 md:w-[55%] overflow-hidden lg:pr-2 line-clamp-1">
          <div className="lg:size-10 md:size-8 size-10 lg:p-0.5">
            <PartyLogo abbr={abbr} white={hover} />
          </div>
          <h3 className="lg:text-lg leading-5 font-semibold">{arabicName}</h3>
        </div>

        <div className="flex items-baseline lg:w-3/12 w-[25%] justify-center">
          <h4 className="font-bold text-xl pl-2">
            <span className="digits font-eloquia">{votes}</span>
          </h4>
        </div>

        <div className="flex items-baseline lg:w-3/12 w-[25%] justify-center ">
          <h4 className="font-bold text-xl">
            <span className="digits font-eloquia">{chairs}</span>
          </h4>
        </div>
      </div>

      {/* Mobile card */}
      <div className="w-full md:hidden xs:min-h-16 max-xs:min-h-24 h-fit border transition-all duration-300 ease-in-out border-white overflow-hidden cursor-pointer text-[rgb(26,40,107)] flex gap-3 items-center sm:pr-3 px-1.5 rounded relative">
        <div
          className="w-1 h-full absolute top-0 right-0 z-10"
          style={{ backgroundColor: barColor }}
        />
        <div className="flex items-center overflow-hidden mr-1">
          <div className="min-size-12 xs:size-12 size-16 flex justify-center items-center">
            <Image
              src={`/${abbr}.svg`}
              width={100}
              height={100}
              alt=""
            />
          </div>
        </div>

        <div className="flex w-full mt-2">
          <div className="flex max-xs:flex-col w-full text-wrap">
            <h3 className="xs:w-[40%] h-full flex items-center xs:pb-2 max-xs:pb-1 font-semibold text-lg ">
              {arabicName}
            </h3>

            <div className="flex max-xs:flex-col xs:justify-between xs:items-center sm:pl-4 pl-1 w-[55%] sm:gap-6 xs:gap-4 text-nowrap">
              <div className="flex">
                <h4 className="flex xs:flex-col-reverse items-center md:pr-0 xs:pr-6">
                  <span className="text-base">
                    عدد الأصوات<span className="xs:hidden inline-flex">:</span>
                  </span>
                  <span className="digits font-eloquia text-xl font-bold mr-1">
                    {votes}
                  </span>
                </h4>
              </div>

              <div className="flex">
                <h4 className="flex xs:flex-col-reverse items-center">
                  <span className="text-base">
                    عدد المقاعد<span className="xs:hidden inline-flex">:</span>
                  </span>
                  <span className="digits font-eloquia text-xl font-bold mr-1">
                    {chairs}
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PartyVotes.Skeleton = PartyVotesSkeleton;
export default PartyVotes;
