export const PUBLIC_ROUTES = ["/login", "/register"];

export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

export const DICE_OPTIONS = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export const SPELL_SCHOOLS = [
  { label: "Abjuration", value: "abjuration" },
  { label: "Conjuration", value: "conjuration" },
  { label: "Divination", value: "divination" },
  { label: "Enchantment", value: "enchantment" },
  { label: "Evocation", value: "evocation" },
  { label: "Illusion", value: "illusion" },
  { label: "Necromancy", value: "necromancy" },
  { label: "Transmutation", value: "transmutation" },
];

export const ABILITIES = [
  { label: "Strength", value: "strength" },
  { label: "Dexterity", value: "dexterity" },
  { label: "Constitution", value: "constitution" },
  { label: "Intelligence", value: "intelligence" },
  { label: "Wisdom", value: "wisdom" },
  { label: "Charisma", value: "charisma" },
];

export const SPELLCASTING_ABILITIES = [
  { label: "Intelligence", value: "intelligence" },
  { label: "Wisdom", value: "wisdom" },
  { label: "Charisma", value: "charisma" },
];

export const SPELLCASTING_CLASSES_ABILITIES_MAP = [
  {
    label: "Bard",
    value: "charisma",
  },
  {
    label: "Cleric",
    value: "wisdom",
  },
  {
    label: "Druid",
    value: "wisdom",
  },
  {
    label: "Paladin",
    value: "charisma",
  },
  {
    label: "Sorcerer",
    value: "charisma",
  },
  {
    label: "Wizard",
    value: "intelligence",
  },
  {
    label: "Warlock",
    value: "charisma",
  },
];

export const CLASSES = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Custom",
];

export const SPELLCASTING_CLASSES = [
  "Bard",
  "Cleric",
  "Druid",
  "Paladin",
  "Sorcerer",
  "Wizard",
  "Warlock",
];

export const RACES = [
  "Common",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Halfling",
  "Human",
  "Tiefling",
  "Aarakocra",
  "Aasimar",
  "Changeling",
  "Deep Gnome",
  "Duergar",
  "Eladrin",
  "Fairy",
  "Firbolg",
  "Genasi (Air)",
  "Genasi (Earth)",
  "Genasi (Fire)",
  "Genasi (Water)",
  "Githyanki",
  "Githzerai",
  "Goliath",
  "Harengon",
  "Kenku",
  "Locathah",
  "Owlin",
  "Satyr",
  "Sea Elf",
  "Shadar-Kai",
  "Tabaxi",
  "Tortle",
  "Triton",
  "Verdan",
];

export const SKILLS = [
  { label: "Acrobatics", value: "acrobatics", ability: "dexterity" },
  { label: "Animal Handling", value: "animalHandling", ability: "wisdom" },
  { label: "Arcana", value: "arcana", ability: "intelligence" },
  { label: "Athletics", value: "athletics", ability: "strength" },
  { label: "Deception", value: "deception", ability: "charisma" },
  { label: "History", value: "history", ability: "intelligence" },
  { label: "Insight", value: "insight", ability: "wisdom" },
  { label: "Intimidation", value: "intimidation", ability: "charisma" },
  { label: "Investigation", value: "investigation", ability: "intelligence" },
  { label: "Medicine", value: "medicine", ability: "wisdom" },
  { label: "Nature", value: "nature", ability: "wisdom" },
  { label: "Perception", value: "perception", ability: "wisdom" },
  { label: "Performance", value: "performance", ability: "charisma" },
  { label: "Persuasion", value: "persuasion", ability: "charisma" },
  { label: "Religion", value: "religion", ability: "intelligence" },
  { label: "Sleight of Hand", value: "sleightOfHand", ability: "dexterity" },
  { label: "Stealth", value: "stealth", ability: "dexterity" },
  { label: "Survival", value: "survival", ability: "wisdom" },
];

export const STRENGTH_SKILLS = [
  { label: "Athletics", value: "athletics", ability: "strength" },
];

export const DEXTERITY_SKILLS = [
  { label: "Acrobatics", value: "acrobatics", ability: "dexterity" },
  { label: "Sleight of Hand", value: "sleightOfHand", ability: "dexterity" },
  { label: "Stealth", value: "stealth", ability: "dexterity" },
];

export const INTELLIGENCE_SKILLS = [
  { label: "Arcana", value: "arcana", ability: "intelligence" },
  { label: "History", value: "history", ability: "intelligence" },
  { label: "Investigation", value: "investigation", ability: "intelligence" },
  { label: "Nature", value: "nature", ability: "intelligence" },
  { label: "Religion", value: "religion", ability: "intelligence" },
];

export const WISDOM_SKILLS = [
  { label: "Animal Handling", value: "animalHandling", ability: "wisdom" },
  { label: "Insight", value: "insight", ability: "wisdom" },
  { label: "Medicine", value: "medicine", ability: "wisdom" },
  { label: "Perception", value: "perception", ability: "wisdom" },
  { label: "Survival", value: "survival", ability: "wisdom" },
];

export const CHARISMA_SKILLS = [
  { label: "Deception", value: "deception", ability: "charisma" },
  { label: "Intimidation", value: "intimidation", ability: "charisma" },
  { label: "Performance", value: "performance", ability: "charisma" },
  { label: "Persuasion", value: "persuasion", ability: "charisma" },
];

export const DAMAGE_TYPES = [
  { label: "None", value: "none" },
  { label: "Acid", value: "acid" },
  { label: "Cold", value: "cold" },
  { label: "Fire", value: "fire" },
  { label: "Lightning", value: "lightning" },
  { label: "Poison", value: "poison" },
  { label: "Thunder", value: "thunder" },
  { label: "Necrotic", value: "necrotic" },
  { label: "Psychic", value: "psychic" },
  { label: "Radiant", value: "radiant" },
  { label: "Slashing", value: "slashing" },
  { label: "Bludgeoning", value: "bludgeoning" },
  { label: "Piercing", value: "piercing" },
  { label: "Force", value: "force" },
];
