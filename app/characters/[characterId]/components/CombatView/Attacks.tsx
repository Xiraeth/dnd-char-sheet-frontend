import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";

const Attacks = () => {
  const { character } = useCharacter();

  console.log(character?.attacks);
  return <div>Attacks</div>;
};

export default Attacks;
