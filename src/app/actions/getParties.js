// src/app/actions/getParties.js
"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache"; // ← use unstable_ and alias

export async function getPartiesByRegion(regionCode) {
  const rows = await prisma.location.findMany({
    where: { regionCode },
    orderBy: { numberOfVoting: "desc" },
    take: 6,
    select: {
      numberOfVoting: true, // Int
      thisElecChairs: true,
      party: {
        select: {
          id: true,
          arabicName: true,
          abbr: true,
          color: true,
        },
      },
    },
  });

  // Flatten: return party info + region votes
  return rows.map((r) => ({
    ...r.party,
    regionCode,
    numberOfVoting: r.numberOfVoting, // already Int
    thisElecChairs: r.thisElecChairs,
  }));
}

export async function getTopParties() {
  const SPECIAL_ABBR = "PDK"; // ← put the unique abbr of الحزب الديموقراطي here

  const special = await prisma.party.findFirst({
    where: { abbr: SPECIAL_ABBR },
     select: {
      id: true,
      arabicName: true,
      abbr: true,
      numberOfVoting: true,
      color: true,
      thisElecChairs: true,
      lastElecChairs: true,
    },
  });

  const rest = await prisma.party.findMany({
    where: { abbr: { not: SPECIAL_ABBR } },
    orderBy: { numberOfVoting: "desc" },
     select: {
      id: true,
      arabicName: true,
      abbr: true,
      numberOfVoting: true,
      color: true,
      thisElecChairs: true,
      lastElecChairs: true,
    },
  });
  
  const all = special ? [special, ...rest] : rest; // always puts the special party first
  return all.slice(0, 6);
}

export async function getParties() {
  return prisma.party.findMany({
    include: {
      locations: true,
    },
  });
}



export async function getPartiesCard() {
  noStore();
  const SPECIAL_ABBR = "PDK"; // ← put the unique abbr of الحزب الديموقراطي here

  const special = await prisma.party.findFirst({
    where: { abbr: SPECIAL_ABBR },
    include: { locations: true },
  });

  const rest = await prisma.party.findMany({
    where: { abbr: { not: SPECIAL_ABBR } },
    include: { locations: true },
    orderBy: { numberOfVoting: "desc" },
  });
  
  return special ? [special, ...rest] : rest; // always puts the special party first
}
