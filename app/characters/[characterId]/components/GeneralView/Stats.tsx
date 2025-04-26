import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";

export const Stats = ({ isCombatPage = false }: { isCombatPage?: boolean }) => {
  const { character } = useCharacter();

  return (
    <div
      className={clsx(
        "grid grid-cols-3 justify-items-center items-center gap-4 my-4",
        isCombatPage ? "sm:grid-cols-3" : "sm:grid-cols-5"
      )}
    >
      <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center">
        {character?.stats?.armorClass}
        <span className="font-bold">Armor Class</span>{" "}
      </p>

      {!isCombatPage && (
        <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center">
          <span>
            {character?.stats?.hitPointsCurrent}/
            {character?.stats?.hitPointsTotal} (+
            {character?.stats?.hitPointsTemp || 0})
          </span>
          <span className="font-bold">Hit Points</span>{" "}
        </p>
      )}

      <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center">
        {character?.stats?.initiative}
        <span className="font-bold">Initiative</span>
      </p>

      <p className="text-base sm:text-lg text-dndRed flex flex-col justify-center items-center">
        {character?.stats?.speed} ft
        <span className="font-bold">Speed</span>
      </p>

      {!isCombatPage && (
        <p
          className={clsx(
            "text-base sm:text-lg text-dndRed flex flex-col justify-between items-center"
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
