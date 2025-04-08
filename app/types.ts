export interface User {
  id: string;
  username: string;
  password: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface Attack {
  name: string;
  atkBonus: number;
  damage: string;
  type: string;
  range: string;
  reach: string;
  description?: string;
}

export interface Spell {
  source?: string;
  name: string;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  desc: string;
  higher_level: string[];
  damage?: {
    damage_type: {
      name: string;
    };
    damage_at_slot_level?: {
      damage: string;
      level: number;
    }[];
  };
}

export interface Feat {
  name: string;
  description: string;
}

export interface CharacterBasicInfo {
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  playerName: string;
}

export interface CharacterAbilities {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterStats {
  initiative: number;
  speed: number;
  armorClass: number;
  hitPointsCurrent: number;
  hitPointsTotal: number;
  hitPointsTemp?: number;
  hitDice: {
    remaining: number;
    diceType: number;
    total: number;
  };
}

export interface SavingThrow {
  value: number;
  hasProficiency: boolean;
}

export interface CharacterSavingThrows {
  strength: SavingThrow;
  dexterity: SavingThrow;
  constitution: SavingThrow;
  intelligence: SavingThrow;
  wisdom: SavingThrow;
  charisma: SavingThrow;
}

export interface Skill {
  value: number;
  ability: keyof CharacterAbilities;
  hasProficiency: boolean;
  hasExpertise: boolean;
}

export interface CharacterSkills {
  acrobatics: Skill;
  animalHandling: Skill;
  arcana: Skill;
  athletics: Skill;
  deception: Skill;
  history: Skill;
  insight: Skill;
  intimidation: Skill;
  investigation: Skill;
  medicine: Skill;
  nature: Skill;
  perception: Skill;
  performance: Skill;
  persuasion: Skill;
  religion: Skill;
  sleightOfHand: Skill;
  stealth: Skill;
  survival: Skill;
}

export interface DeathSaves {
  success?: number;
  failure?: number;
}

export interface Item {
  name: string;
  description: string;
}

export interface Inventory {
  gold?: number;
  items?: Item[];
  weight?: number;
}

export interface Appearance {
  age?: number;
  height?: number;
  weight?: number;
  eyes?: string;
  hair?: string;
  skin?: string;
  photo?: string;
}

export interface Spellcasting {
  spellcastingClass?: string;
  spellcastingAbility?: keyof CharacterAbilities;
  spellSaveDC?: number;
  spellAttackBonus?: number;
}

export interface SpellSlots {
  level1?: number;
  level2?: number;
  level3?: number;
  level4?: number;
  level5?: number;
  level6?: number;
  level7?: number;
  level8?: number;
  level9?: number;
}

export interface Character {
  _id?: string;
  basicInfo: CharacterBasicInfo;
  abilities: CharacterAbilities;
  stats: CharacterStats;
  savingThrows: CharacterSavingThrows;
  skills: CharacterSkills;
  deathSaves?: DeathSaves;
  inventory?: Inventory;
  appearance?: Appearance;
  spellcasting?: Spellcasting;
  spellSlots?: SpellSlots;
  spellSlotsExpanded?: SpellSlots;
  passiveWisdom?: number;
  featuresAndTraits?: string[];
  attacks?: Attack[];
  feats?: Feat[];
  spells?: Spell[];
  personalityTraits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];
  otherProficienciesAndLanguages?: string[];
  inspiration?: number;
  characterBackstory?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  proficiencyBonus?: number;
}
