import { Character, Spell } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { SpellSearch } from "@/app/create-character/components/SpellSearch";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import CustomSpellForm from "@/app/create-character/components/CustomSpellForm";

const SelectedSpellBlock = ({
  spell,
  removeHandler,
}: {
  spell: Spell;
  removeHandler: () => void;
}) => {
  return (
    <div className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm">
      <p>{spell.name}</p>
      <X
        className="size-4 hover:text-red-400 transition-all duration-150 cursor-pointer"
        onClick={removeHandler}
      />
    </div>
  );
};

const SpellsCard = () => {
  const [isCreateSpellFormOpen, setIsCreateSpellFormOpen] = useState(false);
  const [limitQueryToClass, setLimitQueryToClass] = useState(true);

  const { watch, setValue } = useFormContext<Character>();

  const spells = watch("spells");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center flex gap-2 justify-center">
          Spells{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-0 mb-4">
        <div className="flex gap-2 items-center">
          <p className="italic text-sm text-black/60">
            Limit search to selected class
          </p>
          <Switch
            checked={limitQueryToClass}
            onCheckedChange={setLimitQueryToClass}
          />
        </div>
        <SpellSearch limitQueryToClass={limitQueryToClass} />
        <div className="flex flex-wrap gap-2">
          {spells?.map((spell) => (
            <SelectedSpellBlock
              key={spell.name}
              spell={spell}
              removeHandler={() => {
                setValue(
                  "spells",
                  spells.filter((s) => s.name !== spell.name)
                );
              }}
            />
          ))}
        </div>
      </CardContent>

      {isCreateSpellFormOpen && (
        <CustomSpellForm setIsCreateSpellFormOpen={setIsCreateSpellFormOpen} />
      )}

      <Button
        type="button"
        className="w-full"
        variant="outline"
        onClick={() => {
          setIsCreateSpellFormOpen(true);
        }}
      >
        Add a Spell
      </Button>
    </Card>
  );
};

export default SpellsCard;
