import { Item } from "@/app/types";

import { Character } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const InventoryCard = () => {
  const { register, control } = useFormContext<Character>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory.items",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-indigo-600">
        {/* gold */}
        <Input
          className="flex flex-col gap-2"
          placeholder="Gold"
          {...register("inventory.gold")}
        />

        {/* weight */}
        <Input
          className="flex flex-col gap-2"
          placeholder="Weight"
          {...register("inventory.weight")}
        />

        {/* items */}
        <div className="flex flex-col gap-2 md:col-span-2 w-full">
          {fields.map((item, index) => {
            return (
              <div key={item.id} className="flex gap-2 items-center">
                <Input
                  placeholder="Name"
                  {...register(`inventory.items.${index}.name`)}
                />

                <Input
                  placeholder="Description"
                  {...register(`inventory.items.${index}.description`)}
                />

                <Trash
                  className="min-w-[20px] max-w-[20px] w-[20px] cursor-pointer text-red-600"
                  onClick={() => remove(index)}
                />
              </div>
            );
          })}

          <Button
            type="button"
            className="w-full"
            onClick={() => append({ name: "", description: "" } as Item)}
          >
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
