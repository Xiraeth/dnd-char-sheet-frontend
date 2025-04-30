import { Character, CharacterAbilities, CharacterSkills } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DEXTERITY_SKILLS,
  STRENGTH_SKILLS,
  INTELLIGENCE_SKILLS,
  WISDOM_SKILLS,
  CHARISMA_SKILLS,
} from "@/app/constants";

type SkillItemProps = {
  skill: { label: string; value: string; ability: string };
  proficiencyBonus: number;
};

const SkillItem = ({ skill, proficiencyBonus }: SkillItemProps) => {
  const { register, watch, setValue } = useFormContext<Character>();

  const hasProficiency = watch(
    `skills.${skill.value as keyof CharacterSkills}.hasProficiency`
  );
  const hasExpertise = watch(
    `skills.${skill.value as keyof CharacterSkills}.hasExpertise`
  );

  const baseModifier = getModifier(
    Number(
      watch(`abilities.${skill.ability as keyof CharacterAbilities}`) || 10
    ) || 10
  );

  const basePlusOtherModifier =
    baseModifier +
    (Number(
      watch(`skills.${skill.value as keyof CharacterSkills}.otherModifier`) || 0
    ) || 0);

  const modifier = hasExpertise
    ? basePlusOtherModifier + 2 * proficiencyBonus
    : hasProficiency
    ? basePlusOtherModifier + proficiencyBonus
    : basePlusOtherModifier;

  const modifierColour =
    modifier > 0
      ? "text-green-600"
      : modifier < 0
      ? "text-red-600"
      : "text-black";

  return (
    <div
      className="grid grid-rows-2 sm:grid-rows-1 grid-cols-2 sm:grid-cols-3 gap-2 justify-between w-full border-[1px] border-black/15 rounded-lg px-4 py-2 
              shadow-card"
      key={skill.value}
    >
      <p className="order-1">{skill.label}</p>
      <div className="flex gap-4 items-center justify-end sm:justify-center order-2 sm:order-3">
        <div className="flex gap-4 items-center">
          <p className={clsx(modifierColour, "font-bold")}>
            ({modifier > 0 ? "+" + modifier : modifier})
          </p>
          <Switch
            {...register(
              `skills.${skill.value as keyof CharacterSkills}.hasProficiency`
            )}
            onCheckedChange={(checked) => {
              setValue(
                `skills.${skill.value as keyof CharacterSkills}.hasProficiency`,
                checked
              );

              if (!checked) {
                setValue(
                  `skills.${skill.value as keyof CharacterSkills}.hasExpertise`,
                  false
                );
              }
            }}
            checked={watch(
              `skills.${skill.value as keyof CharacterSkills}.hasProficiency`
            )}
          />
          <Checkbox
            {...register(
              `skills.${skill.value as keyof CharacterSkills}.hasExpertise`
            )}
            checked={watch(
              `skills.${skill.value as keyof CharacterSkills}.hasExpertise`
            )}
            onCheckedChange={(checked) => {
              setValue(
                `skills.${skill.value as keyof CharacterSkills}.hasExpertise`,
                checked === true ? true : false
              );
            }}
            disabled={
              !watch(
                `skills.${skill.value as keyof CharacterSkills}.hasProficiency`
              )
            }
          />
        </div>
      </div>

      <div className="font-scalySans flex gap-2 italic text-gray-700 col-span-full sm:col-span-1 justify-center order-3 sm:order-2">
        <label>Other modifier (+/-)</label>
        <input
          className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
          type="number"
          onChange={(e) => {
            setValue(
              `skills.${skill.value as keyof CharacterSkills}.otherModifier`,
              Number(e.target.value)
            );
          }}
          value={
            watch(
              `skills.${skill.value as keyof CharacterSkills}.otherModifier`
            ) || ""
          }
        />
      </div>
    </div>
  );
};

type SkillGroupProps = {
  title: string;
  skills: Array<{ label: string; value: string; ability: string }>;
  proficiencyBonus: number;
};

const SkillGroup = ({ title, skills, proficiencyBonus }: SkillGroupProps) => {
  return (
    <div>
      <p className="text-xl font-bold mb-2 text-center font-mrEaves">{title}</p>
      <div className="w-full mx-auto flex flex-col gap-4">
        {skills.map((skill) => (
          <SkillItem
            key={skill.value}
            skill={skill}
            proficiencyBonus={proficiencyBonus}
          />
        ))}
      </div>
    </div>
  );
};

const SkillsCard = () => {
  const { watch } = useFormContext<Character>();

  const proficiencyBonus = watch("basicInfo.level")
    ? getProficiencyBonus(watch("basicInfo.level"))
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center flex justify-center items-center gap-2 w-full">
          <p className="relative">Skills </p>
          <span className="text-sm opacity-75 font-normal italic">
            (switches for proficiency, checkboxes for expertise)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SkillGroup
          title="Strength"
          skills={STRENGTH_SKILLS}
          proficiencyBonus={proficiencyBonus}
        />
        <SkillGroup
          title="Dexterity"
          skills={DEXTERITY_SKILLS}
          proficiencyBonus={proficiencyBonus}
        />
        <SkillGroup
          title="Intelligence"
          skills={INTELLIGENCE_SKILLS}
          proficiencyBonus={proficiencyBonus}
        />
        <SkillGroup
          title="Wisdom"
          skills={WISDOM_SKILLS}
          proficiencyBonus={proficiencyBonus}
        />
        <SkillGroup
          title="Charisma"
          skills={CHARISMA_SKILLS}
          proficiencyBonus={proficiencyBonus}
        />
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
