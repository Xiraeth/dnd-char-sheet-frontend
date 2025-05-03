"use client";

import {
  SPELLCASTING_ABILITIES,
  SPELLCASTING_CLASSES,
  SPELLCASTING_CLASSES_ABILITIES_MAP,
} from "@/app/constants";
import { Character, CharacterAbilities } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="spellcastingClass">Spellcasting Class</Label>
          <Select
            value={watch("spellcasting.spellcastingClass")}
            onValueChange={(value) => {
              setValue("spellcasting.spellcastingClass", value);
              const classSpellcastingAbility =
                SPELLCASTING_CLASSES_ABILITIES_MAP.find(
                  (ability) => ability.label === value
                )?.value as keyof CharacterAbilities;

              if (classSpellcastingAbility) {
                const abilities = watch("abilities");
                if (abilities) {
                  const abilityValue = abilities[classSpellcastingAbility];
                  const level = watch("basicInfo.level");

                  if (abilityValue !== undefined && level) {
                    const spellAttackBonus = calculateSpellAttackBonus({
                      level,
                      ability: Number(abilityValue),
                    });
                    const spellSaveDC = calculateSpellSaveDC({
                      level,
                      ability: Number(abilityValue),
                    });

                    setValue("spellcasting.spellSaveDC", spellSaveDC);
                    setValue("spellcasting.spellAttackBonus", spellAttackBonus);
                  }
                }

                setValue(
                  "spellcasting.spellcastingAbility",
                  classSpellcastingAbility
                );
              }
            }}
            {...register("spellcasting.spellcastingClass")}
          >
            <SelectTrigger className="text-indigo-600">
              <SelectValue placeholder="Spellcasting Class">
                {watch("spellcasting.spellcastingClass") ||
                  "Spellcasting Class"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent id="spellcastingClass" className="text-indigo-600">
              {spellcastingClassesObject.map((ability) => (
                <SelectItem key={ability.value} value={ability.value}>
                  {ability.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="spellcastingAbility">Spellcasting Ability</Label>
          <Select
            value={watch("spellcasting.spellcastingAbility")}
            onValueChange={(value) => {
              // Set the spellcasting ability first
              setValue(
                "spellcasting.spellcastingAbility",
                value as keyof CharacterAbilities
              );

              // Only calculate if we have valid data
              const abilities = watch("abilities");
              if (abilities) {
                const ability = abilities[value as keyof CharacterAbilities];
                const level = watch("basicInfo.level");

                if (ability !== undefined && level) {
                  const spellAttackBonus = calculateSpellAttackBonus({
                    level,
                    ability: Number(ability),
                  });
                  const spellSaveDC = calculateSpellSaveDC({
                    level,
                    ability: Number(ability),
                  });

                  setValue("spellcasting.spellSaveDC", spellSaveDC);
                  setValue("spellcasting.spellAttackBonus", spellAttackBonus);
                }
              }
            }}
            {...register("spellcasting.spellcastingAbility")}
          >
            <SelectTrigger className="text-indigo-600">
              <SelectValue placeholder="Spellcasting Ability">
                {watch("spellcasting.spellcastingAbility")
                  ? (watch("spellcasting.spellcastingAbility") || "")
                      .charAt(0)
                      .toUpperCase() +
                    (watch("spellcasting.spellcastingAbility") || "").slice(1)
                  : "Spellcasting Ability"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent id="spellcastingAbility" className="text-indigo-600">
              {SPELLCASTING_ABILITIES.map((ability) => (
                <SelectItem key={ability.value} value={ability.value}>
                  {ability.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="spellSaveDC">Spell Save DC</Label>
          <Input
            id="spellSaveDC"
            className="text-indigo-600"
            placeholder="Spell Save DC"
            {...register("spellcasting.spellSaveDC")}
          />
          <p className="text-sm opacity-75 italic ml-2 relative md:bottom-2 text-black">
            (8 + spellcasting ability modifier + proficiency bonus)
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label htmlFor="spellAttackBonus">Spell Attack Bonus</Label>
          <Input
            id="spellAttackBonus"
            className="text-indigo-600"
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
