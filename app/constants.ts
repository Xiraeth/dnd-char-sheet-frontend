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

export const DICE_OPTIONS = [
  { label: "d4", value: 4 },
  { label: "d6", value: 6 },
  { label: "d8", value: 8 },
  { label: "d10", value: 10 },
  { label: "d12", value: 12 },
  { label: "d20", value: 20 },
  { label: "d100", value: 100 },
];

export const ACTION_TYPES = [
  { label: "Action", value: "action" },
  { label: "Bonus Action", value: "bonusAction" },
  { label: "Reaction", value: "reaction" },
];

export const SPELL_SCHOOLS = [
  { label: "Abjuration", value: "Abjuration" },
  { label: "Conjuration", value: "Conjuration" },
  { label: "Divination", value: "Divination" },
  { label: "Enchantment", value: "Enchantment" },
  { label: "Evocation", value: "Evocation" },
  { label: "Illusion", value: "Illusion" },
  { label: "Necromancy", value: "Necromancy" },
  { label: "Transmutation", value: "Transmutation" },
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
  "Ranger",
  "Druid",
  "Paladin",
  "Sorcerer",
  "Wizard",
  "Warlock",
  "Custom",
];

export const RACES = [
  "Custom",
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
  "Lizardfolk",
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
  { label: "Nature", value: "nature", ability: "intelligence" },
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
  { label: "None", value: "None" },
  { label: "Acid", value: "Acid" },
  { label: "Cold", value: "Cold" },
  { label: "Fire", value: "Fire" },
  { label: "Lightning", value: "Lightning" },
  { label: "Poison", value: "Poison" },
  { label: "Thunder", value: "Thunder" },
  { label: "Necrotic", value: "Necrotic" },
  { label: "Psychic", value: "Psychic" },
  { label: "Radiant", value: "Radiant" },
  { label: "Slashing", value: "Slashing" },
  { label: "Bludgeoning", value: "Bludgeoning" },
  { label: "Piercing", value: "Piercing" },
  { label: "Force", value: "Force" },
];

export const SKILLS_PER_ABILITY = {
  strength: STRENGTH_SKILLS,
  dexterity: DEXTERITY_SKILLS,
  intelligence: INTELLIGENCE_SKILLS,
  wisdom: WISDOM_SKILLS,
  charisma: CHARISMA_SKILLS,
};
