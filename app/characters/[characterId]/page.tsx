"use client";

import { Character, CharacterSkills } from "@/app/types";
import { useUser } from "@/app/UserProvider";
import BackButton from "@/components/BackButton";
import DndDivider from "@/components/RedDivider";
import axios from "axios";
import { Asterisk, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";
import { capitalize, getProficiencyBonus } from "@/lib/utils";
import { getModifier } from "@/lib/utils";
import { SKILLS_PER_ABILITY } from "@/app/constants";
import { Card } from "@/components/ui/card";
import clsx from "clsx";

// Define the params type
type CharacterParams = {
  characterId: string;
};

const VerticalDivider = () => {
  return <div className="h-[20px] w-[2px] bg-indigo-600 hidden sm:block" />;
};

const CharacterPage = ({ params }: { params: Promise<CharacterParams> }) => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const characterId = unwrappedParams.characterId;

  useEffect(() => {
    setIsLoading(true);

    if (!user && !isLoading) {
      router.replace("/");
      return;
    }

    try {
      const fetchCharacters = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/${characterId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setCharacter(response.data.character);
        setIsLoading(false);
      };

      fetchCharacters();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "An error occurred"
        );
      } else {
        setError("An error occurred. Server is probably down.");
      }
      setIsLoading(false);
    }
  }, [user, characterId, router]);

  const charAbilities = Object.entries(character?.abilities || {});
  const charSavingThrows = Object.entries(character?.savingThrows || {});
  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  const skillsPerAbility = Object.entries(SKILLS_PER_ABILITY);

  // ----------  return statements ---------- do not write code bellow this point ----------

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        {error}
      </div>
    );

  if (!character)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Character not found
      </div>
    );

  return (
    <div>
      <BackButton url="/characters" />

      <div id="content" className="p-4 mt-6 sm:mt-0 sm:p-12">
        {/* basic info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-1 w-full justify-center sm:justify-between">
          <p className="text-4xl sm:text-6xl text-dndRed font-scalySans">
            {character?.basicInfo?.name}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-2 font-bookInsanity">
            <p className="text-base sm:text-lg">
              Level {character?.basicInfo?.level} {character?.basicInfo?.race}{" "}
              {character?.basicInfo?.class}{" "}
            </p>
            <VerticalDivider />
            <p className="text-base sm:text-lg">
              {character?.basicInfo?.alignment},{" "}
              {character?.basicInfo?.background}
            </p>
          </div>
        </div>

        <DndDivider />

        {/* stats */}
        <div className="grid grid-cols-2 justify-items-center items-center sm:grid-cols-4 gap-4 my-4">
          <p className="text-base sm:text-lg text-dndRed">
            <span className="font-bold">Armor Class:</span>{" "}
            {character?.stats?.armorClass}
          </p>

          <p className="text-base sm:text-lg text-dndRed">
            <span className="font-bold">Hit Points:</span>{" "}
            {character?.stats?.hitPointsTotal}
          </p>

          <p className="text-base sm:text-lg text-dndRed">
            <span className="font-bold">Speed:</span> {character?.stats?.speed}
            ft
          </p>

          <p className="text-base sm:text-lg text-dndRed">
            <span className="font-bold">Initiative:</span>{" "}
            {character?.stats?.initiative}
          </p>
        </div>

        <DndDivider />

        {/* abilities */}
        <div className="grid grid-cols-6 sm:grid-cols-6 gap-x-10 gap-y-4 text-base sm:text-lg text-dndRed my-4">
          {character &&
            charAbilities?.map(([ability, value]) => {
              const modifier = getModifier(value);
              const modifierSign = modifier > 0 ? "+" : "";

              return (
                <div
                  key={ability}
                  className="flex flex-col justify-center items-center"
                >
                  <p className="font-bold">
                    {capitalize(ability?.slice(0, 3))}
                  </p>
                  <p className="text-center flex text-nowrap">
                    {value} ({modifierSign}
                    {modifier})
                  </p>
                </div>
              );
            })}
        </div>

        <DndDivider />

        {/* saving throws */}
        <div className="grid grid-cols-6 gap-x-10 gap-y-4 text-base sm:text-lg text-dndRed my-4">
          {character &&
            charSavingThrows?.map(([ability, savingThrow]) => {
              const value = savingThrow?.value;
              const hasProficiency = savingThrow?.hasProficiency;
              const finalValue = hasProficiency
                ? value + proficiencyBonus
                : value;

              const modifierSign = finalValue > 0 ? "+" : "";

              return (
                <div
                  key={ability}
                  className="flex flex-col justify-center items-center"
                >
                  <div className="relative">
                    <p className="font-bold">
                      {capitalize(ability?.slice(0, 3))}
                    </p>
                    <div className="flex items-center gap-1">
                      ({modifierSign}
                      {finalValue})
                      {hasProficiency && (
                        <Asterisk className="absolute -top-1 -right-3 text-indigo-500 size-4" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          <p className="font-bold col-span-6 text-center -mb-2 text-black">
            Saving throws
          </p>
        </div>

        <DndDivider />

        {/* skills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-20 gap-y-6 font-bookInsanity text-base sm:text-lg my-4">
          {skillsPerAbility?.map(([ability, skills]) => {
            return (
              <Card
                key={ability}
                className="flex flex-col gap-2 p-2 min-w-fit text-dndRed col-span-2 sm:col-span-1 backdrop-blur-md"
              >
                <p className="font-bold text-center">{capitalize(ability)}</p>
                {skills?.map((skill) => {
                  const skillKey = skill?.value as keyof CharacterSkills;
                  const skillData = character?.skills[skillKey];

                  const {
                    value: skillValue,
                    hasProficiency,
                    hasExpertise,
                  } = skillData || {};

                  const finalSkillValue = hasProficiency
                    ? skillValue + proficiencyBonus
                    : hasExpertise
                    ? skillValue + proficiencyBonus * 2
                    : skillValue;

                  const modifierSign = finalSkillValue > 0 ? "+" : "";

                  return (
                    <div
                      key={skill.value}
                      className="mb-2 w-full flex justify-between gap-4"
                    >
                      <div className="relative">
                        {skill.label}
                        {hasProficiency && (
                          <Asterisk className="absolute -top-1 -right-3 text-indigo-500 size-4" />
                        )}
                        {hasExpertise && (
                          <Asterisk className="absolute -top-1 -right-3 text-indigo-500 size-4" />
                        )}
                      </div>

                      <span
                        className={clsx(
                          hasProficiency ? "font-bold text-lg" : ""
                        )}
                      >
                        ({modifierSign}
                        {finalSkillValue})
                      </span>
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>

        <DndDivider />
      </div>
    </div>
  );
};

export default CharacterPage;
