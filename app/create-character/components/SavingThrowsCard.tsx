import {
  Character,
  CharacterAbilities,
  CharacterSavingThrows,
} from "@/app/types";
import { ABILITIES } from "@/app/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModifier, getProficiencyBonus } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";

const SavingThrowsCard = () => {
  const { register, watch, setValue } = useFormContext<Character>();

  const proficiencyBonus = watch("basicInfo.level")
    ? getProficiencyBonus(watch("basicInfo.level"))
    : 0;

  return (
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
              watch(`abilities.${ability.value as keyof CharacterAbilities}`)
            ) || 10
          );

          const modifier = isProficient
            ? modifierValue + (proficiencyBonus || 0)
            : modifierValue;

          const modifierColour =
            modifier > 0
              ? "text-green-600"
              : modifier < 0
              ? "text-red-600"
              : "text-black";

          return (
            <div
              className="flex gap-2 justify-between w-full border-[1px] border-black/15 rounded-lg px-4 py-2 
              shadow-card"
              key={ability.value}
            >
              <p>{ability.label}</p>

              <div className="flex gap-4 items-center">
                <p className={clsx(modifierColour, "font-bold")}>
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
  );
};

export default SavingThrowsCard;
