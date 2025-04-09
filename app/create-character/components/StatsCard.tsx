import { SelectItem } from "@/components/ui/select";

import { SelectContent } from "@/components/ui/select";

import { SelectValue } from "@/components/ui/select";

import { SelectTrigger } from "@/components/ui/select";

import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DICE_OPTIONS } from "@/app/constants";

const StatsCard = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Initiative"
            type="number"
            {...register("stats.initiative", {
              required: "Initiative is required",
            })}
          />
          {errors?.stats?.initiative && (
            <p className="text-red-600 text-sm">
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
            <p className="text-red-600 text-sm">{errors.stats.speed.message}</p>
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
            <p className="text-red-600 text-sm">
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
            <p className="text-red-600 text-sm">
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
              setValue("stats.hitDice.diceType", parseInt(sidesOfSelectedDice));
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
            <p className="text-red-600 text-sm">
              {errors.stats.hitDice.diceType.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
