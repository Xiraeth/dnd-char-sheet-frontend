import { useCharacter } from "@/app/characters/[characterId]/components/CharacterProvider";
import { Character } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useState } from "react";

type Mode = "damage" | "heal";

const Hitpoints = () => {
  const { character, updateCharacter } = useCharacter();
  const [errors, setErrors] = useState<{ damage?: string; heal?: string }>({});
  const [damage, setDamage] = useState<string>("");
  const [heal, setHeal] = useState<string>("");
  const [mode, setMode] = useState<Mode>("damage");

  const toggleMode = () => {
    setMode(mode === "damage" ? "heal" : "damage");
    setDamage("");
    setHeal("");
  };

  const calculateHitpoints = ({
    value,
    currentHp,
    maxHp,
    tempHp = 0,
  }: {
    value: number;
    currentHp: number;
    maxHp: number;
    tempHp?: number;
  }): {
    newTempHp: number;
    newCurrentHp: number;
    death?: boolean;
  } => {
    if (value < 0) {
      setErrors({ damage: "Value cannot be negative" });
    }
    let newTempHp: number = tempHp || 0;
    let newCurrentHp: number = currentHp;
    let death: boolean = false;

    let returnValue: {
      newTempHp: number;
      newCurrentHp: number;
      death?: boolean;
    } = {
      newTempHp,
      newCurrentHp,
      death: false,
    };

    const effectiveHp = currentHp + tempHp;

    if (mode === "damage") {
      const damageDealt = value;

      // -------- with temporary hitpoints --------
      if (tempHp) {
        // if the character has temporary hitpoints and the damage is not enough to break them
        if (tempHp > damageDealt) {
          newTempHp = tempHp - damageDealt;
        }

        // if the character has temporary hitpoints and the damage is enough to break them
        if (tempHp && tempHp <= damageDealt) {
          newTempHp = 0;
          newCurrentHp = effectiveHp - damageDealt;

          // if the character has temporary hitpoints and take damage that would kill them
          if (damageDealt >= maxHp + effectiveHp) {
            newCurrentHp = -maxHp;
            death = true;
          }
        }
        returnValue = { newTempHp, newCurrentHp, death };
      }

      // -------- without temporary hitpoints --------
      if (!tempHp) {
        newCurrentHp = currentHp - damageDealt;

        if (currentHp <= damageDealt) {
          newCurrentHp = currentHp - damageDealt;

          if (damageDealt >= currentHp + maxHp) {
            newCurrentHp = -maxHp;
            death = true;
          }
        }

        returnValue = { newTempHp, newCurrentHp, death };
      }

      setDamage("");
    }

    if (mode === "heal") {
      const healAmount = value;

      if (healAmount + currentHp > maxHp) {
        newCurrentHp = maxHp;
      }

      if (healAmount + currentHp <= maxHp) {
        newCurrentHp = currentHp + healAmount;
      }

      setHeal("");

      returnValue = { newTempHp, newCurrentHp };
    }

    updateCharacter(character?._id || "", {
      ...character,
      stats: {
        ...character?.stats,
        hitPointsCurrent: returnValue.newCurrentHp,
        hitPointsTemp: returnValue.newTempHp,
      },
    } as Character);

    return returnValue;
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-dndRed font-bold font-scalySans text-center text-2xl sm:text-3xl">
        Hitpoints
      </p>

      <p className="text-center text-lg sm:text-xl text-dndRed">
        <span className="font-bold">Temporary hitpoints: </span>
        {character?.stats?.hitPointsTemp || 0}
      </p>

      <div className="flex flex-row gap-2 justify-around">
        <p className="text-lg sm:text-xl text-dndRed">
          <span className="font-bold">Total hitpoints: </span>
          {character?.stats?.hitPointsTotal}
        </p>
        <p className="text-lg sm:text-lg text-dndRed">
          <span className="font-bold">Current hitpoints: </span>
          {character?.stats?.hitPointsCurrent}
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 text-black font-scalySans">
        <p>Damage</p>
        <Switch checked={mode === "heal"} onCheckedChange={toggleMode} />
        <p>Heal</p>
      </div>

      <div className="flex justify-center items-end gap-10">
        {mode === "damage" ? (
          <div className="flex flex-col gap-2">
            <p className="text-center font-bold font-mrEaves">Take Damage</p>
            <Input
              type="text"
              value={damage}
              onChange={(e) => {
                if (
                  e.target.value?.includes("+") ||
                  e.target.value?.includes("-")
                ) {
                  return;
                }

                if (isNaN(Number(e.target.value))) {
                  return;
                } else {
                  setErrors({ damage: undefined });
                  setDamage(e.target.value);
                }
              }}
              className="p-1 w-[100px] sm:w-[150px] mx-auto text-center bg-red-700 text-white border border-black"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-center">Heal</p>
            <Input
              type="text"
              value={heal}
              onChange={(e) => {
                if (
                  e.target.value?.includes("+") ||
                  e.target.value?.includes("-")
                ) {
                  return;
                }

                if (isNaN(Number(e.target.value))) {
                  return;
                } else {
                  setErrors({ heal: undefined });
                  setHeal(e.target.value);
                }
              }}
              className="p-1 w-[100px] sm:w-[150px] mx-auto text-center bg-green-600 text-white border border-black"
            />
            {errors.heal && (
              <p className="text-red-700 text-center">{errors.heal}</p>
            )}
          </div>
        )}

        <Button
          className="mt-2"
          onClick={() =>
            calculateHitpoints({
              value: mode === "damage" ? +damage : +heal,
              currentHp: character?.stats?.hitPointsCurrent || 0,
              maxHp: character?.stats?.hitPointsTotal || 0,
              tempHp: character?.stats?.hitPointsTemp || 0,
            })
          }
        >
          <Check />
        </Button>
      </div>
      {errors.damage && (
        <p className="text-red-700 text-center">{errors.damage}</p>
      )}
    </div>
  );
};

export default Hitpoints;
