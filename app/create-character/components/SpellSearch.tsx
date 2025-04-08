"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormContext, useFieldArray } from "react-hook-form";
import { GET_SPELLS } from "@/lib/apollo/operations/queries";
import { useQuery } from "@apollo/client";
import { Character, Spell } from "@/app/types";
import SearchLoading from "./SearchLoading";
type SpellObject = {
  label: string;
  value: Spell;
};

export function SpellSearch({
  limitQueryToClass,
}: {
  limitQueryToClass: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { watch, control } = useFormContext<Character>();

  const {
    fields: spells,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "spells",
  });

  const characterClass = watch("basicInfo.class")?.toLowerCase();

  const { data, loading } = useQuery(GET_SPELLS, {
    variables: {
      class: limitQueryToClass
        ? characterClass === "custom"
          ? undefined
          : characterClass
        : undefined,
    },
  });

  const filteredSpellsObjectArray: SpellObject[] = data?.spells?.map(
    (spell: Spell) => ({
      label: spell?.name,
      value: {
        name: spell?.name,
        damage: spell?.damage,
        casting_time: spell?.casting_time,
        range: spell?.range,
        duration: spell?.duration,
        desc: spell?.desc,
        higher_level: spell?.higher_level,
        school: spell?.school,
        level: spell?.level,
        components: spell?.components,
      },
    })
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-gray-500"
        >
          Search for a spell
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search spells..." className="h-9" />
          <CommandList>
            {!loading && filteredSpellsObjectArray?.length === 0 ? (
              <CommandEmpty className="py-2 px-2 text-center text-sm">
                No spells found
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {loading ? (
                  <SearchLoading />
                ) : (
                  filteredSpellsObjectArray?.map((spell) => (
                    <CommandItem
                      className="cursor-pointer"
                      key={spell.label}
                      value={spell.value.name}
                      onSelect={() => {
                        const doesSpellExist = spells?.some(
                          (sp) => sp.name === spell.value.name
                        );

                        if (doesSpellExist) {
                          const indexToRemove = spells.findIndex(
                            (sp) => sp.name === spell.value.name
                          );
                          if (indexToRemove !== -1) {
                            remove(indexToRemove);
                          }
                        } else {
                          append(spell.value);
                        }

                        setOpen(false);
                      }}
                    >
                      {spell.label}
                      {spells?.some((sp) => sp.name === spell.value.name) && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
