"use client";

import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Character,
  CharacterAbilities,
  CharacterSavingThrows,
  CharacterSkills,
} from "@/app/types";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ABILITIES, ALIGNMENTS, DICE_OPTIONS, SKILLS } from "@/app/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getModifier } from "@/lib/utils";
import clsx from "clsx";

const defaultValues: Partial<Character> = {
  savingThrows: ABILITIES.reduce((acc, ability) => {
    acc[ability.value as keyof CharacterSavingThrows] = {
      value: 0,
      hasProficiency: false,
    };
    return acc;
  }, {} as CharacterSavingThrows),
  skills: SKILLS.reduce((acc, skill) => {
    acc[skill.value as keyof CharacterSkills] = {
      value: 0,
      ability: skill.ability as keyof CharacterAbilities,
      hasProficiency: false,
      hasExpertise: false,
    };
    return acc;
  }, {} as CharacterSkills),
};

const CreateCharacter = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Character>({
    defaultValues,
  });

  const proficiencyBonus = watch("basicInfo.level")
    ? Math.ceil(watch("basicInfo.level") / 4) + 1
    : 0;

  const onSubmit = (data: Character) => {
    console.log(data);
  };

  return (
    <div className="space-y-4 pb-20 w-10/12 md:w-4/6 mx-auto">
      <BackButton url="/" />
      <p className="text-2xl font-bold text-center">Create a new character</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-600">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Name"
                {...register("basicInfo.name", {
                  required: "Name is required",
                })}
              />
              {errors?.basicInfo?.name && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Class"
                {...register("basicInfo.class", {
                  required: "Class is required",
                })}
              />
              {errors?.basicInfo?.class && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.class.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Race"
                {...register("basicInfo.race", {
                  required: "Race is required",
                })}
              />
              {errors?.basicInfo?.race && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.race.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  className="w-2/3"
                  placeholder="Level"
                  type="number"
                  {...register("basicInfo.level", {
                    required: "Level is required",
                    min: { value: 1, message: "Level must be at least 1" },
                    max: { value: 20, message: "Level cannot exceed 20" },
                  })}
                />
                <Input
                  className="text-center md:text-start w-1/3"
                  readOnly
                  disabled
                  placeholder="Proficiency Bonus"
                  value={
                    watch("basicInfo.level") ? `(+${proficiencyBonus})` : ""
                  }
                />
              </div>

              {errors?.basicInfo?.level && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.level.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Background"
                {...register("basicInfo.background", {
                  required: "Background is required",
                })}
              />
              {errors?.basicInfo?.background && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.background.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Select
                {...register("basicInfo.alignment", {
                  required: "Alignment is required",
                })}
                onValueChange={(value) =>
                  setValue("basicInfo.alignment", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alignment" />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENTS.map((alignment) => (
                    <SelectItem key={alignment} value={alignment}>
                      {alignment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.basicInfo?.alignment && (
                <p className="text-red-500 text-sm">
                  {errors.basicInfo.alignment.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* abilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Abilities</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-600">
            {ABILITIES.map((ability) => {
              const modifier = getModifier(
                Number(
                  watch(
                    `abilities.${ability.value as keyof CharacterAbilities}`
                  )
                ) || 10
              );

              const modifierColour =
                modifier > 0
                  ? "text-green-500"
                  : modifier < 0
                  ? "text-red-500"
                  : "text-black";

              return (
                <div key={ability.value} className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 w-full">
                    <Input
                      className="w-11/12"
                      placeholder={ability.label}
                      type="number"
                      {...register(
                        `abilities.${
                          ability.value as keyof CharacterAbilities
                        }`,
                        {
                          required: `${ability.label} is required`,
                          onChange: (e) => {
                            setValue(
                              `savingThrows.${
                                ability.value as keyof CharacterSavingThrows
                              }.value`,
                              getModifier(parseInt(e.target.value))
                            );

                            SKILLS.forEach((skill) => {
                              if (skill.ability === ability.value) {
                                setValue(
                                  `skills.${
                                    skill.value as keyof CharacterSkills
                                  }.value`,
                                  getModifier(parseInt(e.target.value))
                                );
                              }
                            });
                          },
                        }
                      )}
                    />
                    <p
                      className={clsx(
                        "w-1/12 opacity-50 text-start",
                        modifierColour
                      )}
                    >
                      ({modifier > 0 ? "+" + modifier : modifier})
                    </p>
                  </div>

                  {errors?.abilities?.[
                    ability.value as keyof CharacterAbilities
                  ] && (
                    <p className="text-red-500 text-sm">
                      {
                        errors.abilities[
                          ability.value as keyof CharacterAbilities
                        ]?.message
                      }
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* saving throws */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Saving throws{" "}
              <span className="text-sm opacity-75 font-normal italic">
                (switches for proficiency)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {ABILITIES.map((ability) => {
              const isProficient = watch(
                `savingThrows.${
                  ability.value as keyof CharacterSavingThrows
                }.hasProficiency`
              );

              const modifierValue = getModifier(
                Number(
                  watch(
                    `abilities.${ability.value as keyof CharacterAbilities}`
                  )
                ) || 10
              );

              const modifier = isProficient
                ? modifierValue + (proficiencyBonus || 0)
                : modifierValue;

              const modifierColour =
                modifier > 0
                  ? "text-green-500"
                  : modifier < 0
                  ? "text-red-500"
                  : "text-black";

              return (
                <div
                  className="flex gap-2 justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-md"
                  key={ability.value}
                >
                  <p>{ability.label}</p>

                  <div className="flex gap-4 items-center">
                    <p className={clsx(modifierColour)}>
                      ({modifier > 0 ? "+" + modifier : modifier})
                    </p>
                    <Switch
                      {...register(
                        `savingThrows.${
                          ability.value as keyof CharacterSavingThrows
                        }.hasProficiency`
                      )}
                      onCheckedChange={(checked) => {
                        setValue(
                          `savingThrows.${
                            ability.value as keyof CharacterSavingThrows
                          }.hasProficiency`,
                          checked
                        );
                      }}
                      checked={watch(
                        `savingThrows.${
                          ability.value as keyof CharacterSavingThrows
                        }.hasProficiency`
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Skills{" "}
              <span className="text-sm opacity-75 font-normal italic">
                (switches for proficiency, checkboxes for expertise)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
            {SKILLS.map((skill) => {
              const hasProficiency = watch(
                `skills.${skill.value as keyof CharacterSkills}.hasProficiency`
              );
              const hasExpertise = watch(
                `skills.${skill.value as keyof CharacterSkills}.hasExpertise`
              );

              const baseModifier = getModifier(
                Number(
                  watch(
                    `abilities.${skill.ability as keyof CharacterAbilities}`
                  ) || 10
                ) || 10
              );

              const modifier = hasExpertise
                ? baseModifier + 2 * proficiencyBonus
                : hasProficiency
                ? baseModifier + proficiencyBonus
                : baseModifier;

              const modifierColour =
                modifier > 0
                  ? "text-green-500"
                  : modifier < 0
                  ? "text-red-500"
                  : "text-black";

              return (
                <div
                  className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-md"
                  key={skill.value}
                >
                  <p>{skill.label}</p>

                  <div className="flex gap-4 items-center">
                    <p className={clsx(modifierColour)}>
                      ({modifier > 0 ? "+" + modifier : modifier})
                    </p>
                    <Switch
                      {...register(
                        `skills.${
                          skill.value as keyof CharacterSkills
                        }.hasProficiency`
                      )}
                      onCheckedChange={(checked) => {
                        setValue(
                          `skills.${
                            skill.value as keyof CharacterSkills
                          }.hasProficiency`,
                          checked
                        );

                        if (!checked) {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.hasExpertise`,
                            false
                          );
                        }
                      }}
                      checked={watch(
                        `skills.${
                          skill.value as keyof CharacterSkills
                        }.hasProficiency`
                      )}
                    />
                    <Checkbox
                      {...register(
                        `skills.${
                          skill.value as keyof CharacterSkills
                        }.hasExpertise`
                      )}
                      checked={watch(
                        `skills.${
                          skill.value as keyof CharacterSkills
                        }.hasExpertise`
                      )}
                      onCheckedChange={(checked) => {
                        setValue(
                          `skills.${
                            skill.value as keyof CharacterSkills
                          }.hasExpertise`,
                          checked === true ? true : false
                        );
                      }}
                      disabled={
                        !watch(
                          `skills.${
                            skill.value as keyof CharacterSkills
                          }.hasProficiency`
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-600">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Initiative"
                type="number"
                {...register("stats.initiative", {
                  required: "Initiative is required",
                })}
              />
              {errors?.stats?.initiative && (
                <p className="text-red-500 text-sm">
                  {errors.stats.initiative.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Speed"
                type="number"
                {...register("stats.speed", {
                  required: "Speed is required",
                })}
              />
              {errors?.stats?.speed && (
                <p className="text-red-500 text-sm">
                  {errors.stats.speed.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Armor Class"
                type="number"
                {...register("stats.armorClass", {
                  required: "Armor Class is required",
                })}
              />
              {errors?.stats?.armorClass && (
                <p className="text-red-500 text-sm">
                  {errors.stats.armorClass.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                placeholder="Hit Points"
                type="number"
                {...register("stats.hitPointsTotal", {
                  required: "Hit Points is required",
                })}
              />
              {errors?.stats?.hitPointsTotal && (
                <p className="text-red-500 text-sm">
                  {errors.stats.hitPointsTotal.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <Select
                {...register("stats.hitDice.diceType", {
                  required: "Hit Dice Type is required",
                })}
                onValueChange={(value) => {
                  const sidesOfSelectedDice = value?.split("d")[1];
                  setValue(
                    "stats.hitDice.diceType",
                    parseInt(sidesOfSelectedDice)
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hit Dice Type" />
                </SelectTrigger>
                <SelectContent>
                  {DICE_OPTIONS.map((dice) => (
                    <SelectItem key={dice} value={dice}>
                      {dice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.stats?.hitDice?.diceType && (
                <p className="text-red-500 text-sm">
                  {errors.stats.hitDice.diceType.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full">
          Create Character
        </Button>
      </form>
    </div>
  );
};
export default CreateCharacter;
