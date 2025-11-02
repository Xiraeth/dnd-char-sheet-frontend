export interface User {
  id: string;
  username: string;
  password: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface DeleteCharacterResponseType {
  status: number;
  message: string;
  character?: Character;
  error?: string;
}

export interface UpdateCharacterResponseType {
  status: number;
  message: string;
  error?: string;
  character?: Character;
}

export interface ShortRestResponseType {
  status: number;
  message: string;
  error?: string;
  character?: Character;
}

export interface CharacterContextType {
  character?: Character | null;
  setCharacter: (character: Character) => void;
  deleteCharacter: (
    characterId: string
  ) => Promise<DeleteCharacterResponseType>;
  updateCharacter: (
    characterId: string,
    character: Character
  ) => Promise<UpdateCharacterResponseType>;
  characterError?: string | null;
  isLoading?: boolean;
  shortRest: (
    characterId: string,
    hitDiceExpended?: number
  ) => Promise<ShortRestResponseType>;
}

export interface Feat {
  _id?: string;
  name: string;
  description: string;
  level: string;
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
    remaining?: number;
    diceType: number;
    total?: number;
  };
}

export interface SavingThrow {
  value: number;
  hasProficiency: boolean;
  otherModifier?: number | string;
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
  otherModifier?: number | string;
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
  age?: string;
  height?: string;
  weight?: string;
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
  level1?: {
    current: number;
    total: number;
  };
  level2?: {
    current: number;
    total: number;
  };
  level3?: {
    current: number;
    total: number;
  };
  level4?: {
    current: number;
    total: number;
  };
  level5?: {
    current: number;
    total: number;
  };
  level6?: {
    current: number;
    total: number;
  };
  level7?: {
    current: number;
    total: number;
  };
  level8?: {
    current: number;
    total: number;
  };
  level9?: {
    current: number;
    total: number;
  };
}

export interface Feature {
  _id?: string;
  name: string;
  description: string;
  source?: string;
  isExpendable?: boolean;
  usesLeft?: number;
  usesTotal?: number;
  rechargeOn?: string;
  areUsesTotalEqualToProfBonus?: boolean;
  actionType?: string;
}

export interface Attack {
  _id?: string;
  name: string;
  actionType?: string;
  attackRoll?: {
    modifier?: number;
    addModifier?: boolean;
  };
  damageRoll: {
    numberOfDice: number;
    diceType: number;
    abilityUsed?: keyof CharacterAbilities;
  };
  damageType: string;
  range: string;
  description?: string;
  abilitySave?: string;
  areaOfEffect?: string;
  otherAttackRollModifier?: number;
  otherDamageModifier?: number;
  isProficient?: boolean;
}

export interface Spell {
  _id?: string;
  source?: string;
  name: string;
  level: string;
  school: {
    name: string;
    desc?: string;
  };
  casting_time: string;
  actionType?: string;
  range: string;
  components: string[];
  duration: string;
  desc: string;
  higher_level: string[];
  healing_at_slot_level?: {
    healing: string;
    level: string;
  }[];
  damage?: {
    damage_type: {
      name: string;
    };
    damage_at_character_level?: {
      value: string;
      level: number;
    }[];
  };
}

export interface Character {
  _id?: string;
  proficiencyBonus?: number;
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
  passiveWisdom?: number;
  featuresAndTraits?: Feature[];
  attacks?: Attack[];
  feats?: Feat[];
  spells?: Spell[];
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  otherProficiencies?: string;
  languages?: string;
  inspiration?: number;
  characterBackstory?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
