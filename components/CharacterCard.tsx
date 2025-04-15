import { Character } from "@/app/types";

const CharacterCard = ({
  character,
  onClick,
}: {
  character: Character;
  onClick: (characterId?: string) => void;
}) => {
  return (
    <div
      className="bg-white/40 border-2 border-indigo-500/50 rounded-md shadow-lg px-4 py-2 text-black cursor-pointer hover:bg-white/80 transition-all duration-150 flex flex-col gap-2"
      onClick={() => onClick(character?._id)}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 w-[200px] md:w-[400px]">
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
