"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getParties } from "../actions/getParties";


const SkeletonStyles = () => (
  <style jsx global>{`
    /* subtle shimmer on inner line */
    @keyframes sk-shimmer {
      100% {
        transform: translateX(100%);
      }
    }
    .sk-line {
      position: relative;
      overflow: hidden;
      background: #e6eaf2;
    }
    .sk-line::after {
      content: "";
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.55) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: sk-shimmer 1.1s ease-in-out infinite;
    }

    /* marquee loop for skeleton track (two identical halves → seamless) */
    @keyframes marquee-rtl {
      0% {
        transform: translate3d(-50%, 0, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes marquee-ltr {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(-50%, 0, 0);
      }
    }
    .marquee-track {
      will-change: transform;
      animation-duration: 22s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    .marquee-rtl {
      animation-name: marquee-rtl;
    }
    .marquee-ltr {
      animation-name: marquee-ltr;
    }

    @media (prefers-reduced-motion: reduce) {
      .marquee-track {
        animation: none;
      }
      .sk-line::after {
        animation: none;
      }
    }
  `}</style>
);

const TileSkeleton = () => (
  <div className="h-12 min-w-[280px] max-w-[35vw] bg-[#DDE2EF] even:bg-[#E9ECF6] relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="sk-line h-3 w-1/2 rounded" />
    </div>
  </div>
);

const PartyChairsSkeleton = () => {

  const HALF = Array.from({ length: 8 }, (_, i) => <TileSkeleton key={i} />);
  return (
    <>
      <SkeletonStyles />
      <div className="w-full lg:h-10 h-8 overflow-hidden flex items-center">
        <div className="w-full">
          <div className="marquee-track marquee-rtl flex whitespace-nowrap">
            {HALF}
            {HALF}
          </div>
        </div>
      </div>
    </>
  );
};


const parseColor = (color) => {
  if (!color) return [0, 0, 0];
  if (color.startsWith("#")) {
    const h = color.slice(1);
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return [r, g, b];
  }
  const m = color.match(/\d+/g);
  return m ? m.map(Number) : [0, 0, 0];
};

const lightenColor = (color, k = 0.18) => {
  const [r, g, b] = parseColor(color);
  const L = (c) => Math.round(c + (255 - c) * k);
  return `rgb(${L(r)}, ${L(g)}, ${L(b)})`;
};

