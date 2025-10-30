import prisma from "@/lib/prisma";

const normalizeBigInts = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeBigInts);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        normalizeBigInts(val),
      ])
    );
  }

  return typeof value === "bigint" ? Number(value) : value;
};

export async function GET() {
  const parties = await prisma.party.findMany({
    include: {
      locations: true,
    },
    orderBy: {
      numberOfVoting: "desc",
    },
  });

  return Response.json(normalizeBigInts(parties));
}

export async function POST(request) {
  const payload = await request.json();

  const newParty = await prisma.party.create({
    data: {
      englishName: payload.englishName,
      arabicName: payload.arabicName,
      abbr: payload.abbr,
      numberOfVoting: Number(payload.numberOfVoting ?? 0),
      thisElecChairs: payload.thisElecChairs ?? 0,
      lastElecChairs: payload.lastElecChairs ?? 0,
      color: payload.color,
      locations: payload.locations
        ? {
            create: payload.locations.map((loc) => ({
              regionCode: loc.regionCode,
              numberOfVoting: Number(loc.numberOfVoting ?? 0),
            })),
          }
        : undefined,
    },
    include: {
      locations: true,
    },
  });

  return new Response(JSON.stringify(normalizeBigInts(newParty)), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
}
