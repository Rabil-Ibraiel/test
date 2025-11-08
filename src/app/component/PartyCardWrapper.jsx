import { getPartiesCard, getTotalNumberOfVoting } from "../actions/getParties";
import PartyCard from "./Card";

const PartyCardWrapper = async () => {
  const partiesa = await getPartiesCard();
  const totalNumberOfVoting = (await getTotalNumberOfVoting()) ?? 1000000;

  return (
    <div className="mt-3 text-[rgb(26,40,107)] flex flex-col gap-3 overflow-hidden">
      {partiesa?.map((party) => (
        <PartyCard key={party.id} party={party} TNV={totalNumberOfVoting} />
      ))}
    </div>
  );
};

export default PartyCardWrapper;
