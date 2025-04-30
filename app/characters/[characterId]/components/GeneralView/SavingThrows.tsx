import { getProficiencyBonus } from "@/lib/utils";

import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { capitalize } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import clsx from "clsx";

const SavingThrows = () => {
  const { character } = useCharacter();
  const charSavingThrows = Object.entries(character?.savingThrows || {});
  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  return (
    <>
      <div className="grid grid-cols-6 gap-x-10 gap-y-4 text-base sm:text-lg text-dndRed my-2">
        {character &&
          charSavingThrows?.map(([ability, savingThrow]) => {
            const value = savingThrow?.value;
            const hasProficiency = savingThrow?.hasProficiency;
            const otherModifier = savingThrow?.otherModifier;

            const finalValue = hasProficiency
              ? value + proficiencyBonus + otherModifier
              : value + otherModifier;

            const modifierSign = finalValue > 0 ? "+" : "";

            const color = otherModifier
              ? "text-indigo-600 font-bold"
              : "text-dndRed";

            return (
              <div
                key={ability}
                className="flex flex-col justify-center items-center"
              >
                <div className="relative">
                  <p className="font-bold">
                    {capitalize(ability?.slice(0, 3))}
                  </p>
                  <div className={clsx(color, "flex items-center gap-1")}>
                    ({modifierSign}
                    {finalValue})
                    {hasProficiency && (
                      <Asterisk className="absolute -top-1 -right-3 text-indigo-600 size-4" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <p className="text-lg sm:text-xl font-bold text-center font-mrEaves">
        Saving throws
      </p>
    </>
  );
};

export default SavingThrows;
