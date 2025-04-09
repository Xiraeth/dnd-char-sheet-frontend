"use client";

import BackButton from "@/components/BackButton";
import {
  Character,
  CharacterAbilities,
  CharacterSavingThrows,
  CharacterSkills,
} from "@/app/types";
import { useForm, FormProvider } from "react-hook-form";
import { ABILITIES, SKILLS } from "@/app/constants";
import { Button } from "@/components/ui/button";
import BasicInfoCard from "@/app/create-character/components/BasicInfoCard";
import AbilitiesCard from "@/app/create-character/components/AbilitiesCard";
import SavingThrowsCard from "@/app/create-character/components/SavingThrowsCard";
import SkillsCard from "@/app/create-character/components/SkillsCard";
import StatsCard from "@/app/create-character/components/StatsCard";
import AppearanceCard from "@/app/create-character/components/AppearanceCard";
import InventoryCard from "@/app/create-character/components/InventoryCard";
import SpellcastingCard from "@/app/create-character/components/SpellcastingCard";
import SpellSlotsCard from "@/app/create-character/components/SpellSlotsCard";
import { useState } from "react";
import SpellsCard from "@/app/create-character/components/SpellsCard";
import { Switch } from "@/components/ui/switch";
import PersonalityCard from "@/app/create-character/components/PersonalityCard";
import ProfsAndLangsCard from "@/app/create-character/components/ProfsAndLangsCard";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FeaturesAndTraitsCard from "@/app/create-character/components/FeaturesAndTraits";
import AttacksCard from "@/app/create-character/components/Attacks";
import FeatsCard from "@/app/create-character/components/FeatsCard";

const defaultValues: Partial<Character> = {
  savingThrows: ABILITIES.reduce((acc, ability) => {
    acc[ability.value as keyof CharacterSavingThrows] = {
      value: 0,
      hasProficiency: false,
    };
    return acc;
  }, {} as CharacterSavingThrows),
  skills: SKILLS.reduce((acc, skill) => {
    acc[skill.value as keyof CharacterSkills] = {
      value: 0,
      ability: skill.ability as keyof CharacterAbilities,
      hasProficiency: false,
      hasExpertise: false,
    };
    return acc;
  }, {} as CharacterSkills),
  inventory: {
    items: [],
  },
};

const CreateCharacter = () => {
  const [isSpellcaster, setIsSpellcaster] = useState(false);
  const router = useRouter();

  const methods = useForm<Character>({
    defaultValues,
  });

  const { handleSubmit, watch, setError, setValue, clearErrors } = methods;
  const race = watch("basicInfo.race");

  const onSubmit = async (data: Character) => {
    const perceptionModifier = getModifier(data.abilities.wisdom);
    const isProficientInPerception = data.skills.perception.hasProficiency;
    const hitpoints = data.stats.hitPointsTotal;
    const level = data.basicInfo.level;
    const profBonus = isProficientInPerception
      ? getProficiencyBonus(data.basicInfo.level)
      : 0;

    const passiveWisdom = isProficientInPerception
      ? perceptionModifier + 10 + profBonus
      : perceptionModifier + 10;

    setValue("passiveWisdom", passiveWisdom);
    setValue("stats.hitPointsCurrent", hitpoints);
    setValue("stats.hitDice.remaining", level);
    setValue("stats.hitDice.total", level);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create-character`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        router.push("/");
        toast.success("Character created successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "An error occurred"
        );
      }

      toast.error("Server is probably down.");
    }
  };

  const characterClass = watch("basicInfo.class");

  return (
    <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
      <BackButton url="/" />
      <p className="text-2xl font-bold text-center">Create a new character</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
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
          {isSpellcaster && <SpellsCard />}

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
            onClick={() => {
              if (!race?.length) {
                setError("basicInfo.race", {
                  message: "Race is required",
                });
              } else {
                clearErrors("basicInfo.race");
              }
            }}
          >
            Create Character
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
export default CreateCharacter;
