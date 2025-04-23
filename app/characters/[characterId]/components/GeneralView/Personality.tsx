import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";

const Personality = () => {
  const { character } = useCharacter();

  return (
    <div>
      {/* <div className="flex items-center justify-between">
        <p className="text-2xl sm:text-3xl font-bold text-center font-mrEaves ml-auto">
          Personality
        </p>
        <div className="size-6 ml-auto" />
      </div> */}
      <div className="text-base sm:text-lg font-bookInsanity flex flex-col gap-2">
        <div className="flex flex-col">
          <p className="font-bold text-dndRed">Personality Traits</p>
          <p className="text-dnd">{character?.personalityTraits}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-dndRed">Ideals</p>
          <p>{character?.ideals}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-dndRed">Bonds</p>
          <p>{character?.bonds}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-dndRed">Flaws</p>
          <p>{character?.flaws}</p>
        </div>
      </div>
    </div>
  );
};

export default Personality;
