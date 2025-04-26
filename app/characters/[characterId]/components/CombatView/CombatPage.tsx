import Hitpoints from "@/app/characters/[characterId]/components/CombatView/Hitpoints";
import Abilities from "@/app/characters/[characterId]/components/GeneralView/Abilities";
import SavingThrows from "@/app/characters/[characterId]/components/GeneralView/SavingThrows";
import { Stats } from "@/app/characters/[characterId]/components/GeneralView/Stats";
import RedDivider from "@/components/RedDivider";

const CombatPage = () => {
  return (
    <div className="mt-2">
      <Stats isCombatPage />
      <RedDivider />
      <Abilities />
      <RedDivider />
      <SavingThrows />
      <RedDivider />
      <Hitpoints />
      <RedDivider />
    </div>
  );
};

export default CombatPage;
