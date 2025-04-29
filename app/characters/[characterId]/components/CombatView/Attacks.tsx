import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Attack } from "@/app/types";
import { getProficiencyBonus } from "@/lib/utils";
import Image from "next/image";
const Attacks = () => {
  const { character } = useCharacter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  return (
    <div>
      <p className="text-dndRed font-bold font-mrEaves text-center text-3xl sm:text-4xl">
        Attacks
      </p>

      {
        <div className="w-[35px] h-[35px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all duration-150 active:bg-white/60">
          <Image width={30} height={30} src="/d20.png" alt="d20" />
        </div>
      }

      {character?.attacks?.map((attack: Attack) => {
        return <div key={attack?._id}>{attack?.name}</div>;
      })}
    </div>
  );
};

export default Attacks;
