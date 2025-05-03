"use client";

import BackButton from "@/components/BackButton";
import { Character } from "@/app/types";
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

const EditCharacter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { character, isLoading, setCharacter } = useCharacter();

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
      console.log("Resetting form with character data:", {
        class: character.basicInfo?.class,
        alignment: character.basicInfo?.alignment,
        hitDiceType: character.stats?.hitDice?.diceType,
      });

      // Use this to force a complete reset with the character data
      reset(character);

      // Set isSpellcaster based on character data
      if (
        character.basicInfo?.class?.toLowerCase() === "custom" ||
        character.spellcasting
      ) {
        setIsSpellcaster(true);
      }
    }
  }, [character, reset]);

  const preSubmit = async (data: Character) => {
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
    setValue("stats.hitPointsTemp", 0);
    setValue("stats.hitDice.remaining", level);
    setValue("stats.hitDice.total", level);

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

    onSubmit({
      ...data,
      featuresAndTraits: featuresWithoutV4Ids,
      attacks: attacksWithoutV4Ids,
      passiveWisdom,
      stats: {
        ...data.stats,
        hitPointsCurrent: hitpoints,
        hitPointsTemp: 0,
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
