import { Character, Spell } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { SpellSearch } from "@/app/create-character/components/SpellSearch";
import { X } from "lucide-react";
import CustomSpellForm from "@/app/create-character/components/CustomSpellForm";
import { Checkbox } from "@/components/ui/checkbox";

const SelectedSpellBlock = ({
  spell,
  removeHandler,
  onClickHandler,
}: {
  spell: Spell;
  removeHandler: (e: React.MouseEvent<SVGElement>) => void;
  onClickHandler: () => void;
}) => {
  return (
    <div
      className="flex gap-2 bg-black/90 w-fit text-white rounded-md px-4 py-2 items-center text-sm cursor-pointer hover:bg-black/80 transition-all duration-150"
      onClick={onClickHandler}
    >
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
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const { watch, setValue } = useFormContext<Character>();

  const spells = watch("spells") || [];
  const characterClass = watch("basicInfo.class");

  // Debug log the spells information
  useEffect(() => {
    console.log("SpellsCard rendered with:", {
      spellsCount: spells?.length || 0,
      characterClass,
    });
  }, [spells, characterClass]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center flex gap-2 justify-center">
          Spells
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-0 mb-4">
        {characterClass !== "Custom" && (
          <div className="flex gap-2 items-center">
            <p className="italic text-sm text-black/60">
              Limit search to selected class
            </p>
            <Checkbox
              checked={limitQueryToClass}
              onCheckedChange={(checked) => {
                setLimitQueryToClass((prev) => {
                  return checked === "indeterminate" ? !prev : checked;
                });
              }}
            />
          </div>
        )}

        {/* search spells from dnd 5e api (2014) */}
        <SpellSearch limitQueryToClass={limitQueryToClass} />

        <div className="flex flex-wrap gap-2">
          {spells?.map((spell) => (
            <SelectedSpellBlock
              key={spell.name}
              spell={spell}
              removeHandler={(e) => {
                e.stopPropagation();
                if (spell?._id === selectedSpell?._id) {
                  setSelectedSpell(null);
                  setIsCreateSpellFormOpen(false);
                }
                setValue(
                  "spells",
                  spells.filter((s) => s.name !== spell.name)
                );
              }}
              onClickHandler={() => {
                setIsCreateSpellFormOpen(true);
                setSelectedSpell(spell);
              }}
            />
          ))}
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={() => {
            setIsCreateSpellFormOpen(true);
          }}
        >
          Add a Spell
        </Button>
      </CardContent>

      {isCreateSpellFormOpen && (
        <CustomSpellForm
          setIsCreateSpellFormOpen={setIsCreateSpellFormOpen}
          selectedSpell={selectedSpell}
          setSelectedSpell={setSelectedSpell}
        />
      )}
    </Card>
  );
};

export default SpellsCard;
