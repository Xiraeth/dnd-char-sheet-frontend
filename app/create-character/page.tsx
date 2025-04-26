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
import { useState } from "react";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/app/UserProvider";
import CharacterForm from "@/app/create-character/components/CharacterForm";

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
  const { user } = useUser();

  const methods = useForm<Character>({
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

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
        {
          ...data,
          userId: user?.id,
        },
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

  const populateFormWithTestData = () => {
    // Basic Info
    setValue("basicInfo.name", "Eldric the Wise");
    setValue("basicInfo.race", "Human");
    setValue("basicInfo.class", "Wizard");
    setValue("basicInfo.level", 5);
    setValue("basicInfo.alignment", "Lawful Good");
    setValue("basicInfo.background", "Sage");
    setValue("basicInfo.playerName", "Player Name");

    // Abilities
    setValue("abilities.strength", 10);
    setValue("abilities.dexterity", 14);
    setValue("abilities.constitution", 12);
    setValue("abilities.intelligence", 18);
    setValue("abilities.wisdom", 16);
    setValue("abilities.charisma", 12);

    // Passive Wisdom
    setValue("passiveWisdom", 16);

    // Stats
    setValue("stats.initiative", 2);
    setValue("stats.speed", 30);
    setValue("stats.armorClass", 15);
    setValue("stats.hitPointsCurrent", 32);
    setValue("stats.hitPointsTotal", 32);
    setValue("stats.hitDice.remaining", 5);
    setValue("stats.hitDice.diceType", 6);
    setValue("stats.hitDice.total", 5);

    // Saving Throws
    setValue("savingThrows.strength.value", 0);
    setValue("savingThrows.strength.hasProficiency", false);
    setValue("savingThrows.dexterity.value", 2);
    setValue("savingThrows.dexterity.hasProficiency", false);
    setValue("savingThrows.constitution.value", 1);
    setValue("savingThrows.constitution.hasProficiency", false);
    setValue("savingThrows.intelligence.value", 4);
    setValue("savingThrows.intelligence.hasProficiency", true);
    setValue("savingThrows.wisdom.value", 3);
    setValue("savingThrows.wisdom.hasProficiency", true);
    setValue("savingThrows.charisma.value", 1);
    setValue("savingThrows.charisma.hasProficiency", false);

    // Skills - Setting a few key skills as examples
    setValue("skills.arcana.value", 4);
    setValue("skills.arcana.hasProficiency", true);
    setValue("skills.arcana.hasExpertise", false);
    setValue("skills.history.value", 4);
    setValue("skills.history.hasProficiency", true);
    setValue("skills.history.hasExpertise", false);
    setValue("skills.investigation.value", 4);
    setValue("skills.investigation.hasProficiency", true);
    setValue("skills.investigation.hasExpertise", false);
    setValue("skills.perception.value", 3);
    setValue("skills.perception.hasProficiency", false);
    setValue("skills.perception.hasExpertise", false);

    // Spellcasting
    setValue("spellcasting.spellcastingClass", "Wizard");
    setValue("spellcasting.spellcastingAbility", "intelligence");
    setValue("spellcasting.spellSaveDC", 15);
    setValue("spellcasting.spellAttackBonus", 7);

    // Spell Slots
    setValue("spellSlots.level1", 4);
    setValue("spellSlots.level2", 3);
    setValue("spellSlots.level3", 2);

    // Appearance
    setValue("appearance.age", "45");
    setValue("appearance.height", "5'10");
    setValue("appearance.weight", "180");
    setValue("appearance.eyes", "Blue");
    setValue("appearance.hair", "Gray");
    setValue("appearance.skin", "Fair");
    setValue("appearance.photo", "https://example.com/eldric.jpg");

    // Inventory
    setValue("inventory.gold", 150);
    setValue("inventory.items", [
      { name: "Spellbook", description: "Contains all known spells" },
      {
        name: "Staff of Power",
        description: "Magical staff that enhances spellcasting",
      },
      { name: "Potion of Healing", description: "Restores 2d4+2 hit points" },
    ]);
    setValue("inventory.weight", 35);

    // Personality
    setValue(
      "personalityTraits",
      "I am always calm, no matter what the situation. I see omens in every event and action."
    );
    setValue(
      "ideals",
      "Knowledge. The path to power and self-improvement is through knowledge."
    );
    setValue(
      "bonds",
      "I seek to preserve a library, university, scriptorium, or monastery."
    );
    setValue("flaws", "I am easily distracted by the promise of information.");

    // Other
    setValue("otherProficiencies", "Arcana, History, Investigation");
    setValue("languages", "Common, Elvish, Draconic, Infernal");
    setValue("inspiration", 1);
    setValue(
      "characterBackstory",
      "Eldric was born in a small village and showed an early aptitude for magic. He was taken as an apprentice by a local wizard and eventually enrolled in a prestigious magical academy. After graduating, he traveled the world in search of ancient knowledge and magical artifacts."
    );
    setValue(
      "notes",
      "Has a familiar named Whiskers, a black cat with glowing green eyes."
    );

    // Features and Traits
    setValue("featuresAndTraits", [
      {
        name: "Arcane Recovery",
        description: "Regain spell slots during a short rest",
        source: "Wizard",
      },
      {
        name: "Arcane Tradition",
        description: "School of Evocation",
        source: "Wizard",
      },
    ]);

    // Attacks
    setValue("attacks", [
      {
        name: "Fire Bolt",
        attackRoll: "+7",
        damageRoll: "1d10",
        damageType: "Fire",
        range: "120 ft.",
        description:
          "A cantrip that hurls a mote of fire at a creature or object within range.",
      },
    ]);

    // Feats
    setValue("feats", [
      {
        name: "War Caster",
        description:
          "Advantage on Constitution saving throws for concentration, can perform somatic components with hands full, can cast a spell as an opportunity attack.",
        level: "4",
      },
    ]);

    // Spells
    setValue("spells", [
      {
        name: "Fireball",
        level: "3",
        school: { name: "Evocation" },
        casting_time: "1 action",
        range: "150 feet",
        components: ["V", "S", "M"],
        duration: "Instantaneous",
        desc: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.",
        higher_level: [
          "When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.",
        ],
      },
    ]);

    // Set spellcaster flag to true since this is a wizard
    setIsSpellcaster(true);
    onSubmit(watch());
  };

  return (
    <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
      <BackButton url="/" />
      <p className="text-2xl font-bold text-center">Create a new character</p>
      <Button
        variant="default"
        className="text-center w-full flex justify-center"
        onClick={populateFormWithTestData}
      >
        Populate form with test data
      </Button>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
          <CharacterForm
            isSpellcaster={isSpellcaster}
            setIsSpellcaster={setIsSpellcaster}
          />
        </form>
      </FormProvider>
    </div>
  );
};
export default CreateCharacter;
