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

const SkillsCard = () => {
  const { register, watch, setValue } = useFormContext<Character>();

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
        {/* Strength Skills */}
        <div>
          <p className="text-xl font-bold mb-2 text-center font-mrEaves">
            Strength
          </p>
          <div className="w-full mx-auto">
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
                    ? "text-green-600"
                    : modifier < 0
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex flex-col gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card font-bookInsanity"
                    key={skill.value}
                  >
                    <div className="flex w-full justify-between">
                      <p>{skill.label}</p>
                      <div className="flex gap-4 items-center">
                        <p className={clsx(modifierColour, "font-bold")}>
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

                    <div className="font-scalySans flex gap-2 italic text-gray-700">
                      <label>Other modifier (+/-)</label>
                      <input
                        className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
                        type="number"
                        onChange={(e) => {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`,
                            Number(e.target.value)
                          );
                        }}
                        value={
                          watch(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`
                          ) || ""
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
          <p className="text-xl font-bold mb-2 text-center font-mrEaves">
            Dexterity
          </p>
          <div className="w-full mx-auto flex flex-col gap-4">
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
                    ? "text-green-600"
                    : modifier < 0
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex flex-col gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card font-bookInsanity"
                    key={skill.value}
                  >
                    <div className="flex w-full justify-between">
                      <p>{skill.label}</p>
                      <div className="flex gap-4 items-center">
                        <p className={clsx(modifierColour, "font-bold")}>
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

                    <div className="font-scalySans flex gap-2 italic text-gray-700">
                      <label>Other modifier (+/-)</label>
                      <input
                        className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
                        type="number"
                        onChange={(e) => {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`,
                            Number(e.target.value)
                          );
                        }}
                        value={
                          watch(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`
                          ) || ""
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
          <p className="text-xl font-bold mb-2 text-center font-mrEaves">
            Intelligence
          </p>
          <div className="w-full mx-auto flex flex-col gap-4">
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
                    ? "text-green-600"
                    : modifier < 0
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex flex-col gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card font-bookInsanity"
                    key={skill.value}
                  >
                    <div className="flex w-full justify-between">
                      <p>{skill.label}</p>
                      <div className="flex gap-4 items-center">
                        <p className={clsx(modifierColour, "font-bold")}>
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

                    <div className="font-scalySans flex gap-2 italic text-gray-700">
                      <label>Other modifier (+/-)</label>
                      <input
                        className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
                        type="number"
                        onChange={(e) => {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`,
                            Number(e.target.value)
                          );
                        }}
                        value={
                          watch(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`
                          ) || ""
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
          <p className="text-xl font-bold mb-2 text-center font-mrEaves">
            Wisdom
          </p>
          <div className="w-full mx-auto flex flex-col gap-4">
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
                    ? "text-green-600"
                    : modifier < 0
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex flex-col gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card font-bookInsanity"
                    key={skill.value}
                  >
                    <div className="flex w-full justify-between">
                      <p>{skill.label}</p>
                      <div className="flex gap-4 items-center">
                        <p className={clsx(modifierColour, "font-bold")}>
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

                    <div className="font-scalySans flex gap-2 italic text-gray-700">
                      <label>Other modifier (+/-)</label>
                      <input
                        className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
                        type="number"
                        onChange={(e) => {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`,
                            Number(e.target.value)
                          );
                        }}
                        value={
                          watch(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`
                          ) || ""
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
          <p className="text-xl font-bold mb-2 text-center font-mrEaves">
            Charisma
          </p>
          <div className="w-full mx-auto flex flex-col gap-4">
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
                    ? "text-green-600"
                    : modifier < 0
                    ? "text-red-600"
                    : "text-black";

                return (
                  <div
                    className="flex flex-col gap-2 items-center justify-between w-full border-[1px] border-black/20 rounded-lg px-4 py-2 shadow-card font-bookInsanity"
                    key={skill.value}
                  >
                    <div className="flex w-full justify-between">
                      <p>{skill.label}</p>
                      <div className="flex gap-4 items-center">
                        <p className={clsx(modifierColour, "font-bold")}>
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

                    <div className="font-scalySans flex gap-2 italic text-gray-700">
                      <label>Other modifier (+/-)</label>
                      <input
                        className="bg-transparent border-b border-b-black/30 focus:border-b-black outline-none w-[50px] text-center"
                        type="number"
                        onChange={(e) => {
                          setValue(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`,
                            Number(e.target.value)
                          );
                        }}
                        value={
                          watch(
                            `skills.${
                              skill.value as keyof CharacterSkills
                            }.otherModifier`
                          ) || ""
                        }
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
