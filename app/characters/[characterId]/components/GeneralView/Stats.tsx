import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";

export const Stats = ({ isCombatPage = false }: { isCombatPage?: boolean }) => {
  const { character } = useCharacter();

  return (
    <div
      className={clsx(
        "grid grid-cols-2 justify-items-center items-center gap-4 my-4",
        isCombatPage ? "sm:grid-cols-4" : "sm:grid-cols-5"
      )}
    >
      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Armor Class:</span>{" "}
        {character?.stats?.armorClass}
      </p>

      {!isCombatPage && (
        <p className="text-base sm:text-lg text-dndRed">
          <span className="font-bold">Hit Points:</span>{" "}
          {character?.stats?.hitPointsCurrent}/
          {character?.stats?.hitPointsTotal}
          <span className="text-sm opacity-80">
            {" "}
            (+{character?.stats?.hitPointsTemp || 0})
          </span>
        </p>
      )}

      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Speed:</span> {character?.stats?.speed}
        ft
      </p>

      <p className="text-base sm:text-lg text-dndRed">
        <span className="font-bold">Initiative:</span>{" "}
        {character?.stats?.initiative}
      </p>

      <p
        className={clsx(
          "text-base sm:text-lg text-dndRed sm:col-span-1",
          !isCombatPage && "col-span-2"
        )}
      >
        <span className="font-bold">Hit Dice:</span>{" "}
        {character?.stats?.hitDice?.remaining}d
        {character?.stats?.hitDice?.diceType}/{character?.stats?.hitDice?.total}
        d{character?.stats?.hitDice?.diceType}
      </p>
    </div>
  );
};
