"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const BREAKPOINTS = { md: 700, lg: 1024 };

const getMinBarPx = () => 400;

const getMaxBarPx = (vw, cardW) =>
  vw >= BREAKPOINTS.lg ? Math.min(1125, cardW+60) : cardW+60;

const PartyCard = ({ party }) => {
  const id = party?.abbr || "PDK";
  const [open, setOpen] = useState(false);

  const cardRef = useRef(null);
  const [cardW, setCardW] = useState(0);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let raf = 0;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCardW(w));
    });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const [isMdUp, setIsMdUp] = useState(false);
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const apply = () => setVw(window.innerWidth);
    apply();
    window.addEventListener("resize", apply);
    const mq = window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`);
    const onChange = (e) => setIsMdUp(e.matches);
    setIsMdUp(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("resize", apply);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Voting → percent (0..100)
  const votingRatio = Math.min(
    1,
    Math.max(0, Number(party.numberOfVoting) / 1_000_000)
  );
  const percent = Math.round(votingRatio * 100);

  // Final width calculation (only when md+ and we know sizes)
  let finalWidthPx = 0;
  let maxCapPx = 0;
  if (isMdUp && cardW > 0) {
    const minBarPx = getMinBarPx();
    maxCapPx = getMaxBarPx(vw, cardW); // ← cap to the CARD width
    const maxWidthPx = maxCapPx;
    const minWidthPx = Math.min(minBarPx, maxWidthPx);
    const widthRange = Math.max(0, maxWidthPx - minWidthPx);
    // round up a hair so 100% truly hits the edge (avoids sub-pixel gap)
    const raw = minWidthPx + widthRange * (percent / 100);
    finalWidthPx = Math.min(maxWidthPx, Math.ceil(raw));
  }

  return (
    <div
      id={id}
      dir="rtl"
      ref={cardRef}
      aria-expanded={isMdUp ? open : false}
      onClick={() => { if (isMdUp) setOpen((s) => !s); }}
      className="group sm:h-16 h-full w-full rounded overflow-hidden bg-[rgb(238,241,255)] md:cursor-pointer cursor-default border border-white flex items-center justify-between relative sm:pr-4 pr-3 sm:pl-10 pl-2"
    >
      <div className="w-1 h-full absolute top-0 right-0" style={{ backgroundColor: party.color }} />

      {/* Bar only when md+ */}
      {isMdUp && (
        <AnimatePresence>
          {open && (
            <motion.div
              key={`${id}-bar`}
              className="h-full absolute top-0 right-0 z-20"
              style={{
                backgroundColor: party.color,
                maxWidth: maxCapPx || cardW, // ensure it can reach the end
                willChange: "width, opacity",
              }}
              exit={{ width: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
              animate={{
                width: [0, finalWidthPx],
                transition: { type: "tween", duration: 0.75, ease: "easeInOut" },
              }}
            >
              <div className="flex flex-col text-white absolute top-1/2 -translate-y-1/2 left-3 justify-center items-center">
                <motion.p
                className="digits font-eloquia text-3xl font-bold  text-white"
                style={{ left: 12 }}
                animate={{
                  opacity: open ? [0, 1] : 0,
                  transition: { type: "tween", duration: 0.75, ease: "easeInOut" },
                }}
              >
                <span className="text-xl font-normal">%</span>
                {percent}
                
              </motion.p>
              <span className="text-xs font-normal">نسبة التصويت</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Overlay title (md+ only) */}
      {isMdUp && open && (
        <motion.div
          className="flex items-center justify-between w-full absolute z-30"
          animate={{ opacity: open ? [0, 1] : 0, transition: { type: "tween", duration: 0.75, ease: "easeInOut" } }}
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12">
              <Image src={`/${party.abbr}-W.png`} width={100} height={100} alt={`${party.arabicName} شعار`} />
            </div>
            <h2 className="font-bold text-white text-xl">{party.arabicName}</h2>
          </div>
        </motion.div>
      )}

      {/* Base row */}
      <motion.div
        className="xs:flex hidden items-center justify-between w-full relative"
        animate={
          isMdUp
            ? {
                x: open ? "100%" : 0,
                opacity: open ? [1, 0] : 1,
                transition: { type: "tween", duration: 0.75, ease: "easeInOut" },
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2 w-6/12">
          <div className="min-size-8 size-11 max-size-12 flex justify-center items-center">
            <Image src={`/${party.abbr}.png`} width={100} height={100} alt={`${party.arabicName} شعار`} />
          </div>
          <h2 className="font-semibold sm:text-xl text-lg">{party.arabicName}</h2>
        </div>

        <div className="flex flex-col-reverse items-center w-3/12 justify-center">
          <p>مقعد</p>
          <p className="digits font-eloquia text-2xl font-bold">
            {party.thisYearChairs > 9 ? party.thisYearChairs : `0${party.thisYearChairs}`}
          </p>
        </div>

        <div className="flex flex-col-reverse items-center w-3/12 justify-center">
          <p>صوت</p>
          <p className="digits font-eloquia text-2xl font-bold">{party.numberOfVoting}</p>
        </div>
      </motion.div>

      {/* Mobile layout */}
      <div className="xs:hidden w-full h-fit flex gap-3 items-center relative">
        <div className="flex items-center overflow-hidden line-clamp-1">
                  <div className="min-size-12 xs:size-12 size-16 flex justify-center items-center">
                    <Image
                        src={`/${party.abbr}.png`}
                        width={"100"}
                        height={"100"}
                        alt=""
                      />
                  </div>
                </div>

        <div className="w-full flex flex-col items-start gap-1 my-1">
          <h2 className="w-full h-full flex items-center xs:pb-2 max-xs:pb-1 font-semibold text-lg">{party.arabicName}</h2>

          <div className="flex items-center justify-center text-nowrap">
            <p className="text-base">عدد المقاعد:</p>
            <p className="digits font-eloquia text-xl font-bold mr-1">
              {party.thisYearChairs > 9 ? party.thisYearChairs : `0${party.thisYearChairs}`}
            </p>
          </div>

          <div className="flex items-center sm:w-3/12 justify-center text-nowrap">
            <p className="text-base">عدد الأصوات:</p>
            <p className="digits font-eloquia text-xl font-bold mr-1">{party.numberOfVoting}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyCard;
