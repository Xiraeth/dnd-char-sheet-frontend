import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";

const OtherProficienciesAndLanguages = () => {
  const { character } = useCharacter();

  return (
    <div>
      <div className="flex flex-col gap-2 font-bookInsanity text-base sm:text-lg">
        {character?.otherProficiencies && (
          <div className="flex flex-col">
            <p className="font-bold text-dndRed">Other proficiencies</p>
            <p>{character?.otherProficiencies}</p>
          </div>
        )}
        {character?.languages && (
          <div className="flex flex-col">
            <p className="font-bold text-dndRed">Languages</p>
            <p>{character?.languages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherProficienciesAndLanguages;
