"use client";

import {
  ALIGNMENTS,
  CLASSES,
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
import { useFormContext } from "react-hook-form";
import { RaceSearch } from "./RaceSearch";
import { calculateSpellAttackBonus, calculateSpellSaveDC } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const BasicInfoCard = ({
  setIsSpellcaster,
}: {
  setIsSpellcaster: (isSpellcaster: boolean) => void;
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        {/* name */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.name">
            Name
          </Label>
          <Input
            id="basicInfo.name"
            placeholder="Name"
            {...register("basicInfo.name", {
              required: "Name is required",
            })}
          />
          {errors?.basicInfo?.name && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.name.message}
            </p>
          )}
        </div>

        {/* class */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.class">
            Class
          </Label>
          <Select
            onValueChange={(value) => {
              setValue("basicInfo.class", value);
              setIsSpellcaster(SPELLCASTING_CLASSES.includes(value));
              if (SPELLCASTING_CLASSES.includes(value)) {
                const classSpellcastingAbility =
                  SPELLCASTING_CLASSES_ABILITIES_MAP.find(
                    (ability) => ability.label === value
                  )?.value as keyof CharacterAbilities;

                const abilityValue =
                  watch("abilities")[classSpellcastingAbility];

                const spellAttackBonus = calculateSpellAttackBonus({
                  level: watch("basicInfo.level"),
                  ability: abilityValue,
                });
                const spellSaveDC = calculateSpellSaveDC({
                  level: watch("basicInfo.level"),
                  ability: abilityValue,
                });

                setValue("spellcasting.spellcastingClass", value);
                setValue(
                  "spellcasting.spellcastingAbility",
                  SPELLCASTING_CLASSES_ABILITIES_MAP.find(
                    (ability) => ability.label === value
                  )?.value as keyof CharacterAbilities
                );

                setValue("spellcasting.spellSaveDC", spellSaveDC);
                setValue("spellcasting.spellAttackBonus", spellAttackBonus);
              }
            }}
            value={watch("basicInfo.class") || ""}
          >
            <SelectTrigger id="class-trigger">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent id="class-content">
              {CLASSES.map((dndClass) => (
                <SelectItem key={dndClass} value={dndClass}>
                  {dndClass}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.basicInfo?.class && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.class.message}
            </p>
          )}
        </div>

        {/* race */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.race">
            Race
          </Label>
          <RaceSearch />
          {errors?.basicInfo?.race && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.race.message}
            </p>
          )}
        </div>

        {/* level */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.level">
            Level
          </Label>
          <Input
            id="basicInfo.level"
            placeholder="Level"
            type="number"
            {...register("basicInfo.level", {
              required: "Level is required",
              min: {
                value: 1,
                message: "Level must be at least 1",
              },
              max: {
                value: 20,
                message: "Level cannot exceed 20",
              },
              onChange: (e) => {
                const level = parseInt(e.target.value);
                const ability =
                  watch("abilities")[
                    watch(
                      "spellcasting.spellcastingAbility"
                    ) as keyof CharacterAbilities
                  ];

                const spellAttackBonus = calculateSpellAttackBonus({
                  level,
                  ability,
                });
                const spellSaveDC = calculateSpellSaveDC({
                  level,
                  ability,
                });

                setValue("spellcasting.spellAttackBonus", spellAttackBonus);
                setValue("spellcasting.spellSaveDC", spellSaveDC);
              },
            })}
          />
          {errors?.basicInfo?.level && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.level.message}
            </p>
          )}
        </div>

        {/* alignment */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.alignment">
            Alignment
          </Label>
          <Select
            onValueChange={(value) => setValue("basicInfo.alignment", value)}
            value={watch("basicInfo.alignment") || ""}
          >
            <SelectTrigger id="alignment-trigger">
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent id="alignment-content">
              {ALIGNMENTS.map((alignment) => (
                <SelectItem key={alignment} value={alignment}>
                  {alignment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.basicInfo?.alignment && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.alignment.message}
            </p>
          )}
        </div>

        {/* background */}
        <div className="flex flex-col gap-2">
          <Label className="text-black" htmlFor="basicInfo.background">
            Background
          </Label>
          <Input
            id="basicInfo.background"
            placeholder="Background"
            {...register("basicInfo.background", {
              required: "Background is required",
            })}
          />
          {errors?.basicInfo?.background && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.background.message}
            </p>
          )}
        </div>

        {/* player name */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label className="text-black" htmlFor="basicInfo.playerName">
            Player Name
          </Label>
          <Input
            id="basicInfo.playerName"
            placeholder="Player Name"
            {...register("basicInfo.playerName", {
              required: "Player Name is required",
            })}
          />
          {errors?.basicInfo?.playerName && (
            <p className="text-red-600 text-sm">
              {errors.basicInfo.playerName.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
