import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import Abilities from "@/app/characters/[characterId]/components/GeneralView/Abilities";
import BasicInfo from "@/app/characters/[characterId]/components/GeneralView/BasicInfo";
import Equipment from "@/app/characters/[characterId]/components/GeneralView/Equipment";
import FeaturesAndTraits from "@/app/characters/[characterId]/components/GeneralView/FeaturesAndTraits";
import OtherProficienciesAndLanguages from "@/app/characters/[characterId]/components/GeneralView/OtherProficienciesAndLanguages";
import Personality from "@/app/characters/[characterId]/components/GeneralView/Personality";
import SavingThrows from "@/app/characters/[characterId]/components/GeneralView/SavingThrows";
import Skills from "@/app/characters/[characterId]/components/GeneralView/Skills";
import Stats from "@/app/characters/[characterId]/components/GeneralView/Stats";
import DndDivider from "@/components/RedDivider";

const GeneralPage = () => {
  const { character } = useCharacter();

  return (
    <>
      <BasicInfo />

      <DndDivider />

      <Stats />

      <DndDivider />

      <Abilities />

      <DndDivider />

      <SavingThrows />

      <DndDivider />

      <Skills />

      <DndDivider />

      <FeaturesAndTraits />

      <DndDivider />

      <Equipment />

      <DndDivider />

      {character?.otherProficiencies && (
        <>
          <OtherProficienciesAndLanguages />
          <DndDivider />
        </>
      )}

      <Personality />
    </>
  );
};

export default GeneralPage;
