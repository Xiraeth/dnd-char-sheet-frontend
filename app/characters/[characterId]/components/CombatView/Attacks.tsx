import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Attack, CharacterAbilities } from "@/app/types";
import { Card } from "@/components/ui/card";
import { getProficiencyBonus } from "@/lib/utils";
import Image from "next/image";
import { getModifier } from "@/lib/utils";
import { useState } from "react";

const Attacks = () => {
  const { character } = useCharacter();

  const [attackResults, setAttackResults] = useState<
    Record<string, number | null>
  >({});

  const [damageResults, setDamageResults] = useState<
    Record<string, number | null>
  >({});

  const proficiencyBonus = getProficiencyBonus(
    character?.basicInfo?.level || 0
  );

  const attackRoll = (modifier: number) => {
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const result = d20Roll + modifier;
    const isCriticalHit = d20Roll === 20;
    const isCriticalFail = d20Roll === 1;

    return { result, isCriticalHit, isCriticalFail };
  };

  const damageRoll = ({
    numberOfDice,
    diceType,
    modifier,
  }: {
    numberOfDice: number;
    diceType: number;
    modifier: number;
  }) => {
    let total = 0;

    for (let i = 1; i <= numberOfDice; i++) {
      total += Math.floor(Math.random() * diceType) + 1;
    }

    return total + modifier;
  };

  return (
    <div className="space-y-4">
      <p className="text-dndRed font-bold font-mrEaves text-center text-3xl sm:text-4xl">
        Attacks
      </p>
      <div className="flex flex-col gap-2 text-base">
        <div className="flex gap-2 items-center">
          <div className="w-[30px] h-[30px] bg-red-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all duration-150 active:bg-white/60">
            <Image width={23} height={23} src="/d20.png" alt="d20" />
          </div>
          <span className="italic">Attack Roll</span>
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-[30px] h-[30px] bg-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/80 transition-all duration-150 active:bg-white/60">
            <Image width={23} height={30} src="/d20.png" alt="d20" />
          </div>
          <span className="italic">Damage Roll</span>
        </div>
      </div>

      {character?.attacks?.map((attack: Attack) => {
        const hasAttackRoll = !!attack?.attackRoll?.modifier;
        const isProficient = attack?.isProficient;

        const attackRollModifier = isProficient
          ? (attack?.attackRoll?.modifier || 0) + proficiencyBonus
          : attack?.attackRoll?.modifier || 0;

        const abilityUsedInAttack = hasAttackRoll
          ? attack?.damageRoll?.abilityUsed
          : attack?.abilitySave;

        const ability =
          character?.abilities?.[
            abilityUsedInAttack as keyof CharacterAbilities
          ];

        const modifier = getModifier(ability);

        const damageRollBonus = hasAttackRoll
          ? modifier + (attack?.otherDamageModifier || 0)
          : 0;

        const displayedDamageRoll = `${attack?.damageRoll?.numberOfDice}d${
          attack?.damageRoll?.diceType
        } ${damageRollBonus ? `+ ${damageRollBonus}` : ""}`;

        const finalAttackRoll =
          attackRollModifier + (attack?.otherAttackRollModifier || 0);

        const displayedAttackRoll = hasAttackRoll
          ? `1d20 + ${finalAttackRoll}`
          : "1d20";

        return (
          <Card key={attack?._id} className="px-2 py-4">
            <div className="flex gap-2 items-center w-full justify-between ">
              <p className="font-bold font-mrEaves text-xl sm:text-2xl">
                {attack.name}
              </p>

              <div className="flex gap-2">
                <div
                  className="w-[35px] h-[35px] bg-red-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-all duration-150 active:bg-red-600"
                  onClick={() => {
                    // TODO: handle the cases for critical hit and critical fail
                    const {
                      result: attackRollResult,
                      // isCriticalHit,
                      // isCriticalFail,
                    } = attackRoll(finalAttackRoll);

                    setAttackResults((prev) => ({
                      ...prev,
                      [attack?._id || ""]: attackRollResult,
                    }));
                  }}
                >
                  <Image width={30} height={30} src="/d20.png" alt="d20" />
                </div>

                <div
                  className="w-[35px] h-[35px] bg-indigo-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-all duration-150 active:bg-indigo-600"
                  onClick={() => {
                    const damageRollResult = damageRoll({
                      numberOfDice: attack?.damageRoll?.numberOfDice,
                      diceType: attack?.damageRoll?.diceType,
                      modifier: damageRollBonus,
                    });
                    setDamageResults((prev) => ({
                      ...prev,
                      [attack?._id || ""]: damageRollResult,
                    }));
                  }}
                >
                  <Image width={30} height={30} src="/d20.png" alt="d20" />
                </div>
              </div>
            </div>

            {hasAttackRoll ? (
              <div>
                <span className="font-bold">Attack roll:</span>{" "}
                {displayedAttackRoll}{" "}
                {attackResults[attack?._id || ""] && (
                  <span className="font-bold">
                    = {attackResults[attack?._id || ""]}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="font-bold">Spell save DC:</span>{" "}
                {character?.spellcasting?.spellSaveDC}{" "}
                <span className="italic">({attack?.abilitySave})</span>
              </div>
            )}

            <div>
              <span className="font-bold">Damage:</span>{" "}
              <span>{displayedDamageRoll}</span>{" "}
              {damageResults[attack?._id || ""] && (
                <span className="font-bold">
                  = {damageResults[attack?._id || ""]}
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Attacks;
