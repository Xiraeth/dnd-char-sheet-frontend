import { capitalize } from "@/lib/utils";

import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { getModifier } from "@/lib/utils";

const Abilities = () => {
  const { character } = useCharacter();
  const charAbilities = Object.entries(character?.abilities || {});

  return (
    <div className="grid grid-cols-6 sm:grid-cols-6 gap-x-10 gap-y-4 text-base sm:text-lg text-dndRed my-4">
      {character &&
        charAbilities?.map(([ability, value]) => {
          const modifier = getModifier(value);
          const modifierSign = modifier > 0 ? "+" : "";

          return (
            <div
              key={ability}
              className="flex flex-col justify-center items-center"
            >
              <p className="font-bold">{capitalize(ability?.slice(0, 3))}</p>
              <p className="text-center flex text-nowrap">
                {value} ({modifierSign}
                {modifier})
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Abilities;
