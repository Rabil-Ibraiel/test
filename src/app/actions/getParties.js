// src/app/actions/getParties.js
"use server";

import prisma from "@/lib/prisma";

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
  return prisma.party.findMany({
    orderBy: {
      numberOfVoting: "desc",
    },
    take: 6,
    select: {
      id: true,
      arabicName: true,
      abbr: true,
      numberOfVoting: true,
      color: true,
      thisElecChairs: true,
    },
  });
}

export async function getParties() {
  return prisma.party.findMany({
    include: {
      locations: true,
    },
  });
}
