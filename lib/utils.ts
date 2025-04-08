import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModifier(value: number) {
  return Math.floor((value - 10) / 2);
}

export function getProficiencyBonus(level: number) {
  return Math.floor(level / 4) + 2;
}

export const calculateSpellSaveDC = ({
  level,
  ability,
}: {
  level: number;
  ability: number;
}) => {
  return 8 + getModifier(ability) + getProficiencyBonus(level);
};

export const calculateSpellAttackBonus = ({
  level,
  ability,
}: {
  level: number;
  ability: number;
}) => {
  return getModifier(ability) + getProficiencyBonus(level);
};
