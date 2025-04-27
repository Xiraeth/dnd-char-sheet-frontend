import clsx from "clsx";
import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { getProficiencyBonus } from "@/lib/utils";
import { capitalize } from "@/lib/utils";
import { Asterisk, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CharacterSkills } from "@/app/types";
import { SKILLS_PER_ABILITY } from "@/app/constants";

const Skills = () => {
  const { character } = useCharacter();
  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );
  const [areSkillsVisible, setAreSkillsVisible] = useState(false);
  const skillsPerAbility = Object.entries(SKILLS_PER_ABILITY);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl sm:text-3xl font-bold ml-auto font-mrEaves">
          Skills
        </span>
        <ChevronDown
          className={clsx(
            "size-6 ml-auto cursor-pointer bg-white/20 rounded-full p-1",
            areSkillsVisible ? "rotate-180" : ""
          )}
          onClick={() => setAreSkillsVisible(!areSkillsVisible)}
        />
      </div>

      <div
        className={clsx(
          "grid grid-cols-2 sm:grid-cols-3 gap-x-20 gap-y-6 font-bookInsanity text-base sm:text-lg my-4",
          !areSkillsVisible && "hidden"
        )}
      >
        {areSkillsVisible &&
          skillsPerAbility?.map(([ability, skills]) => {
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
                    value: skillValue = 0,
                    hasProficiency,
                    hasExpertise,
                  } = skillData || {};

                  const finalSkillValue = hasExpertise
                    ? skillValue + proficiencyBonus * 2
                    : hasProficiency
                    ? skillValue + proficiencyBonus
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
                          <Asterisk className="absolute -top-1 -right-6 text-indigo-500 size-4" />
                        )}
                      </div>

                      <span
                        className={clsx(
                          hasProficiency ? "font-bold text-lg" : ""
                        )}
                      >
                        ({modifierSign}
                        {finalSkillValue +
                          ((skillData?.otherModifier as number | undefined) ||
                            0)}
                        )
                      </span>
                    </div>
                  );
                })}
              </Card>
            );
          })}
      </div>

      <div className="text-base sm:text-lg font-bookInsanity text-dndRed italic text-center">
        Senses passive perception {character?.passiveWisdom}
      </div>
    </div>
  );
};

export default Skills;
