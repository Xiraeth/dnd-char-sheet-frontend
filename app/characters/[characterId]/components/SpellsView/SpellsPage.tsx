import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Spell } from "@/app/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const SpellView = () => {
  const { character, setCharacter } = useCharacter();
  const [isUpdating, setIsUpdating] = useState(false);

  const spells = character?.spells;
  const spellSlots = character?.spellSlots;

  const spellsSortedByLevel = spells?.sort((a, b) => {
    return parseInt(a.level) - parseInt(b.level);
  });

  const spellsByLevel = spellsSortedByLevel?.reduce((acc, spell) => {
    const level = spell.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(spell);
    return acc;
  }, {} as Record<string, Spell[]>);

  const spellsByLevelArray = Object.entries(spellsByLevel || {});

  const expendSpellSlot = async (level: number, spellSlotsCurrent: number) => {
    if (isUpdating) return;

    if (spellSlotsCurrent <= 0) {
      toast.error("No spell slots left");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/expendSpellSlot`,
        { spellSlotLevel: level },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Spell slot expended successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to expend spell slot"
        );
      } else {
        toast.error("Failed to expend spell slot");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const restoreSpellSlot = async (
    level: number,
    spellSlotsCurrent: number,
    spellSlotsTotal: number
  ) => {
    if (isUpdating) return;

    if (spellSlotsCurrent >= spellSlotsTotal) {
      toast.error("No spell slots left");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/${character?._id}/gainSpellSlot`,
        { spellSlotLevel: level },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Spell slot restored successfully");
        setCharacter(response.data.character);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to restore spell slot"
        );
      } else {
        toast.error("Failed to restore spell slot");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    spellsByLevelArray &&
    spellsByLevelArray?.map((level) => {
      const levelNumber = parseInt(level[0]);
      const spells = level[1];

      const spellSlotsTotal =
        spellSlots?.[`level${levelNumber}` as keyof typeof spellSlots]?.total;
      const spellSlotsCurrent =
        spellSlots?.[`level${levelNumber}` as keyof typeof spellSlots]?.current;

      return (
        <div key={levelNumber} className="mb-10">
          <p className="font-mrEaves text-2xl sm:text-3xl font-bold text-center">{`${
            levelNumber === 0 ? "Cantrips" : `Level ${levelNumber}`
          }`}</p>
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col font-scalySans">
              {levelNumber !== 0 && (
                <div className="flex gap-2">
                  <p>Spell slots: </p>
                  {spellSlotsCurrent}/{spellSlotsTotal}
                </div>
              )}
            </div>
            {levelNumber !== 0 && (
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-red-600 text-black hover:bg-red-600/75 transition-all duration-150 drop-shadow-md h-[26px]"
                  disabled={(spellSlotsCurrent || 0) <= 0}
                  onClick={() => {
                    expendSpellSlot(levelNumber, spellSlotsCurrent || 0);
                  }}
                >
                  Use spell slot
                </Button>
                <Button
                  className="bg-green-600 text-black hover:bg-green-600/75 transition-all duration-150 drop-shadow-md h-[26px]"
                  disabled={(spellSlotsCurrent || 0) >= (spellSlotsTotal || 0)}
                  size="sm"
                  onClick={() => {
                    restoreSpellSlot(
                      levelNumber,
                      spellSlotsCurrent || 0,
                      spellSlotsTotal || 0
                    );
                  }}
                >
                  Restore spell slot
                </Button>
              </div>
            )}
          </div>

          <Accordion type="multiple" className="w-full">
            {spells &&
              spells?.map((spell) => {
                return (
                  <AccordionItem
                    value={spell?._id || ""}
                    key={spell?._id}
                    className="border-b-black"
                  >
                    <AccordionTrigger className="text-dndRed text-2xl font-mrEaves pb-1 underline hover:text-red-700 transition-all duration-150">
                      {spell?.name}
                    </AccordionTrigger>
                    <AccordionContent className="font-bookInsanity pb-2 flex flex-col gap-1 text-base sm:text-md">
                      <p className="italic text-sm sm:text-md my-2">
                        School of {spell?.school?.name}
                      </p>
                      <div>
                        <span className="font-bold">Casting Time: </span>
                        {spell?.casting_time}
                      </div>

                      <div>
                        <span className="font-bold">Range: </span>
                        {spell?.range}
                      </div>

                      <div>
                        <span className="font-bold">Components: </span>
                        {spell?.components?.join(", ")}
                      </div>

                      <div>
                        <span className="font-bold">Duration: </span>
                        {spell?.duration}
                      </div>

                      <p>{spell?.desc}</p>
                      {spell?.higher_level && (
                        <div className="mt-2">
                          <span className="font-bold text-dndRed w-fit text-nowrap">
                            At higher levels:{" "}
                          </span>
                          <p>{spell?.higher_level}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
      );
    })
  );
};

export default SpellView;
