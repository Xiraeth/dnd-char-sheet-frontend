import AbilitiesCard from "@/app/create-character/components/AbilitiesCard";
import BasicInfoCard from "@/app/create-character/components/BasicInfoCard";
import SavingThrowsCard from "@/app/create-character/components/SavingThrowsCard";
import SkillsCard from "@/app/create-character/components/SkillsCard";
import StatsCard from "@/app/create-character/components/StatsCard";
import AttacksCard from "@/app/create-character/components/Attacks";
import FeaturesAndTraitsCard from "@/app/create-character/components/FeaturesAndTraits";
import FeatsCard from "@/app/create-character/components/FeatsCard";
import SpellcastingCard from "@/app/create-character/components/SpellcastingCard";
import SpellSlotsCard from "@/app/create-character/components/SpellSlotsCard";
import SpellsCard from "@/app/create-character/components/SpellsCard";
import ProfsAndLangsCard from "@/app/create-character/components/ProfsAndLangsCard";
import InventoryCard from "@/app/create-character/components/InventoryCard";
import AppearanceCard from "@/app/create-character/components/AppearanceCard";
import PersonalityCard from "@/app/create-character/components/PersonalityCard";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";

const CharacterForm = ({
  isSpellcaster,
  setIsSpellcaster,
  isSubmitting,
  formReady = true,
}: {
  isSpellcaster: boolean;
  setIsSpellcaster: (isSpellcaster: boolean) => void;
  isSubmitting?: boolean;
  formReady?: boolean;
}) => {
  const characterId = useParams() as { characterId: string };
  const { watch, setError, clearErrors } = useFormContext();
  const characterClass = watch("basicInfo.class");
  const race = watch("basicInfo.race");

  const validateRace = () => {
    if (!race?.length) {
      setError("basicInfo.race", {
        message: "Race is required",
      });
    } else {
      clearErrors("basicInfo.race");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* basic info */}
      <BasicInfoCard setIsSpellcaster={setIsSpellcaster} />
      {/* abilities */}
      <AbilitiesCard />
      {/* saving throws */}
      <SavingThrowsCard />
      {/* skills */}
      <SkillsCard />
      {/* stats */}
      <StatsCard />
      {/* attacks */}
      <AttacksCard />
      {/* features and traits */}
      <FeaturesAndTraitsCard />
      {/* feats */}
      <FeatsCard />
      {/* set spellcaster for custom class */}
      {characterClass?.toLowerCase() === "custom" && (
        <div className="flex items-center gap-4 w-full justify-center border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-md shadow-black/5">
          <p>This character is a spellcaster</p>
          <Switch onCheckedChange={setIsSpellcaster} />
        </div>
      )}
      {/* spellcasting */}
      {isSpellcaster && <SpellcastingCard />}
      {/* spell slots */}
      {isSpellcaster && <SpellSlotsCard />}
      {/* spells */}
      {isSpellcaster && formReady && <SpellsCard />}
      {/* proficiencies and languages */}
      <ProfsAndLangsCard />
      {/* inventory */}
      <InventoryCard />
      {/* appearance */}
      <AppearanceCard />
      {/* personality traits */}
      <PersonalityCard />
      <Button
        type="submit"
        className="w-full"
        onClick={validateRace}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : characterId
          ? "Save changes"
          : "Create Character"}
      </Button>
    </div>
  );
};

export default CharacterForm;
