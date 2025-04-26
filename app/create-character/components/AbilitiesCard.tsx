import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ABILITIES, SKILLS } from "@/app/constants";
import { Character, CharacterAbilities, CharacterSkills } from "@/app/types";
import { useFormContext } from "react-hook-form";
import {
  getModifier,
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
} from "@/lib/utils";
import clsx from "clsx";
import { Label } from "@/components/ui/label";

const AbilitiesCard = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Abilities</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        {ABILITIES.map((ability) => {
          const modifier = getModifier(
            Number(
              watch(`abilities.${ability.value as keyof CharacterAbilities}`)
            ) || 10
          );

          const modifierColour =
            modifier > 0
              ? "text-green-600"
              : modifier < 0
              ? "text-red-600"
              : "text-black";

          return (
            <div key={ability.value} className="flex flex-col gap-2">
              <div className="flex-col items-center gap-4 w-full">
                <Label
                  className="text-black"
                  htmlFor={`abilities.${
                    ability.value as keyof CharacterAbilities
                  }`}
                >
                  {ability.label}
                </Label>
                <div className="flex items-center gap-4 w-full">
                  <Input
                    className="w-11/12"
                    placeholder={ability.label}
                    type="number"
                    id={`abilities.${
                      ability.value as keyof CharacterAbilities
                    }`}
                    {...register(
                      `abilities.${ability.value as keyof CharacterAbilities}`,
                      {
                        required: `${ability.label} is required`,
                        onChange: (e) => {
                          const abilityValue =
                            ability.value as keyof CharacterAbilities;

                          // Update saving throw value
                          setValue(
                            `savingThrows.${abilityValue}.value` as `savingThrows.${keyof CharacterAbilities}.value`,
                            getModifier(parseInt(e.target.value))
                          );

                          // Update spellcasting ability
                          const spellcastingAbility = watch(
                            "spellcasting.spellcastingAbility"
                          );
                          const charLevel = watch("basicInfo.level");

                          if (spellcastingAbility === abilityValue) {
                            setValue(
                              "spellcasting.spellSaveDC",
                              calculateSpellSaveDC({
                                level: charLevel,
                                ability: parseInt(e.target.value),
                              })
                            );
                            setValue(
                              "spellcasting.spellAttackBonus",
                              calculateSpellAttackBonus({
                                level: charLevel,
                                ability: parseInt(e.target.value),
                              })
                            );
                          }

                          // Update skill values
                          SKILLS.forEach((skill) => {
                            if (skill.ability === ability.value) {
                              const skillKey =
                                skill.value as keyof CharacterSkills;
                              setValue(
                                `skills.${skillKey}.value` as `skills.${keyof CharacterSkills}.value`,
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
                      "w-1/12 text-start font-bold",
                      modifierColour
                    )}
                  >
                    ({modifier > 0 ? "+" + modifier : modifier})
                  </p>
                </div>
              </div>

              {errors?.abilities?.[
                ability.value as keyof CharacterAbilities
              ] && (
                <p className="text-red-600 text-sm">
                  {
                    errors.abilities[ability.value as keyof CharacterAbilities]
                      ?.message
                  }
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AbilitiesCard;
