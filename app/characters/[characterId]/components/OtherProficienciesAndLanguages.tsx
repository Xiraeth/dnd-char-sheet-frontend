import { useCharacter } from "./CharacterProvider";

const OtherProficienciesAndLanguages = () => {
  const { character } = useCharacter();

  return (
    <div>
      <div className="flex flex-col gap-2 text-dndRed font-bookInsanity text-base sm:text-lg">
        {character?.otherProficiencies && (
          <div className="flex gap-2">
            <p className="font-bold">Other proficiencies: </p>
            <p>{character?.otherProficiencies}</p>
          </div>
        )}
        {character?.languages && (
          <div className="flex gap-2">
            <p className="font-bold">Languages: </p>
            <p>{character?.languages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherProficienciesAndLanguages;
