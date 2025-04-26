"use client";

import BackButton from "@/components/BackButton";
import { Character } from "@/app/types";
import { useForm, FormProvider } from "react-hook-form";

import { useState } from "react";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CharacterForm from "@/app/create-character/components/CharacterForm";
import CharacterProvider, {
  useCharacter,
} from "@/app/characters/[characterId]/components/CharacterProvider";

const EditCharacter = () => {
  const { character } = useCharacter();

  console.log(character);
  const [isSpellcaster, setIsSpellcaster] = useState(false);
  const router = useRouter();

  const methods = useForm<Character>({
    defaultValues: character || {},
  });

  const { handleSubmit, setValue } = methods;

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
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/update`,
        {
          ...data,
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

  if (!character) {
    return <div>Character not found</div>;
  }

  return (
    <CharacterProvider>
      <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
        <BackButton url={`/characters/${character?._id}`} />
        <p className="text-2xl font-bold text-center">Edit character</p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 ">
            <CharacterForm
              isSpellcaster={isSpellcaster}
              setIsSpellcaster={setIsSpellcaster}
              initialValues={character}
            />
          </form>
        </FormProvider>
      </div>
    </CharacterProvider>
  );
};
export default EditCharacter;
