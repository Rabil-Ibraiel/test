import PartyCard from "./Card";

import prisma from "@/lib/prisma";

const PartyCardWrapper = async () => {
  const partiesa = await prisma.party?.findMany({
    include: { locations: true },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mt-3 text-[rgb(26,40,107)] flex flex-col gap-3 overflow-hidden">
      {partiesa?.map((party) => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  );
};

export default PartyCardWrapper;
