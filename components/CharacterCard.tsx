import { Character } from "@/app/types";

const CharacterCard = ({ character }: { character: Character }) => {
  return (
    <div className="bg-white/40 border-2 border-indigo-500/50 rounded-md shadow-lg px-4 py-2 text-black cursor-pointer hover:bg-white/80 transition-all duration-150 flex flex-col gap-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 w-[200px] md:w-[350px]">
        <p className="text-lato text-xl md:text-3xl italic font-bold">
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
