import { getProficiencyBonus } from "@/lib/utils";

import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { capitalize } from "@/lib/utils";
import { Asterisk } from "lucide-react";

const SavingThrows = () => {
  const { character } = useCharacter();
  const charSavingThrows = Object.entries(character?.savingThrows || {});
  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  return (
    <div className="grid grid-cols-6 gap-x-10 gap-y-4 text-base sm:text-lg text-dndRed my-4">
      {character &&
        charSavingThrows?.map(([ability, savingThrow]) => {
          const value = savingThrow?.value;
          const hasProficiency = savingThrow?.hasProficiency;
          const finalValue = hasProficiency ? value + proficiencyBonus : value;

          const modifierSign = finalValue > 0 ? "+" : "";

          return (
            <div
              key={ability}
              className="flex flex-col justify-center items-center"
            >
              <div className="relative">
                <p className="font-bold">{capitalize(ability?.slice(0, 3))}</p>
                <div className="flex items-center gap-1">
                  ({modifierSign}
                  {finalValue})
                  {hasProficiency && (
                    <Asterisk className="absolute -top-1 -right-3 text-indigo-500 size-4" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

      <p className="font-bold col-span-6 text-center -mb-2 text-black">
        Saving throws
      </p>
    </div>
  );
};

export default SavingThrows;
