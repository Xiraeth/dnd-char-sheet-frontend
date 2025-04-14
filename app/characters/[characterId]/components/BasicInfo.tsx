import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { VerticalDivider } from "@/app/characters/[characterId]/components/VerticalDivider";

const BasicInfo = () => {
  const { character } = useCharacter();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-1 w-full justify-center sm:justify-between">
      <p className="text-4xl sm:text-6xl text-dndRed font-scalySans">
        {character?.basicInfo?.name}
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 font-bookInsanity">
        <p className="text-base sm:text-lg">
          Level {character?.basicInfo?.level} {character?.basicInfo?.race}{" "}
          {character?.basicInfo?.class}{" "}
        </p>
        <VerticalDivider />
        <p className="text-base sm:text-lg">
          {character?.basicInfo?.alignment}, {character?.basicInfo?.background}
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;
