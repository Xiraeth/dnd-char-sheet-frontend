import { Character, CharacterAbilities, CharacterSkills } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DEXTERITY_SKILLS,
  STRENGTH_SKILLS,
  INTELLIGENCE_SKILLS,
  WISDOM_SKILLS,
  CHARISMA_SKILLS,
} from "@/app/constants";

const SkillsCard = () => {
  const { register, watch, setValue } = useFormContext<Character>();

  const proficiencyBonus = watch("basicInfo.level")
    ? getProficiencyBonus(watch("basicInfo.level"))
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center flex justify-center items-center gap-4 w-full">
          <p className="relative">
            Skills{" "}
            <Link
              href="#skills-extra"
              className="absolute -top-2 -right-2 text-blue-500 text-lg cursor-pointer"
            >
              *
            </Link>
          </p>
          <span className="text-sm opacity-75 font-normal italic">
            (switches for proficiency, checkboxes for expertise)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strength Skills */}
        <div>
          <p className="text-base font-semibold mb-2 text-center ">Strength</p>
          <div className="lg:w-[350px] w-full mx-auto">
            {STRENGTH_SKILLS.map(
              (skill: { label: string; value: string; ability: string }) => {
                const hasProficiency = watch(
                  `skills.${
                    skill.value as keyof CharacterSkills
                  }.hasProficiency`
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
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card"
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
              }
            )}
          </div>
        </div>

        {/* Dexterity Skills */}
        <div>
          <p className="text-base font-semibold mb-2 text-center">Dexterity</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
            {DEXTERITY_SKILLS.map(
              (skill: { label: string; value: string; ability: string }) => {
                const hasProficiency = watch(
                  `skills.${
                    skill.value as keyof CharacterSkills
                  }.hasProficiency`
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
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card"
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
              }
            )}
          </div>
        </div>

        {/* Intelligence Skills */}
        <div>
          <p className="text-base font-semibold mb-2 text-center">
            Intelligence
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
            {INTELLIGENCE_SKILLS.map(
              (skill: { label: string; value: string; ability: string }) => {
                const hasProficiency = watch(
                  `skills.${
                    skill.value as keyof CharacterSkills
                  }.hasProficiency`
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
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card"
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
              }
            )}
          </div>
        </div>

        {/* Wisdom Skills */}
        <div>
          <p className="text-base font-semibold mb-2 text-center">Wisdom</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
            {WISDOM_SKILLS.map(
              (skill: { label: string; value: string; ability: string }) => {
                const hasProficiency = watch(
                  `skills.${
                    skill.value as keyof CharacterSkills
                  }.hasProficiency`
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
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card"
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
              }
            )}
          </div>
        </div>

        {/* Charisma Skills */}
        <div>
          <p className="text-base font-semibold mb-2 text-center">Charisma</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
            {CHARISMA_SKILLS.map(
              (skill: { label: string; value: string; ability: string }) => {
                const hasProficiency = watch(
                  `skills.${
                    skill.value as keyof CharacterSkills
                  }.hasProficiency`
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
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card"
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
              }
            )}
          </div>
        </div>

        <div
          id="skills-extra"
          className="mt-4 text-center opacity-75 italic text-sm relative"
        >
          <span className="text-blue-500 text-xl mr-2">*</span>
          In case you want to add extra modifiers to your character&apos;s
          skills or saving throws, like a paladin&apos;s Aura of Protection, you
          can do so after completing the creation.
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
