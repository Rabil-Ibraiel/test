"use client";

import Image from "next/image";
import { useState } from "react";

const PartyVotes = ({ party }) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-full lg:h-12  md:h-12 border transition-all duration-300 ease-in-out border-white overflow-hidden cursor-pointer text-[rgb(26,40,107)] hover:text-white md:flex hidden items-center lg:px-4 md:px-2 px-1 rounded relative"
        style={{ background: hover ? party.color : "rgb(241,240,240)" }}
      >
        <div
          className="lg:w-1 md:w-[3px] h-full absolute top-0 right-0 z-10"
          style={{ backgroundColor: party.color }}
        />
        <div className="flex items-center gap-2 lg:w-6/12 md:w-[55%] overflow-hidden lg:pr-2 line-clamp-1">
          <div className="lg:size-10 md:size-8 size-10 lg:p-0.5">
            {hover ? (
              <Image
                src={`/${party.abbr}-W.png`}
                width={"100"}
                height={"100"}
                alt=""
              />
            ) : (
              <Image
                src={`/${party.abbr}.png`}
                width={"100"}
                height={"100"}
                alt=""
              />
            )}
          </div>
          <h3 className="lg:text-lg leading-5 font-semibold">
            {party.arabicName}
          </h3>
        </div>

        <div className="flex items-baseline lg:w-3/12 w-[25%] justify-center">
          <h4 className="font-bold text-xl pl-2">
            <span className="digits font-eloquia">
              {String(
                party?.locations
                  ? party?.locations[0].numberOfVoting
                  : party.numberOfVoting
              )}
            </span>
          </h4>
        </div>

        <div className="flex items-baseline lg:w-3/12 w-[25%] justify-center ">
          <h4 className="font-bold text-xl">
            <span className="digits font-eloquia">
              {party.thisElecChairs > 9
                ? party.thisElecChairs
                : `0${party.thisElecChairs}`}
            </span>
          </h4>
        </div>
      </div>
      <div className="w-full md:hidden xs:min-h-16 max-xs:min-h-24 h-fit border transition-all duration-300 ease-in-out border-white overflow-hidden cursor-pointer text-[rgb(26,40,107)] flex gap-3 items-center sm:pr-3 px-1.5 rounded relative">
        <div
          className="w-1 h-full absolute top-0 right-0 z-10"
          style={{ backgroundColor: party.color }}
        />
        <div className="flex items-center overflow-hidden mr-1">
          <div className="min-size-12 xs:size-12 size-16 flex justify-center items-center">
            <Image
              src={`/${party.abbr}.png`}
              width={"100"}
              height={"100"}
              alt=""
            />
          </div>
        </div>

        <div className="flex w-full mt-2">
          <div className="flex max-xs:flex-col w-full text-wrap">
            <h3 className="xs:w-[40%] h-full flex items-center xs:pb-2 max-xs:pb-1 font-semibold text-lg ">
              {party.arabicName}
            </h3>
            <div className="flex max-xs:flex-col xs:justify-between xs:items-center sm:pl-4 pl-1 w-[55%] sm:gap-6 xs:gap-4 text-nowrap">
              <div className="flex">
                <h4 className="flex xs:flex-col-reverse items-center md:pr-0 xs:pr-6">
                  <span className="text-base">
                    عدد الأصوات<span className="xs:hidden inline-flex">:</span>
                  </span>

                  <span className="digits font-eloquia text-xl font-bold mr-1">
                    {String(
                      party?.locations
                        ? party?.locations[0].numberOfVoting
                        : party.numberOfVoting
                    )}
                  </span>
                </h4>
              </div>
              <div className="flex">
                <h4 className="flex xs:flex-col-reverse items-center">
                  <span className="text-base">
                    عدد المقاعد<span className="xs:hidden inline-flex">:</span>
                  </span>
                  <span className="digits font-eloquia text-xl font-bold mr-1">
                    {party.thisElecChairs > 9
                      ? party.thisElecChairs
                      : `0${party.thisElecChairs}`}
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

export default PartyVotes;
