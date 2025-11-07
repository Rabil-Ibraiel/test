"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const BREAKPOINTS = { md: 700, lg: 1024 };

const getMinBarPx = () => 400;
const getMaxBarPx = (vw, cardW) =>
  vw >= BREAKPOINTS.lg ? Math.min(1125, cardW + 60) : cardW + 60;

const normNum = (val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  if (typeof val === "bigint") {
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(String(val).trim());
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

const safeStr = (s, fallback = "") =>
  typeof s === "string" && s.trim() ? s : fallback;

const PartyCard = ({ party }) => {
  if (!party) return null;

  const id = safeStr(party?.abbr, "PDK");
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
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
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

  const votesRaw = party?.numberOfVoting ?? null;
  const votesN = normNum(votesRaw) ?? 0;

  const votingRatio = Math.max(0, Math.min(1, votesN / 1_000_000));
  const percent = Math.round(votingRatio * 100);

  let finalWidthPx = 0;
  let maxCapPx = 0;
  if (isMdUp && cardW > 0) {
    const minBarPx = getMinBarPx();
    maxCapPx = getMaxBarPx(vw, cardW);
    const maxWidthPx = maxCapPx;
    const minWidthPx = Math.min(minBarPx, maxWidthPx);
    const widthRange = Math.max(0, maxWidthPx - minWidthPx);
    const raw = minWidthPx + widthRange * (percent / 100);
    finalWidthPx = Math.min(maxWidthPx, Math.ceil(raw));
  }

  const color = safeStr(party?.color, "rgb(238,241,255)");
  const barColor = safeStr(party?.color, "#1a286b");
  const abbr = safeStr(party?.abbr, "placeholder");
  const arabicName = safeStr(party?.arabicName, "");

  const votes = formatVotes(votesRaw);
  const chairs = formatChairs(party?.thisElecChairs);

  return (
    <article
      id={id}
      dir="rtl"
      ref={cardRef}
      aria-expanded={isMdUp ? open : false}
      onClick={() => {
        if (isMdUp) setOpen((s) => !s);
      }}
      className="group sm:h-16 h-full w-full rounded overflow-hidden bg-[rgb(238,241,255)] md:cursor-pointer cursor-default border border-white flex items-center justify-between relative sm:pr-4 pr-3 sm:pl-10 pl-2"
    >
      <div
        className="w-1 h-full absolute top-0 right-0"
        style={{ backgroundColor: barColor }}
      />

      {/* Bar only when md+ */}
      {isMdUp && (
        <AnimatePresence>
          {open && (
            <motion.div
              key={`${id}-bar-${finalWidthPx}`}
              className="h-full absolute top-0 right-0 z-20"
              style={{
                backgroundColor: barColor,
                maxWidth: maxCapPx || cardW || undefined,
                willChange: "width, opacity",
              }}
              initial={{ width: 0 }}
              animate={{
                width: finalWidthPx || 0,
                transition: {
                  type: "tween",
                  duration: 0.75,
                  ease: "easeInOut",
                },
              }}
              exit={{
                width: 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <div className="flex flex-col text-white absolute top-1/2 -translate-y-1/2 left-3 justify-center items-center">
                <motion.p
                  className="digits font-eloquia text-3xl font-bold text-white"
                  style={{ left: 12 }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      type: "tween",
                      duration: 0.75,
                      ease: "easeInOut",
                    },
                  }}
                  exit={{ opacity: 0 }}
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
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { type: "tween", duration: 0.75, ease: "easeInOut" },
          }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12">
              <Image
                src={`/${abbr}-W.png`}
                width={100}
                height={100}
                alt={`${arabicName} شعار`}
              />
            </div>
            <h3 className="font-bold text-white text-xl">{arabicName}</h3>
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
                transition: {
                  type: "tween",
                  duration: 0.75,
                  ease: "easeInOut",
                },
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2 w-6/12">
          <div className="min-size-8 size-11 max-size-12 flex justify-center items-center">
            <Image
              src={`/${abbr}.png`}
              width={100}
              height={100}
              alt={`${arabicName} شعار`}
            />
          </div>
          <h3 className="font-semibold sm:text-xl text-lg">{arabicName}</h3>
        </div>

        <div className="flex flex-col-reverse items-center w-3/12 justify-center">
          <span>مقعد</span>
          <h4 className="digits font-eloquia text-2xl font-bold">{chairs}</h4>
        </div>

        <div className="flex flex-col-reverse items-center w-3/12 justify-center">
          <span>صوت</span>
          <h4 className="digits font-eloquia text-2xl font-bold">{votes}</h4>
        </div>
      </motion.div>

      {/* Mobile layout */}
      <div className="xs:hidden w-full h-fit flex gap-3 items-center relative">
        <div className="flex items-center overflow-hidden line-clamp-1">
          <div className="min-size-12 xs:size-12 size-16 flex justify-center items-center">
            <Image src={`/${abbr}.png`} width={100} height={100} alt="" />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-1 my-1">
          <h3 className="w-full h-full flex items-center xs:pb-2 max-xs:pb-1 font-semibold text-lg">
            {arabicName}
          </h3>

          <div className="flex items-center justify-center text-nowrap">
            <span className="text-base">عدد المقاعد:</span>
            <h4 className="digits font-eloquia text-xl font-bold mr-1">
              {chairs}
            </h4>
          </div>

          <div className="flex items-center sm:w-3/12 justify-center text-nowrap">
            <span className="text-base">عدد الأصوات:</span>
            <h4 className="digits font-eloquia text-xl font-bold mr-1">
              {votes}
            </h4>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PartyCard;