const PartyChairs = () => {
  const [click, setClick] = useState("");
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);


  useEffect(() => {
    let alive = true;
    setLoading(true);
    getParties()
      .then((data) => {
        if (alive) setParties(data || []);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    pausedRef.current = Boolean(click);
  }, [click]);

  useEffect(() => {
    if (!trackRef.current) return;
    let rafId;
    let last = performance.now();
    const SPEED = 60;
    const halfWidthRef = { current: 0 };
    const xRef = { current: 0 };

    const recalcHalf = () => {
      const track = trackRef.current;
      if (!track) return;
      halfWidthRef.current = track.scrollWidth / 2;
    };

    recalcHalf();
    window.addEventListener("resize", recalcHalf);

    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      const track = trackRef.current;
      if (!track) {
        rafId = requestAnimationFrame(step);
        return;
      }
      let x = xRef.current || 0;

      if (!pausedRef.current) x += SPEED * dt;

      const halfWidth = halfWidthRef.current || track.scrollWidth / 2;
      if (halfWidth && x >= halfWidth) x -= halfWidth;

      xRef.current = x;
      track.style.transform = `translate3d(${x}px,0,0)`;
      rafId = requestAnimationFrame(step);
    };

    trackRef.current.style.transform = "translate3d(0,0,0)";
    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", recalcHalf);
    };
  }, [parties]);

  const marqueeItems = useMemo(() => [...parties, ...parties], [parties]);
  const selected = useMemo(
    () => parties.find((p) => p.abbr === click),
    [parties, click]
  );

  if (loading) return <PartyChairsSkeleton />;

  return (
    <>
      {parties.length > 0 && (
        <div
          ref={wrapperRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => {
            if (!click) pausedRef.current = false;
          }}
          className="w-full lg:h-10 h-8 overflow-hidden flex items-center relative text-[rgb(26,40,107)]"
        >
          {/* Track */}
          <div
            style={{ width: "100%" }}
            className="flex-1 mask-[linear-gradient(to_right,transparent,black_6%,black_95%,transparent)]"
          >
            <div
              ref={trackRef}
              className="flex whitespace-nowrap will-change-transform"
              style={{ transform: "translate3d(0,0,0)" }}
            >
              {marqueeItems.map((party, i) => {
                const hoverColor = lightenColor(party.color, 0.18);
                return (
                  <div
                    key={`${party.abbr}-${i}`}
                    onClick={() => setClick(party.abbr)}
                    className="h-12 group transition-all duration-300 cursor-pointer flex items-center justify-center relative bg-[#D3D7E9] even:bg-[#E9EBF4] min-w-[280px] max-w-[35vw] overflow-hidden"
                    style={{
                      ["--party-color"]: party.color,
                      ["--party-color-hover"]: hoverColor,
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      style={{ background: "var(--party-color-hover)" }}
                    />
                    <div
                      style={{ backgroundColor: party.color }}
                      className="w-full lg:h-2 h-[11px] absolute top-0 left-0"
                    />
                    <p className="lg:text-xl text-lg font-bold text-center absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                      {party.arabicName}
                    </p>
                    <p className="w-full lg:text-3xl text-2xl text-center font-bold absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 text-white font-eloquia">
                      {party.thisElecChairs}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overlay (click card) */}
          <AnimatePresence initial={false} mode="wait">
            {click && selected && (
              <motion.div
                key={selected.abbr}
                onClick={() => setClick("")}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "tween", duration: 0.45, ease: "easeInOut" }}
                className="w-full h-full overflow-hidden rounded flex items-center absolute top-0 left-0 z-[100] cursor-pointer"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Column 1 */}
                <div
                  className="w-[35%] h-full flex items-center justify-center text-center"
                  style={{ backgroundColor: selected.color }}
                >
                  <h3 className="lg:text-2xl text-white text-lg font-bold leading-5 pb-1">
                    {selected.arabicName}
                  </h3>
                </div>

                {/* Column 2 */}
                <div
                  className="lg:w-[20%] w-[22%] h-full flex items-center justify-between lg:px-4 md:px-3 sm:px-2 lg:text-2xl text-lg font-bold text-white"
                  style={{
                    backgroundImage: `linear-gradient(0deg, ${selected.color}, color-mix(in oklab, ${selected.color} 88%, white))`,
                  }}
                >
                  <h4 className="flex items-baseline lg:gap-2 md:gap-1 gap-0.5">
                    <p className="digits font-eloquia lg:text-2xl text-lg font-bold mr-1">
                      {selected.thisElecChairs}
                    </p>
                    <span className="font-bold">مقعدا</span>
                  </h4>
                  <p className="digits font-eloquia lg:text-2xl text-lg font-bold mr-1.5">
                    2025
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="w-2 h-full"
                  style={{
                    backgroundImage: `linear-gradient(0deg, ${selected.color}, color-mix(in oklab, ${selected.color} 86%, black))`,
                  }}
                />

                {/* Column 3 */}
                <div
                  style={{
                    backgroundImage: `linear-gradient(0deg, ${selected.color}, color-mix(in oklab, ${selected.color} 88%, white))`,
                  }}
                  className="lg:w-[20%] w-[22%] h-full flex items-center justify-between lg:px-4 md:px-3 sm:px-2 text-white lg:text-2xl text-lg"
                >
                  <h4 className="flex items-baseline lg:gap-2 md:gap-1 gap-0.5">
                    <p className="digits font-eloquia lg:text-2xl text-lg font-bold">
                      {selected.lastElecChairs}
                    </p>
                    <span className="font-bold">مقعدا</span>
                  </h4>
                  <p className="digits font-eloquia lg:text-2xl text-lg font-bold mr-1.5">
                    2021
                  </p>
                </div>

                {/* Column 4 */}
                <div className="lg:w-[30%] w-[21%] h-full flex items-center justify-center bg-[rgb(64,104,165)] text-white lg:text-2xl text-lg ">
                  <h4 className="flex gap-2">
                    <p className="font-bold font-eloquia">{selected.numberOfVoting}</p>
                    <span className="font-semibold">صوت</span>
                  </h4>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default PartyChairs;
