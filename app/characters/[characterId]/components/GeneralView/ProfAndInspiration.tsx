import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { getProficiencyBonus } from "@/lib/utils";

const ProfAndInspiration = () => {
  const { character } = useCharacter();

  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  return (
    <div className="flex items-center justify-around w-full">
      <div className="flex items-center justify-center gap-2 py-2">
        <p className="font-bold text-dndRed">Proficiency bonus</p>
        <p>{proficiencyBonus}</p>
      </div>

      <div className="flex items-center justify-center gap-2 py-2">
        <p className="font-bold text-dndRed">Inspiration</p>
        <p>{character?.inspiration?.toString() || 0}</p>
      </div>
    </div>
  );
};

export default ProfAndInspiration;
