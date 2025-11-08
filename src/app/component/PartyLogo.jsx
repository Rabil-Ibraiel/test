import PDK from "@/assets/PDK.svg";
import PDKW from "@/assets/PDK-W.svg";
import ASI from "@/assets/ASI.svg";
import ASIW from "@/assets/ASI-W.svg";
import AZM from "@/assets/AZM.svg";
import AZMW from "@/assets/AZM-W.svg";
import BADR from "@/assets/BADR.svg";
import BADRW from "@/assets/BADR-W.svg";
import BSHR from "@/assets/BSHR.svg";
import BSHRW from "@/assets/BSHR-W.svg";
import EDC from "@/assets/EDC.svg";
import EDCW from "@/assets/EDC-W.svg";
import NDC from "@/assets/NDC.svg";
import NDCW from "@/assets/NDC-W.svg";
import NSFC from "@/assets/NSFC.svg";
import NSFCW from "@/assets/NSFC-W.svg";
import PUK from "@/assets/PUK.svg";
import PUKW from "@/assets/PUK-W.svg";
import SDQ from "@/assets/SDQ.svg";
import SDQW from "@/assets/SDQ-W.svg";
import SER from "@/assets/SER.svg";
import SERW from "@/assets/SER-W.svg";
import SIA from "@/assets/SIA.svg";
import SIAW from "@/assets/SIA-W.svg";
import SOL from "@/assets/SOL.svg";
import SOLW from "@/assets/SOL-W.svg";
import TQD from "@/assets/TQD.svg";
import TQDW from "@/assets/TQD-W.svg";

const LOGOS = {
  PDK: { color: PDK, white: PDKW },
  ASI: { color: ASI, white: ASIW },
  AZM: { color: AZM, white: AZMW },
  BADR: { color: BADR, white: BADRW },
  BSHR: { color: BSHR, white: BSHRW },
  EDC: { color: EDC, white: EDCW },
  NDC: { color: NDC, white: NDCW },
  NSFC: { color: NSFC, white: NSFCW },
  PUK: { color: PUK, white: PUKW },
  SDQ: { color: SDQ, white: SDQW },
  SER: { color: SER, white: SERW },
  SIA: { color: SIA, white: SIAW },
  SOL: { color: SOL, white: SOLW },
  TQD: { color: TQD, white: TQDW },
};

export default function PartyLogo({ abbr, white = false, className = "" }) {
  const raw = (abbr || "").trim();
  const base = raw.replace(/-W$/i, "").toUpperCase();   // normalize
  const wantWhite = white || /-W$/i.test(raw);

  const entry = LOGOS[base];

  // Choose component variant if available
  let LogoCmp = entry ? (wantWhite ? entry.white : entry.color) : undefined;

  // If color is missing, fall back to white; if white missing, fall back to color
  if (entry && !LogoCmp) {
    LogoCmp = wantWhite ? entry.color : entry.white;
  }

  // Final fallback to public path so it never disappears
  if (!LogoCmp || typeof LogoCmp === "string") {
    const publicSrc = `/${base}${wantWhite ? "-W" : ""}.svg`;
    return (
      <img
        src={publicSrc}
        alt={`${base} logo`}
        className={className || "block w-full h-full"}
        style={{ objectFit: "contain" }}
        loading="eager"
        decoding="async"
      />
    );
  }

  // Inline SVG component (instant)
  return (
    <LogoCmp
      className={className || "block w-full h-full"}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`${base} logo`}
      focusable="false"
    />
  );
}
