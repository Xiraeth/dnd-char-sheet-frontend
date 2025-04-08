"use client";

import {
  SPELLCASTING_ABILITIES,
  SPELLCASTING_CLASSES,
  SPELLCASTING_CLASSES_ABILITIES_MAP,
} from "@/app/constants";
import { Character, CharacterAbilities } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateSpellAttackBonus, calculateSpellSaveDC } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

const SpellcastingCard = () => {
  const { register, setValue, watch } = useFormContext<Character>();

  const spellcastingClassesObject = SPELLCASTING_CLASSES.map((ability) => ({
    label: ability,
    value: ability,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Spellcasting</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        <Select
          value={watch("spellcasting.spellcastingClass")}
          onValueChange={(value) => {
            setValue("spellcasting.spellcastingClass", value);
            const classSpellcastingAbility =
              SPELLCASTING_CLASSES_ABILITIES_MAP.find(
                (ability) => ability.label === value
              )?.value as keyof CharacterAbilities;

            const abilityValue = watch("abilities")[classSpellcastingAbility];

            setValue(
              "spellcasting.spellcastingAbility",
              classSpellcastingAbility
            );

            const spellAttackBonus = calculateSpellAttackBonus({
              level: watch("basicInfo.level"),
              ability: abilityValue,
            });
            const spellSaveDC = calculateSpellSaveDC({
              level: watch("basicInfo.level"),
              ability: abilityValue,
            });

            setValue("spellcasting.spellSaveDC", spellSaveDC);
            setValue("spellcasting.spellAttackBonus", spellAttackBonus);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Spellcasting Class" />
          </SelectTrigger>
          <SelectContent>
            {spellcastingClassesObject.map((ability) => (
              <SelectItem key={ability.value} value={ability.value}>
                {ability.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={watch("spellcasting.spellcastingAbility")}
          onValueChange={(value) => {
            const ability =
              watch("abilities")[value as keyof CharacterAbilities];

            const spellAttackBonus = calculateSpellAttackBonus({
              level: watch("basicInfo.level"),
              ability,
            });
            const spellSaveDC = calculateSpellSaveDC({
              level: watch("basicInfo.level"),
              ability,
            });

            setValue(
              "spellcasting.spellcastingAbility",
              value as keyof CharacterAbilities
            );
            setValue("spellcasting.spellSaveDC", spellSaveDC);
            setValue("spellcasting.spellAttackBonus", spellAttackBonus);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Spellcasting Ability" />
          </SelectTrigger>
          <SelectContent>
            {SPELLCASTING_ABILITIES.map((ability) => (
              <SelectItem key={ability.value} value={ability.value}>
                {ability.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-2 relative">
          <Input
            placeholder="Spell Save DC"
            {...register("spellcasting.spellSaveDC")}
          />
          <p className="text-sm opacity-75 italic ml-2 relative md:bottom-2 text-black">
            (8 + spellcasting ability modifier + proficiency bonus)
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Input
            placeholder="Spell Attack Bonus"
            type="number"
            {...register("spellcasting.spellAttackBonus")}
          />
          <p className="text-sm opacity-75 italic ml-2 relative md:bottom-2 text-black">
            (spellcasting ability modifier + proficiency bonus)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpellcastingCard;
