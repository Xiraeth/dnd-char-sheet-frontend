import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";

export const Stats = () => {
  const { character } = useCharacter();
  return (
    <div className="grid grid-cols-2 justify-items-center items-center sm:grid-cols-5 gap-4 my-4">
      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Armor Class:</span>{" "}
        {character?.stats?.armorClass}
      </p>

      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Hit Points:</span>{" "}
        {character?.stats?.hitPointsCurrent}/{character?.stats?.hitPointsTotal}
      </p>

      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Speed:</span> {character?.stats?.speed}
        ft
      </p>

      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Initiative:</span>{" "}
        {character?.stats?.initiative}
      </p>

      <p className="text-base sm:text-lg text-dndRed col-span-2 sm:col-span-1">
        <span className="font-bold">Hit Dice:</span>{" "}
        {character?.stats?.hitDice?.remaining}d
        {character?.stats?.hitDice?.diceType}/{character?.stats?.hitDice?.total}
        d{character?.stats?.hitDice?.diceType}
      </p>
    </div>
  );
};
