import { Character } from "@/app/types";
import Image from "next/image";

const CharacterCard = ({
  character,
  onClick,
}: {
  character: Character;
  onClick: (characterId?: string) => void;
}) => {
  return (
    <div
      className="bg-white/40 border-2 border-indigo-500/50 rounded-md shadow-lg px-4 py-2 text-black cursor-pointer hover:bg-white/80 transition-all duration-150 flex gap-2"
      onClick={() => onClick(character?._id)}
    >
      {character?.appearance?.photo && (
        <div className="w-[75px] md:w-[100px] h-[75px] md:h-[100px] rounded-full overflow-hidden">
          <Image
            src={character?.appearance?.photo}
            width={100}
            height={100}
            alt="Character photo"
          />
        </div>
      )}
      <div
        className={`flex flex-col md:flex-row justify-center md:justify-between items-start md:items-center gap-2 md:gap-4 ${
          character?.appearance?.photo
            ? "w-[200px] md:w-[400px]"
            : "w-[283px] md:w-[508px]"
        }`}
      >
        <p className="text-lato text-xl md:text-2xl italic font-bold">
          {character.basicInfo?.name}
        </p>
        <div className="flex items-center gap-2 text-sm md:text-base">
          <p>Level {character.basicInfo?.level} </p>
          <p>{character.basicInfo?.race} </p>
          <p>{character.basicInfo?.class}</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
