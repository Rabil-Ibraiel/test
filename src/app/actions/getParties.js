// src/app/actions/getParties.js
"use server";

import prisma from "@/lib/prisma";

export async function getPartiesByRegion(regionCode) {
  const parties = await prisma.party.findMany({
    where: {
      locations: {
        some: { regionCode },
      },
    },
    include: {
      locations: {
        where: { regionCode },
      },
    },
  });

  return parties
    .sort(
      (a, b) =>
        Number(b.locations[0]?.numberOfVoting ?? 0) -
        Number(a.locations[0]?.numberOfVoting ?? 0)
    )
    .slice(0, 6);
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
      lastElecChairs: true,
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
