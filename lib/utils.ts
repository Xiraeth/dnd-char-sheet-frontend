import { RechargeDiceType } from "@/app/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getModifier(value: number) {
  return Math.floor((value - 10) / 2);
}

export function getProficiencyBonus(level: number) {
  if (level >=1 && level <= 4) {
    return 2;
  }
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

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)?.toLowerCase();
};

export const calculatePassiveWisdom = ({
  perceptionModifier,
  proficiencyBonus,
  isExpertInPerception,
  isProficientInPerception,
}: {
  perceptionModifier: number;
  proficiencyBonus: number;
  isExpertInPerception: boolean;
  isProficientInPerception: boolean;
}) => {
  return isExpertInPerception
    ? perceptionModifier + 10 + proficiencyBonus * 2
    : isProficientInPerception
    ? perceptionModifier + 10 + proficiencyBonus
    : perceptionModifier + 10;
};

export const getRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const rollDice = (numberOfDice: number, diceType: DiceType) => {
  const diceTypeNumber = parseInt(diceType.split("d")[1]);

  let total = 0;
  for (let i = 1; i <= numberOfDice; i++) {
    total += getRandomNumberBetween(1, diceTypeNumber);
  }
  return total;
};

export const validateRechargeDice = (rechargeDice: RechargeDiceType | undefined): Record<string, string> => {
  if (!rechargeDice) {
    return {};
  }

  const newErrors: Record<string, string> = {};

  if (!rechargeDice.typeOfDice || typeof rechargeDice.typeOfDice !== 'number') {
    newErrors.typeOfDice = "Dice type is required";
  }
  if (!rechargeDice.amountOfDice || typeof rechargeDice.amountOfDice !== 'number') {
    newErrors.amountOfDice = "Amount of dice is required";
  }
  if (rechargeDice.modifier && typeof rechargeDice.modifier !== 'number') {
    newErrors.modifier = "If modifier is set, it must be a number";
  }

  return newErrors;
};
