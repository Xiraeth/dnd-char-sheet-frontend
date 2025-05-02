import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Attack } from "@/app/types";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const Attacks = () => {
  const { character } = useCharacter();

  return (
    <div className="space-y-4">
      <p className="text-dndRed font-bold font-mrEaves text-center text-3xl sm:text-4xl">
        Attacks
      </p>

      {character?.attacks?.map((attack: Attack) => {
        return (
          <Card
            key={attack?._id}
            className="flex gap-2 items-center w-full justify-between px-2 py-4"
          >
            <p>{attack.name}</p>
            <div className="w-[35px] h-[35px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all duration-150 active:bg-white/60">
              <Image width={30} height={30} src="/d20.png" alt="d20" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Attacks;
