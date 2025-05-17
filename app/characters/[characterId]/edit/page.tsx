"use client";

import BackButton from "@/components/BackButton";
import { Character, Feat } from "@/app/types";
import { useForm, FormProvider } from "react-hook-form";

import { useState, useEffect } from "react";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CharacterForm from "@/app/create-character/components/CharacterForm";
import CharacterProvider, {
  useCharacter,
} from "@/app/characters/[characterId]/components/CharacterProvider";
import { Loader } from "lucide-react";
import { SPELLCASTING_CLASSES } from "@/app/constants";

const EditCharacter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { character, isLoading, setCharacter } = useCharacter();
  const [formReady, setFormReady] = useState(false);
  const [isSpellcaster, setIsSpellcaster] = useState(false);
  const router = useRouter();

  const methods = useForm<Character>({
    defaultValues: {},
    mode: "onBlur",
  });

  const { handleSubmit, setValue, reset } = methods;

  // Reset form when character data is loaded
  useEffect(() => {
    if (character) {
      // Reset the form with the character data
      reset(character);

      // Directly set values for fields that might not be properly captured by reset
      if (character.basicInfo?.class) {
        setValue("basicInfo.class", character.basicInfo.class);
      }

      if (character.basicInfo?.alignment) {
        setValue("basicInfo.alignment", character.basicInfo.alignment);
      }

      if (character.stats?.hitDice?.diceType) {
        setValue("stats.hitDice.diceType", character.stats.hitDice.diceType);
      }

      if (character.spellcasting?.spellcastingClass) {
        setValue(
          "spellcasting.spellcastingClass",
          character.spellcasting.spellcastingClass
        );
      }

      if (character.spellcasting?.spellcastingAbility) {
        setValue(
          "spellcasting.spellcastingAbility",
          character.spellcasting.spellcastingAbility
        );
      }

      // Set isSpellcaster based on character data
      const isSpellcastingClass =
        character.basicInfo?.class &&
        SPELLCASTING_CLASSES.includes(character.basicInfo.class);
      const hasSpellcastingData =
        !!character.spellcasting?.spellSaveDC ||
        !!character?.spellcasting?.spellAttackBonus;
      const isCustomSpellcaster =
        character.basicInfo?.class?.toLowerCase() === "custom";

      if (isSpellcastingClass || hasSpellcastingData || isCustomSpellcaster) {
        setIsSpellcaster(true);
      }

      // Mark the form as ready after a small delay to ensure values are set
      setTimeout(() => {
        setFormReady(true);
      }, 100);
    }
  }, [character, reset, setValue]);

  const preSubmit = async (data: Character) => {
    const perceptionModifier = getModifier(data.abilities.wisdom);
    const isProficientInPerception = data.skills.perception.hasProficiency;
    const level = data.basicInfo.level;
    const profBonus = isProficientInPerception
      ? getProficiencyBonus(data.basicInfo.level)
      : 0;

    const passiveWisdom = isProficientInPerception
      ? perceptionModifier + 10 + profBonus
      : perceptionModifier + 10;

    const featuresWithoutV4Ids = data.featuresAndTraits?.map((feature) => {
      if (feature?._id?.length !== 24) {
        return { ...feature, _id: undefined };
      }
      return feature;
    });

    const attacksWithoutV4Ids = data.attacks?.map((attack) => {
      if (attack?._id?.length !== 24) {
        return { ...attack, _id: undefined };
      }
      return attack;
    });

    const featsWithoutV4Ids = data.feats?.map((feat: Feat) => {
      if (feat?._id?.length !== 24) {
        return { ...feat, _id: undefined };
      }
      return feat;
    });

    onSubmit({
      ...data,
      featuresAndTraits: featuresWithoutV4Ids,
      attacks: attacksWithoutV4Ids,
      feats: featsWithoutV4Ids,
      passiveWisdom,
      stats: {
        ...data.stats,
        hitPointsTotal: data.stats.hitPointsTotal,
        hitPointsCurrent: data.stats.hitPointsCurrent,
        hitPointsTemp: data.stats.hitPointsTemp || 0,
        hitDice: {
          remaining: level,
          total: level,
          diceType: data.stats.hitDice.diceType,
        },
      },
    });
  };

  const onSubmit = async (data: Character) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const spellsWithoutV4Ids = data?.spells?.map((spell) => {
      return {
        ...spell,
        _id: spell?._id?.length === 24 ? spell._id : undefined,
      };
    });

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/update`,
        { ...data, spells: spellsWithoutV4Ids },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        router.push(`/characters/${character?._id}`);
        toast.success("Character updated successfully");
        setCharacter(response.data);
      }
    } catch (error) {
      setIsSubmitting(false);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "An error occurred"
        );
      } else {
        toast.error("Server is probably down.");
      }
    }
  };

  // ---------- return statements ----------

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader size={24} className="animate-spin" />
      </div>
    );

  if (!character) {
    return (
      <div className="w-full flex justify-center items-center text-red-500 text-2xl">
        Character not found
      </div>
    );
  }

  if (!formReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
      <BackButton url={`/characters/${character?._id}`} />
      <p className="text-2xl font-bold text-center">Edit character</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(preSubmit)} className="space-y-8 ">
          <CharacterForm
            isSpellcaster={isSpellcaster}
            setIsSpellcaster={setIsSpellcaster}
            isSubmitting={isSubmitting}
            formReady={formReady}
          />
        </form>
      </FormProvider>
    </div>
  );
};

const EditCharacterWrapper = () => {
  return (
    <CharacterProvider>
      <EditCharacter />
    </CharacterProvider>
  );
};

export default EditCharacterWrapper;
