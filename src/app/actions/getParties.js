
"use server";

import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function getPartiesByRegion(regionCode) {
  const SPECIAL_ABBR = "PDK";

  const specialRow = await prisma.location.findFirst({
    where: { regionCode, party: { abbr: SPECIAL_ABBR } },
    select: {
      numberOfVoting: true,
      thisElecChairs: true,
      party: {
        select: { id: true, arabicName: true, abbr: true, color: true },
      },
    },
  });

  const restRows = await prisma.location.findMany({
    where: { regionCode, party: { abbr: { not: SPECIAL_ABBR } } },
    orderBy: { numberOfVoting: "desc" },
    take: 6 - (specialRow ? 1 : 0),
    select: {
      numberOfVoting: true,
      thisElecChairs: true,
      party: {
        select: { id: true, arabicName: true, abbr: true, color: true },
      },
    },
  });

  const rows = specialRow ? [specialRow, ...restRows] : restRows;

  return rows.map((r) => ({
    ...r.party,
    regionCode,
    numberOfVoting: r.numberOfVoting,
    thisElecChairs: r.thisElecChairs,
  }));
}

export async function getTopParties() {
  const SPECIAL_ABBR = "PDK";

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

  const all = special ? [special, ...rest] : rest;
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
  const SPECIAL_ABBR = "PDK";

  const special = await prisma.party.findFirst({
    where: { abbr: SPECIAL_ABBR },
    include: { locations: true },
  });

  const rest = await prisma.party.findMany({
    where: { abbr: { not: SPECIAL_ABBR } },
    include: { locations: true },
    orderBy: { numberOfVoting: "desc" },
  });

  return special ? [special, ...rest] : rest;
}

export async function getTotalNumberOfVoting() {
  const total = await prisma.totalNumberOfVoting.findFirst();

  return total.totalNumberOfVoting;
}
