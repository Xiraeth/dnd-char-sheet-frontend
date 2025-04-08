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

  const methods = useForm<Character>({
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = (data: Character) => {
    console.log(data);
  };

  const characterClass = watch("basicInfo.class");

  return (
    <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
      <BackButton url="/" />
      <p className="text-2xl font-bold text-center">Create a new character</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

          {/* appearance */}
          <AppearanceCard />

          {/* inventory */}
          <InventoryCard />

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

          <Button type="submit" className="w-full">
            Create Character
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
export default CreateCharacter;
