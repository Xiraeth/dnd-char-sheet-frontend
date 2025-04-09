"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RACES } from "@/app/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
export function RaceSearch() {
  const [open, setOpen] = useState(false);
  const { setValue, watch } = useFormContext();

  const value = watch("basicInfo.race");

  const racesObjectArray = RACES?.map((race) => ({
    label: race,
    value: race?.toLowerCase(),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className="bg-transparent border-black/40 hover:bg-black/5"
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx("w-full justify-between", !value && "text-gray-500")}
        >
          {value
            ? racesObjectArray.find((race) => race.value === value)?.label
            : "Select race..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search races..." className="h-9" />
          <CommandList>
            <CommandEmpty>No races found.</CommandEmpty>
            <CommandGroup>
              {racesObjectArray.map((race) => (
                <CommandItem
                  key={race.value}
                  value={race.value}
                  onSelect={(currentValue) => {
                    setValue("basicInfo.race", currentValue);
                    setOpen(false);
                  }}
                >
                  {race.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === race.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
