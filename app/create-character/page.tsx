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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const methods = useForm<Character>({
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;

  const onSubmit = async (data: Character) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
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

      setIsSubmitting(false);

      if (response.status === 200) {
        router.push("/");
        toast.success("Character created successfully");
      }
    } catch (error) {
      setIsSubmitting(false);
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
    if (isSubmitting) return;

    setIsSubmitting(true);
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
    setValue("passiveWisdom", 13);

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

    // Skills - Setting all skills based on ability modifiers
    // Strength skills
    setValue("skills.athletics.value", getModifier(10)); // Strength modifier
    setValue("skills.athletics.hasProficiency", false);
    setValue("skills.athletics.hasExpertise", false);

    // Dexterity skills
    setValue("skills.acrobatics.value", getModifier(14)); // Dexterity modifier
    setValue("skills.acrobatics.hasProficiency", false);
    setValue("skills.acrobatics.hasExpertise", false);

    setValue("skills.sleightOfHand.value", getModifier(14)); // Dexterity modifier
    setValue("skills.sleightOfHand.hasProficiency", false);
    setValue("skills.sleightOfHand.hasExpertise", false);

    setValue("skills.stealth.value", getModifier(14)); // Dexterity modifier
    setValue("skills.stealth.hasProficiency", false);
    setValue("skills.stealth.hasExpertise", false);

    // Intelligence skills
    setValue("skills.arcana.value", getModifier(18) + getProficiencyBonus(5)); // Intelligence modifier + proficiency
    setValue("skills.arcana.hasProficiency", true);
    setValue("skills.arcana.hasExpertise", false);

    setValue("skills.history.value", getModifier(18) + getProficiencyBonus(5)); // Intelligence modifier + proficiency
    setValue("skills.history.hasProficiency", true);
    setValue("skills.history.hasExpertise", false);

    setValue("skills.investigation.value", getModifier(18)); // Intelligence modifier
    setValue("skills.investigation.hasProficiency", false);
    setValue("skills.investigation.hasExpertise", false);

    setValue("skills.nature.value", getModifier(18)); // Intelligence modifier
    setValue("skills.nature.hasProficiency", false);
    setValue("skills.nature.hasExpertise", false);

    setValue("skills.religion.value", getModifier(18)); // Intelligence modifier
    setValue("skills.religion.hasProficiency", false);
    setValue("skills.religion.hasExpertise", false);

    // Wisdom skills
    setValue("skills.animalHandling.value", getModifier(16)); // Wisdom modifier
    setValue("skills.animalHandling.hasProficiency", false);
    setValue("skills.animalHandling.hasExpertise", false);

    setValue("skills.insight.value", getModifier(16)); // Wisdom modifier
    setValue("skills.insight.hasProficiency", false);
    setValue("skills.insight.hasExpertise", false);

    setValue("skills.medicine.value", getModifier(16)); // Wisdom modifier
    setValue("skills.medicine.hasProficiency", false);
    setValue("skills.medicine.hasExpertise", false);

    setValue("skills.perception.value", getModifier(16)); // Wisdom modifier
    setValue("skills.perception.hasProficiency", false);
    setValue("skills.perception.hasExpertise", false);

    setValue("skills.survival.value", getModifier(16)); // Wisdom modifier
    setValue("skills.survival.hasProficiency", false);
    setValue("skills.survival.hasExpertise", false);

    // Charisma skills
    setValue("skills.deception.value", getModifier(12)); // Charisma modifier
    setValue("skills.deception.hasProficiency", false);
    setValue("skills.deception.hasExpertise", false);

    setValue("skills.intimidation.value", getModifier(12)); // Charisma modifier
    setValue("skills.intimidation.hasProficiency", false);
    setValue("skills.intimidation.hasExpertise", false);

    setValue("skills.performance.value", getModifier(12)); // Charisma modifier
    setValue("skills.performance.hasProficiency", false);
    setValue("skills.performance.hasExpertise", false);

    setValue("skills.persuasion.value", getModifier(12)); // Charisma modifier
    setValue("skills.persuasion.hasProficiency", false);
    setValue("skills.persuasion.hasExpertise", false);

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
    setValue(
      "appearance.photo",
      "https://www.enworld.org/attachments/th-18483468401-765x1078-png.133719/"
    );

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
        rechargeOn: "daily",
        usesTotal: 1,
        usesLeft: 1,
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
        attackRoll: { modifier: 7 },
        damageRoll: {
          numberOfDice: 1,
          diceType: 10,
          abilityUsed: "intelligence",
        },
        damageType: "Fire",
        range: "120 ft.",
        description:
          "A cantrip that hurls a mote of fire at a creature or object within range.",
        isProficient: true,
      },
      {
        name: "Fireball",
        damageRoll: {
          numberOfDice: 8,
          diceType: 6,
        },
        damageType: "Fire",
        range: "150 ft.",
        description:
          "A spell that creates a fiery explosion at a point within range. Each creature within 10 feet of that point must make a Dexterity saving throw. A creature takes 3d10 fire damage on a failed save, or half as much damage on a successful one.",
        isProficient: true,
        areaOfEffect: "10 ft. radius",
        abilitySave: "Dexterity",
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
    setIsSubmitting(false);
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
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </div>
  );
};
export default CreateCharacter;
