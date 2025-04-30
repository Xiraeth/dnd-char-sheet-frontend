"use client";

import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

const SpellSlotsCard = () => {
  const { register } = useFormContext<Character>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Spell slots</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-4">
        <div>
          <Label htmlFor="level1">Level 1</Label>
          <Input
            className="text-indigo-600"
            id="level1"
            type="number"
            placeholder="Lv 1"
            {...register("spellSlots.level1")}
          />
        </div>
        <div>
          <Label htmlFor="level2">Level 2</Label>
          <Input
            className="text-indigo-600"
            id="level2"
            type="number"
            placeholder="Lv 2"
            {...register("spellSlots.level2")}
          />
        </div>
        <div>
          <Label htmlFor="level3">Level 3</Label>
          <Input
            className="text-indigo-600"
            id="level3"
            type="number"
            placeholder="Lv 3"
            {...register("spellSlots.level3")}
          />
        </div>
        <div>
          <Label htmlFor="level4">Level 4</Label>
          <Input
            className="text-indigo-600"
            id="level4"
            type="number"
            placeholder="Lv 4"
            {...register("spellSlots.level4")}
          />
        </div>
        <div>
          <Label htmlFor="level5">Level 5</Label>
          <Input
            className="text-indigo-600"
            id="level5"
            type="number"
            placeholder="Lv 5"
            {...register("spellSlots.level5")}
          />
        </div>
        <div>
          <Label htmlFor="level6">Level 6</Label>
          <Input
            className="text-indigo-600"
            id="level6"
            type="number"
            placeholder="Lv 6"
            {...register("spellSlots.level6")}
          />
        </div>
        <div>
          <Label htmlFor="level7">Level 7</Label>
          <Input
            className="text-indigo-600"
            id="level7"
            type="number"
            placeholder="Lv 7"
            {...register("spellSlots.level7")}
          />
        </div>
        <div>
          <Label htmlFor="level8">Level 8</Label>
          <Input
            className="text-indigo-600"
            id="level8"
            type="number"
            placeholder="Lv 8"
            {...register("spellSlots.level8")}
          />
        </div>
        <div>
          <Label htmlFor="level9">Level 9</Label>
          <Input
            className="text-indigo-600"
            id="level9"
            type="number"
            placeholder="Lv 9"
            {...register("spellSlots.level9")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpellSlotsCard;
