"use client";

import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const SpellSlotsCard = () => {
  const { register } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Spell slots</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-4 text-indigo-600">
        <Input
          type="number"
          placeholder="Lv 1"
          {...register("spellSlots.level1")}
        />
        <Input
          type="number"
          placeholder="Lv 2"
          {...register("spellSlots.level2")}
        />
        <Input
          type="number"
          placeholder="Lv 3"
          {...register("spellSlots.level3")}
        />
        <Input
          type="number"
          placeholder="Lv 4"
          {...register("spellSlots.level4")}
        />
        <Input
          type="number"
          placeholder="Lv 5"
          {...register("spellSlots.level5")}
        />
        <Input
          type="number"
          placeholder="Lv 6"
          {...register("spellSlots.level6")}
        />
        <Input
          type="number"
          placeholder="Lv 7"
          {...register("spellSlots.level7")}
        />
        <Input
          type="number"
          placeholder="Lv 8"
          {...register("spellSlots.level8")}
        />
        <Input
          type="number"
          placeholder="Lv 9"
          {...register("spellSlots.level9")}
        />
      </CardContent>
    </Card>
  );
};

export default SpellSlotsCard;
