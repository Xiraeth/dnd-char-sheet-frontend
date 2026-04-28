import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Backstory = () => {
  const { character } = useCharacter();
  const [isBackstoryVisible, setIsBackstoryVisible] = useState(false);

  if (!character?.characterBackstory) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-3xl font-bold text-center font-mrEaves ml-auto">
          Backstory
        </p>
        <ChevronDown
          className={clsx(
            "size-6 ml-auto cursor-pointer bg-white/20 rounded-full p-1",
            isBackstoryVisible ? "rotate-180" : ""
          )}
          onClick={() => setIsBackstoryVisible(!isBackstoryVisible)}
        />
      </div>

      {isBackstoryVisible && (
        <pre className="w-full text-base sm:text-lg whitespace-pre-wrap break-words font-bookInsanity">
          {character.characterBackstory}
        </pre>
      )}
    </div>
  );
};

export default Backstory;
