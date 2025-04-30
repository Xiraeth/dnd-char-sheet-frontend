import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";

const Stats = ({ isCombatPage = false }: { isCombatPage?: boolean }) => {
  const { character } = useCharacter();

  return (
    <div
      className={clsx(
        "grid grid-cols-6 justify-items-center items-center gap-4 my-4",
        isCombatPage ? "sm:grid-cols-3" : "sm:grid-cols-5"
      )}
    >
      <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center col-span-2 sm:col-span-1">
        {character?.stats?.armorClass}
        <span className="font-bold">Armor Class</span>{" "}
      </p>

      {!isCombatPage && (
        <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center col-span-2 sm:col-span-1">
          <span>
            {character?.stats?.hitPointsCurrent}/
            {character?.stats?.hitPointsTotal} (+
            {character?.stats?.hitPointsTemp || 0})
          </span>
          <span className="font-bold">Hit Points</span>{" "}
        </p>
      )}

      <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center col-span-2 sm:col-span-1">
        {character?.stats?.initiative}
        <span className="font-bold">Initiative</span>
      </p>

      <p
        className={clsx(
          "text-base sm:text-lg text-dndRed flex flex-col justify-center items-center sm:col-span-1",
          isCombatPage ? "col-span-2" : "col-span-3"
        )}
      >
        {character?.stats?.speed} ft
        <span className="font-bold">Speed</span>
      </p>

      {!isCombatPage && (
        <p
          className={clsx(
            "text-base sm:text-lg text-dndRed flex flex-col justify-between items-center col-span-3 sm:col-span-1"
          )}
        >
          <span>
            {character?.stats?.hitDice?.remaining}d
            {character?.stats?.hitDice?.diceType}/
            {character?.stats?.hitDice?.total}d
            {character?.stats?.hitDice?.diceType}
          </span>
          <span className="font-bold">Hit Dice</span>{" "}
        </p>
      )}
    </div>
  );
};

export default Stats;
