"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getParties } from "../actions/getParties";

// --- color helpers ---
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
  // "rgb(r, g, b)"
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

  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    getParties().then((data) => setParties(data));
  }, []);

  // ⬇️ Marquee loop (true infinite, no gaps)
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

      // Arabic direction: move RIGHT
      if (!pausedRef.current) x += SPEED * dt;

      const halfWidth = halfWidthRef.current || track.scrollWidth / 2;

      if (halfWidth && x >= halfWidth) x -= halfWidth;

      xRef.current = x;
      track.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(step);
    };

    trackRef.current.style.transform = "translateX(0px)";
    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", recalcHalf);
    };
  }, [parties]);

  const marqueeItems = [...parties, ...parties];

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="w-full lg:h-10 h-8 overflow-hidden flex items-center relative text-[rgb(26,40,107)]"
    >
      <>
        {/* ⬇️ Marquee track */}
        <div style={{ width: "100%" }} className="flex-1 mask-[linear-gradient(to_right,transparent,black_6%,black_95%,transparent)]">
          <div
            ref={trackRef}
            className="flex whitespace-nowrap will-change-transform"
            style={{ transform: "translateX(0px)" }}
          >
            {marqueeItems.map((party, i) => {
              const hoverColor = lightenColor(party.color, 0.18);
              return (
                <div
                  key={`${party.abbr}-${i}`}
                  onClick={() => {
                    pausedRef.current = true;
                    setClick(party.abbr);
                  }}
                  className="h-12 group transition-all duration-300 cursor-pointer flex items-center justify-center relative bg-[#D3D7E9] even:bg-[#E9EBF4] min-w-[280px] max-w-[35vw] overflow-hidden"
                  style={{
                    ["--party-color"]: party.color,
                    ["--party-color-hover"]: hoverColor,
                  }}
                >
                  {/* hover background via a brighter party color */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ background: "var(--party-color-hover)" }}
                  />

                  {/* top accent bar keeps the original party color */}
                  <div
                    style={{ backgroundColor: party.color }}
                    className="w-full lg:h-2 h-[11px] absolute top-0 left-0"
                  />

                  {/* swap text on hover */}
                  <p className="lg:text-xl text-lg font-bold text-center absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                    {party.arabicName}
                  </p>
                  <p className="w-full lg:text-3xl text-2xl text-center font-bold absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 text-white font-eloquia">
                    {party.thisYearChairs}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⬇️ Click overlay (unchanged) */}
        <AnimatePresence mode="wait" onExitComplete={() => (pausedRef.current = false)}>
          {click && (
            <motion.div
              key={click}
              onClick={() => setClick("")}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full h-full overflow-hidden rounded flex items-center absolute top-0 left-0 z-10 cursor-pointer"
            >
              {/* Column 1 */}
              <div
                className="w-[35%] h-full flex items-center justify-center text-center"
                style={{ backgroundColor: parties.find((p) => p.abbr === click)?.color }}
              >
                <h3 className="lg:text-2xl text-white text-lg font-bold leading-5 pb-1">
                  {parties.find((p) => p.abbr === click)?.arabicName}
                </h3>
              </div>

              {/* Column 2 */}
              <div
                className="lg:w-[20%] w-[22%] h-full flex items-center justify-between lg:px-4 md:px-3 sm:px-2 lg:text-2xl text-lg font-bold text-white"
                  style={{
    backgroundImage: `linear-gradient(0deg, ${parties.find((p) => p.abbr === click)?.color}, color-mix(in oklab, ${parties.find((p) => p.abbr === click)?.color} 88%, white))`,
  }}
              >
                <h4 className="flex items-baseline lg:gap-2 md:gap-1 gap-0.5">
                  <p className="digits font-eloquia lg:text-2xl text-lg font-bold mr-1">
                    {parties.find((p) => p.abbr === click)?.thisYearChairs}
                  </p>
                  <p className="font-bold">مقعدا</p>
                </h4>
                <p className="digits font-eloquia lg:lg:text-2xl text-lg font-bold mr-1.5">2025</p>
              </div>

              {/* Divider */}
              <div className="divider w-2 h-full bg-white" style={{
    backgroundImage: `linear-gradient(0deg, ${parties.find((p) => p.abbr === click)?.color}, color-mix(in oklab, ${parties.find((p) => p.abbr === click)?.color} 86%, black))`,
  }} />

              {/* Column 3 */}
              <div
                style={{
    backgroundImage: `linear-gradient(0deg, ${parties.find((p) => p.abbr === click)?.color}, color-mix(in oklab, ${parties.find((p) => p.abbr === click)?.color} 88%, white))`,
  }}
                className="lg:w-[20%] w-[22%] h-full flex items-center justify-between lg:px-4 md:px-3 sm:px-2 text-white lg:text-2xl text-lg"
              >
                <h4 className="flex items-baseline lg:gap-2 md:gap-1 gap-0.5">
                  <p className="digits font-eloquia lg:text-2xl text-lg font-bold">
                    {parties.find((p) => p.abbr === click)?.lastYearChairs}
                  </p>
                  <p className="font-bold">مقعدا</p>
                </h4>
                <p className="digits font-eloquia lg:text-2xl text-lg font-bold mr-1.5">2021</p>
              </div>

              {/* Column 4 */}
              <div className="lg:w-[30%] w-[21%] h-full flex items-center justify-center bg-[rgb(64,104,165)] text-white lg:text-2xl text-lg ">
                <h4 className="flex gap-2">
                  <p className="font-bold font-eloquia">
                    {parties.find((p) => p.abbr === click)?.numberOfVoting}
                  </p>
                  <p className="font-semibold">صوت</p>
                </h4>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
};

export default PartyChairs;
