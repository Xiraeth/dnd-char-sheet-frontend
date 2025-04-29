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
  });

  const { handleSubmit, setValue, reset } = methods;

  // Reset form when character data is loaded
  useEffect(() => {
    if (character) {
      reset(character);

      // Set isSpellcaster based on character data
      if (
        character.basicInfo?.class?.toLowerCase() === "custom" &&
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

    onSubmit({
      ...data,
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
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/update`,
        {
          ...data,
        },
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
